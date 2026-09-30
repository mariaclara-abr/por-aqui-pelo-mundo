// Orquestração da IA que organiza roteiros já montados pelo usuário. A IA
// nunca inventa lugares fora do banco: ela reordena e agrupa por dia as
// atrações CONFIRMADAS pelo viajante e, opcionalmente, pode sugerir atrações
// extras — mas só a partir de um pool de "candidatas" que já é curadoria real
// do banco (mesma cidade do roteiro). Quem decide o que é confirmado ou
// sugestão é o servidor (por pertencimento ao conjunto de ids), nunca a IA.
// Distâncias reais são calculadas separadamente (lib/recommendations.ts), não
// pela IA.

import { getSystemPrompt, type TipoRoteiro } from "@/lib/prompts/roteiro-scripts";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5";

// Quantas atrações sugeridas (fora das confirmadas pelo viajante) a IA pode
// encaixar por dia, no máximo — mantém o roteiro sob controle do usuário.
export const MAX_SUGGESTIONS_PER_DAY = 2;

// Meta mínima de atrações por dia. Se o viajante escolheu poucas, a IA precisa
// completar os dias com sugestões do catálogo (sempre marcadas como sugestão).
export const MIN_ITEMS_PER_DAY = 3;

export function suggestionsPerDayLimit(confirmedCount: number, numDays: number): number {
  const needed = Math.max(0, numDays * MIN_ITEMS_PER_DAY - confirmedCount);
  return Math.max(MAX_SUGGESTIONS_PER_DAY, Math.ceil(needed / numDays));
}

export interface OrganizeAttractionInput {
  id: string;
  name: string;
  categories: string[];
  cityName: string;
  curationRating: number | null;
  averageVisitTime: string | null;
  bestTimeOfDay: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

// Hospedagem informada no questionário. hasHotel null = não respondeu.
export interface LodgingInput {
  hasHotel: boolean | null;
  hotelDetails: string | null;
}

export interface LodgingSuggestion {
  cityName: string;
  neighborhood: string;
  reason: string;
}

export interface AIItineraryResult {
  days: OrganizedDay[];
  lodging: LodgingSuggestion[];
}

export interface OrganizePreferencesInput {
  budget: string | null;
  pace: string | null;
  travelProfile: string | null;
  travelingWithKids: boolean | null;
  childrenAgeRanges: string[];
  interestCategories: string[];
  notes: string | null;
  // Campos específicos do tipo de roteiro, já com rótulo legível.
  extras: { label: string; value: string }[];
}

export interface OrganizeItineraryInput {
  tipoRoteiro: TipoRoteiro;
  attractions: OrganizeAttractionInput[];
  candidates: OrganizeAttractionInput[];
  numDays: number;
  startDate: string | null;
  preferences: OrganizePreferencesInput;
  lodging: LodgingInput;
}

export interface FromScratchItineraryInput {
  tipoRoteiro: TipoRoteiro;
  // Cidades que o viajante escolheu, na ordem em que ele as listou.
  chosenCityNames: string[];
  // true: o viajante já tem uma ordem e a IA deve respeitá-la.
  userDefinedOrder: boolean;
  // true: a IA pode incluir cidades extras presentes em `candidates`.
  allowExtraCities: boolean;
  allowExtraCountries: boolean;
  candidates: OrganizeAttractionInput[];
  numDays: number;
  startDate: string | null;
  preferences: OrganizePreferencesInput;
  lodging: LodgingInput;
}

export interface OrganizedDayItem {
  attractionId: string;
  order: number;
  suggestedStartTime: string | null;
  suggestedDurationMinutes: number | null;
}

export interface OrganizedDay {
  dayNumber: number;
  items: OrganizedDayItem[];
}

function describeAttraction(a: OrganizeAttractionInput, index: number): string {
  const parts = [
    `${index + 1}. id="${a.id}"`,
    a.name,
    `(${a.cityName})`,
    `| categorias: ${a.categories.join(", ")}`,
  ];
  if (a.curationRating != null) {
    parts.push(`| nota da curadoria: ${a.curationRating}/5`);
  }
  if (a.averageVisitTime) parts.push(`| tempo médio de visita: ${a.averageVisitTime}`);
  if (a.bestTimeOfDay) parts.push(`| melhor horário: ${a.bestTimeOfDay}`);
  if (a.latitude != null && a.longitude != null) {
    parts.push(`| coordenadas: ${a.latitude}, ${a.longitude}`);
  }
  return parts.join(" ");
}

function buildPreferenceLines(preferences: OrganizePreferencesInput): string[] {
  return [
    preferences.budget && `Orçamento: ${preferences.budget}`,
    preferences.pace && `Ritmo preferido: ${preferences.pace}`,
    preferences.travelProfile && `Perfil de viagem: ${preferences.travelProfile}`,
    preferences.travelingWithKids === true &&
      `Viaja com crianças${
        preferences.childrenAgeRanges.length > 0
          ? ` (faixas etárias: ${preferences.childrenAgeRanges.join(", ")})`
          : ""
      }`,
    preferences.interestCategories.length > 0 &&
      `Interesses prioritários: ${preferences.interestCategories.join(", ")}`,
    ...preferences.extras.map((e) =>
      e.value.includes("A IA pode recomendar")
        ? `${e.label}: ${e.value}. Onde o viajante pediu recomendação, sugira o melhor meio de deslocamento para cada trecho do roteiro, considerando faixa de custo, distância entre as atrações e o orçamento informado`
        : `${e.label}: ${e.value}`,
    ),
    preferences.notes && `Observações adicionais do viajante: ${preferences.notes}`,
  ].filter((line): line is string => Boolean(line));
}

function jsonFormat(withLodging: boolean): string {
  const days =
    '[{"day_number":1,"items":[{"attraction_id":"...","order":0,"suggested_start_time":"09:00","suggested_duration_minutes":90}]}]';
  return withLodging
    ? `{"days":${days},"lodging":[{"city_name":"...","neighborhood":"...","reason":"..."}]}`
    : `{"days":${days}}`;
}

// Bloco do prompt sobre hospedagem + o que a IA deve devolver a mais no JSON.
function buildLodgingBlock(lodging: LodgingInput): { text: string; wantsLodging: boolean } {
  if (lodging.hasHotel === true) {
    const hotel = lodging.hotelDetails ?? "(o viajante não informou o nome)";
    return {
      wantsLodging: false,
      text: `\nHospedagem: o viajante JÁ TEM hotel: ${hotel}. Monte o roteiro a partir dele: cada dia deve começar e terminar perto do hotel, agrupando as atrações mais próximas dele no mesmo dia e evitando idas e vindas longas. Use as coordenadas das atrações e o que você souber sobre a localização do hotel.\n`,
    };
  }
  if (lodging.hasHotel === false) {
    return {
      wantsLodging: true,
      text: `\nHospedagem: o viajante AINDA NÃO TEM hotel. Para cada cidade do roteiro, indique no campo "lodging" UM bairro bem localizado para se hospedar, o mais próximo possível do conjunto de atrações que ele vai visitar naquela cidade (use as coordenadas das atrações). Em "reason", explique em uma frase curta, sem travessões, por que esse bairro é prático. Não cite nomes de hotéis.\n`,
    };
  }
  return { text: "", wantsLodging: false };
}

function buildPrompt(input: OrganizeItineraryInput): string {
  const attractionsList = input.attractions.map(describeAttraction).join("\n");
  const candidatesList = input.candidates.map(describeAttraction).join("\n");
  const preferenceLines = buildPreferenceLines(input.preferences);
  const perDay = suggestionsPerDayLimit(input.attractions.length, input.numDays);
  const mustFill = input.attractions.length < input.numDays * MIN_ITEMS_PER_DAY;
  const lodgingBlock = buildLodgingBlock(input.lodging);

  return `Tenho ${input.attractions.length} atrações já cadastradas e confirmadas em um roteiro de viagem de ${input.numDays} dia(s)${
    input.startDate ? `, começando em ${input.startDate}` : ""
  }.

Atrações CONFIRMADAS pelo viajante: todas devem aparecer em algum dia do roteiro final (use exatamente os "id" fornecidos, não invente novas atrações, nomes ou ids):
${attractionsList}
${
  input.candidates.length > 0
    ? `\nAtrações SUGERIDAS: já são curadoria real cadastrada nas mesmas cidades do roteiro, mas o viajante ainda não escolheu nenhuma delas. ${
        mustFill
          ? `Como há poucas atrações confirmadas para ${input.numDays} dia(s), é OBRIGATÓRIO completar o roteiro com sugestões: nenhum dia pode ficar vazio, e cada dia deve ter pelo menos ${MIN_ITEMS_PER_DAY} atrações no total (confirmadas mais sugeridas), com até ${perDay} sugeridas por dia. Escolha as que combinem melhor (mesma cidade do dia, perto das confirmadas).`
          : `Você PODE (não é obrigatório) encaixar até ${perDay} delas por dia, só quando combinarem bem (mesma cidade do dia, ritmo compatível, sem lotar a agenda).`
      } Use exatamente os "id" fornecidos:\n${candidatesList}\n`
    : ""
}
${
  preferenceLines.length > 0
    ? `\nPreferências do viajante:\n${preferenceLines.join("\n")}\n`
    : ""
}
${lodgingBlock.text}
Organize a ordem ideal de visita, dividindo as atrações confirmadas (e as sugeridas que você escolher incluir) entre os ${input.numDays} dia(s) de forma equilibrada. Considere o tempo médio de visita, o melhor horário sugerido de cada atração, e agrupe por proximidade (mesma cidade) sempre que possível. Sugira um horário de início (formato "HH:MM") para cada atração, normalmente começando por volta das 09:00.

Responda APENAS com um JSON válido, sem nenhum texto antes ou depois e sem markdown, seguindo exatamente este formato:
${jsonFormat(lodgingBlock.wantsLodging)}`;
}

function validateOrganizedDays(value: unknown, validIds: string[]): OrganizedDay[] {
  const validIdSet = new Set(validIds);
  const record = value as { days?: unknown };
  if (!record || !Array.isArray(record.days)) {
    throw new Error("A IA retornou um formato inesperado.");
  }

  const days: OrganizedDay[] = [];
  for (const rawDay of record.days) {
    const day = rawDay as { day_number?: unknown; items?: unknown };
    if (typeof day.day_number !== "number" || !Array.isArray(day.items)) continue;

    const items: OrganizedDayItem[] = [];
    for (const rawItem of day.items) {
      const item = rawItem as Record<string, unknown>;
      const attractionId = item.attraction_id;
      // Nunca confia em ids que a IA possa ter inventado — descarta qualquer
      // item que não corresponda a uma atração realmente cadastrada no roteiro.
      if (typeof attractionId !== "string" || !validIdSet.has(attractionId)) continue;

      items.push({
        attractionId,
        order: typeof item.order === "number" ? item.order : items.length,
        suggestedStartTime:
          typeof item.suggested_start_time === "string" ? item.suggested_start_time : null,
        suggestedDurationMinutes:
          typeof item.suggested_duration_minutes === "number"
            ? item.suggested_duration_minutes
            : null,
      });
    }

    if (items.length > 0) {
      days.push({ dayNumber: day.day_number, items });
    }
  }

  if (days.length === 0) {
    throw new Error("A IA não retornou nenhum dia organizado.");
  }

  return days;
}

function parseLodging(value: unknown): LodgingSuggestion[] {
  const raw = (value as { lodging?: unknown })?.lodging;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => entry as Record<string, unknown>)
    .filter(
      (e) => typeof e.city_name === "string" && typeof e.neighborhood === "string" && e.neighborhood.trim(),
    )
    .slice(0, 10)
    .map((e) => ({
      cityName: (e.city_name as string).slice(0, 80),
      neighborhood: (e.neighborhood as string).slice(0, 80),
      reason: typeof e.reason === "string" ? e.reason.slice(0, 300) : "",
    }));
}

// Ritmo escolhido define quantas atrações por dia pedimos à IA quando não
// há nenhuma atração confirmada (roteiro do zero) — sem confirmadas, não há
// como calcular uma quantidade "natural" a partir do que já foi escolhido.
const FROM_SCRATCH_DAILY_COUNT_BY_PACE: Record<string, string> = {
  // Calibrado nos roteiros reais da curadoria: dias de serra/ilha têm 2 a 3
  // paradas; cidades europeias (Atenas, Florença, Nice) chegam a 7 a 10
  // (complexos como a Acrópole contam como 1; refeições não contam).
  tranquilo: "2 a 3",
  moderado: "4 a 6",
  intenso: "7 a 10",
};

function buildDestinationBlock(input: FromScratchItineraryInput): string {
  const chosen = input.chosenCityNames.join(", ");
  const lines: string[] = [];
  if (input.chosenCityNames.length > 1) {
    lines.push(
      input.userDefinedOrder
        ? `Ordem dos destinos definida pelo viajante (respeite exatamente, sem reordenar): ${input.chosenCityNames.join(" > ")}.`
        : `A ordem dos destinos fica por sua conta: defina a melhor sequência de visita entre ${chosen}, pensando numa rota lógica com deslocamentos curtos entre uma cidade e a próxima.`,
    );
  }
  if (input.allowExtraCities) {
    lines.push(
      `O viajante AUTORIZOU você a incluir cidades extras além de ${chosen}; as atrações delas estão na lista abaixo. Inclua uma cidade extra apenas se combinar de verdade com o perfil, os interesses, o ritmo, o orçamento e as observações do viajante e ficar no caminho das cidades escolhidas. As cidades escolhidas continuam sendo a base do roteiro.`,
    );
  }
  if (input.allowExtraCountries) {
    lines.push(
      `O viajante também AUTORIZOU incluir OUTRO país além dos escolhidos; as atrações de cidades de outros países estão na lista abaixo. Inclua um país extra apenas se combinar de verdade com o destino, o perfil, o ritmo e o orçamento e for um deslocamento razoável a partir dos países escolhidos. Não é obrigatório incluir.`,
    );
  }
  return lines.length > 0 ? `\n${lines.join("\n")}\n` : "";
}

function buildFromScratchPrompt(input: FromScratchItineraryInput): string {
  const candidatesList = input.candidates.map(describeAttraction).join("\n");
  const cityNames = input.chosenCityNames;
  const preferenceLines = buildPreferenceLines(input.preferences);
  const lodgingBlock = buildLodgingBlock(input.lodging);
  const dailyCount =
    (input.preferences.pace && FROM_SCRATCH_DAILY_COUNT_BY_PACE[input.preferences.pace]) ||
    "3 a 4";

  return `Monte um roteiro de viagem do zero, com ${input.numDays} dia(s)${
    input.startDate ? `, começando em ${input.startDate}` : ""
  }, para ${cityNames.join(", ")}.

O viajante ainda não escolheu nenhuma atração específica: monte o roteiro inteiro escolhendo entre as opções da curadoria abaixo (nunca invente lugares fora desta lista; use exatamente os "id" fornecidos):
${candidatesList}
${
  preferenceLines.length > 0
    ? `\nPreferências do viajante:\n${preferenceLines.join("\n")}\n`
    : ""
}
${buildDestinationBlock(input)}${lodgingBlock.text}
Escolha cerca de ${dailyCount} atrações por dia. Se houver mais de uma cidade entre as opções, agrupe dias consecutivos na mesma cidade em vez de intercalar cidades diferentes no mesmo dia. Priorize atrações com nota de curadoria mais alta e que combinem com o perfil, o ritmo e os interesses do viajante. Considere o tempo médio de visita e o melhor horário sugerido de cada atração. Sugira um horário de início (formato "HH:MM") para cada atração, normalmente começando por volta das 09:00.

Responda APENAS com um JSON válido, sem nenhum texto antes ou depois e sem markdown, seguindo exatamente este formato:
${jsonFormat(lodgingBlock.wantsLodging)}`;
}

async function callAnthropicForItinerary(prompt: string, tipo: TipoRoteiro, numDays: number): Promise<unknown> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY não configurada no servidor.");
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      // Cresce com o nº de dias: roteiros longos têm muitos itens em JSON.
      max_tokens: Math.min(16000, 2048 + numDays * 450),
      system: getSystemPrompt(tipo),
      messages: [
        { role: "user", content: prompt },
        // Prefill do turno do assistente: força a resposta a começar direto
        // com "{", evitando que o modelo abra com explicações ou markdown.
        { role: "assistant", content: "{" },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Falha ao chamar a API da Anthropic (${response.status}): ${errorBody.slice(0, 300)}`,
    );
  }

  const data = await response.json();
  const text: unknown = data?.content?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Resposta inesperada da API da Anthropic.");
  }

  try {
    return JSON.parse(`{${text}`);
  } catch {
    throw new Error("Não foi possível interpretar a resposta da IA como JSON.");
  }
}

export async function organizeItineraryWithAI(
  input: OrganizeItineraryInput,
): Promise<AIItineraryResult> {
  const parsed = await callAnthropicForItinerary(buildPrompt(input), input.tipoRoteiro, input.numDays);

  return {
    days: validateOrganizedDays(parsed, [
      ...input.attractions.map((a) => a.id),
      ...input.candidates.map((a) => a.id),
    ]),
    lodging: input.lodging.hasHotel === false ? parseLodging(parsed) : [],
  };
}

// Roteiro do zero: sem nenhuma atração confirmada, a IA escolhe livremente
// dentro do pool de candidatas (curadoria real das cidades escolhidas).
export async function buildItineraryFromScratchWithAI(
  input: FromScratchItineraryInput,
): Promise<AIItineraryResult> {
  const parsed = await callAnthropicForItinerary(
    buildFromScratchPrompt(input),
    input.tipoRoteiro,
    input.numDays,
  );

  return {
    days: validateOrganizedDays(
      parsed,
      input.candidates.map((a) => a.id),
    ),
    lodging: input.lodging.hasHotel === false ? parseLodging(parsed) : [],
  };
}
