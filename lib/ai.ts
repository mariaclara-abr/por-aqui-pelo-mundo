// Orquestração da IA que organiza roteiros já montados pelo usuário. A IA
// nunca inventa lugares fora do banco: ela reordena e agrupa por dia as
// atrações CONFIRMADAS pelo viajante e, opcionalmente, pode sugerir atrações
// extras — mas só a partir de um pool de "candidatas" que já é curadoria real
// do banco (mesma cidade do roteiro). Quem decide o que é confirmado ou
// sugestão é o servidor (por pertencimento ao conjunto de ids), nunca a IA.
// Distâncias reais são calculadas separadamente (lib/recommendations.ts), não
// pela IA.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5";

// Quantas atrações sugeridas (fora das confirmadas pelo viajante) a IA pode
// encaixar por dia, no máximo — mantém o roteiro sob controle do usuário.
export const MAX_SUGGESTIONS_PER_DAY = 2;

export interface OrganizeAttractionInput {
  id: string;
  name: string;
  categories: string[];
  cityName: string;
  curationRating: number | null;
  averageVisitTime: string | null;
  bestTimeOfDay: string | null;
}

export interface OrganizePreferencesInput {
  budget: string | null;
  pace: string | null;
  travelProfile: string | null;
  travelingWithKids: boolean | null;
  childrenAgeRanges: string[];
  interestCategories: string[];
  notes: string | null;
}

export interface OrganizeItineraryInput {
  attractions: OrganizeAttractionInput[];
  candidates: OrganizeAttractionInput[];
  numDays: number;
  startDate: string | null;
  preferences: OrganizePreferencesInput;
}

export interface FromScratchItineraryInput {
  candidates: OrganizeAttractionInput[];
  numDays: number;
  startDate: string | null;
  preferences: OrganizePreferencesInput;
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
    preferences.notes && `Observações adicionais do viajante: ${preferences.notes}`,
  ].filter((line): line is string => Boolean(line));
}

function buildPrompt(input: OrganizeItineraryInput): string {
  const attractionsList = input.attractions.map(describeAttraction).join("\n");
  const candidatesList = input.candidates.map(describeAttraction).join("\n");
  const preferenceLines = buildPreferenceLines(input.preferences);

  return `Tenho ${input.attractions.length} atrações já cadastradas e confirmadas em um roteiro de viagem de ${input.numDays} dia(s)${
    input.startDate ? `, começando em ${input.startDate}` : ""
  }.

Atrações CONFIRMADAS pelo viajante: todas devem aparecer em algum dia do roteiro final (use exatamente os "id" fornecidos, não invente novas atrações, nomes ou ids):
${attractionsList}
${
  input.candidates.length > 0
    ? `\nAtrações SUGERIDAS: já são curadoria real cadastrada nas mesmas cidades do roteiro, mas o viajante ainda não escolheu nenhuma delas. Você PODE (não é obrigatório) encaixar até ${MAX_SUGGESTIONS_PER_DAY} delas por dia, só quando combinarem bem (mesma cidade do dia, ritmo compatível, sem lotar a agenda). Use exatamente os "id" fornecidos:\n${candidatesList}\n`
    : ""
}
${
  preferenceLines.length > 0
    ? `\nPreferências do viajante:\n${preferenceLines.join("\n")}\n`
    : ""
}
Organize a ordem ideal de visita, dividindo as atrações confirmadas (e as sugeridas que você escolher incluir) entre os ${input.numDays} dia(s) de forma equilibrada. Considere o tempo médio de visita, o melhor horário sugerido de cada atração, e agrupe por proximidade (mesma cidade) sempre que possível. Sugira um horário de início (formato "HH:MM") para cada atração, normalmente começando por volta das 09:00.

Responda APENAS com um JSON válido, sem nenhum texto antes ou depois e sem markdown, seguindo exatamente este formato:
{"days":[{"day_number":1,"items":[{"attraction_id":"...","order":0,"suggested_start_time":"09:00","suggested_duration_minutes":90}]}]}`;
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

// Ritmo escolhido define quantas atrações por dia pedimos à IA quando não
// há nenhuma atração confirmada (roteiro do zero) — sem confirmadas, não há
// como calcular uma quantidade "natural" a partir do que já foi escolhido.
const FROM_SCRATCH_DAILY_COUNT_BY_PACE: Record<string, string> = {
  tranquilo: "2 a 3",
  moderado: "3 a 4",
  intenso: "4 a 5",
};

function buildFromScratchPrompt(input: FromScratchItineraryInput): string {
  const candidatesList = input.candidates.map(describeAttraction).join("\n");
  const cityNames = [...new Set(input.candidates.map((a) => a.cityName))];
  const preferenceLines = buildPreferenceLines(input.preferences);
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
Escolha cerca de ${dailyCount} atrações por dia. Se houver mais de uma cidade entre as opções, agrupe dias consecutivos na mesma cidade em vez de intercalar cidades diferentes no mesmo dia. Priorize atrações com nota de curadoria mais alta e que combinem com o perfil, o ritmo e os interesses do viajante. Considere o tempo médio de visita e o melhor horário sugerido de cada atração. Sugira um horário de início (formato "HH:MM") para cada atração, normalmente começando por volta das 09:00.

Responda APENAS com um JSON válido, sem nenhum texto antes ou depois e sem markdown, seguindo exatamente este formato:
{"days":[{"day_number":1,"items":[{"attraction_id":"...","order":0,"suggested_start_time":"09:00","suggested_duration_minutes":90}]}]}`;
}

async function callAnthropicForItinerary(prompt: string): Promise<unknown> {
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
      max_tokens: 4096,
      system:
        "Você organiza roteiros de viagem usando apenas os lugares fornecidos pelo usuário. Nunca invente atrações, ids ou dados que não foram fornecidos. Responda sempre em JSON puro, sem markdown e sem texto fora do JSON.",
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
): Promise<OrganizedDay[]> {
  const parsed = await callAnthropicForItinerary(buildPrompt(input));

  return validateOrganizedDays(parsed, [
    ...input.attractions.map((a) => a.id),
    ...input.candidates.map((a) => a.id),
  ]);
}

// Roteiro do zero: sem nenhuma atração confirmada, a IA escolhe livremente
// dentro do pool de candidatas (curadoria real das cidades escolhidas).
export async function buildItineraryFromScratchWithAI(
  input: FromScratchItineraryInput,
): Promise<OrganizedDay[]> {
  const parsed = await callAnthropicForItinerary(buildFromScratchPrompt(input));

  return validateOrganizedDays(
    parsed,
    input.candidates.map((a) => a.id),
  );
}
