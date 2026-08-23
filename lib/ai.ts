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
  category: string;
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
}

export interface OrganizeItineraryInput {
  attractions: OrganizeAttractionInput[];
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
    `| categoria: ${a.category}`,
  ];
  if (a.curationRating != null) {
    parts.push(`| nota da curadoria: ${a.curationRating}/5`);
  }
  if (a.averageVisitTime) parts.push(`| tempo médio de visita: ${a.averageVisitTime}`);
  if (a.bestTimeOfDay) parts.push(`| melhor horário: ${a.bestTimeOfDay}`);
  return parts.join(" ");
}

function buildPrompt(input: OrganizeItineraryInput): string {
  const attractionsList = input.attractions.map(describeAttraction).join("\n");
  const candidatesList = input.candidates.map(describeAttraction).join("\n");

  const preferenceLines = [
    input.preferences.budget && `Orçamento: ${input.preferences.budget}`,
    input.preferences.pace && `Ritmo preferido: ${input.preferences.pace}`,
    input.preferences.travelProfile && `Perfil de viagem: ${input.preferences.travelProfile}`,
    input.preferences.travelingWithKids === true &&
      `Viaja com crianças${
        input.preferences.childrenAgeRanges.length > 0
          ? ` (faixas etárias: ${input.preferences.childrenAgeRanges.join(", ")})`
          : ""
      }`,
  ].filter((line): line is string => Boolean(line));

  return `Tenho ${input.attractions.length} atrações já cadastradas e confirmadas em um roteiro de viagem de ${input.numDays} dia(s)${
    input.startDate ? `, começando em ${input.startDate}` : ""
  }.

Atrações CONFIRMADAS pelo viajante — todas devem aparecer em algum dia do roteiro final (use exatamente os "id" fornecidos, não invente novas atrações, nomes ou ids):
${attractionsList}
${
  input.candidates.length > 0
    ? `\nAtrações SUGERIDAS — já são curadoria real cadastrada nas mesmas cidades do roteiro, mas o viajante ainda não escolheu nenhuma delas. Você PODE (não é obrigatório) encaixar até ${MAX_SUGGESTIONS_PER_DAY} delas por dia, só quando combinarem bem (mesma cidade do dia, ritmo compatível, sem lotar a agenda). Use exatamente os "id" fornecidos:\n${candidatesList}\n`
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

export async function organizeItineraryWithAI(
  input: OrganizeItineraryInput,
): Promise<OrganizedDay[]> {
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
        { role: "user", content: buildPrompt(input) },
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

  let parsed: unknown;
  try {
    parsed = JSON.parse(`{${text}`);
  } catch {
    throw new Error("Não foi possível interpretar a resposta da IA como JSON.");
  }

  return validateOrganizedDays(parsed, [
    ...input.attractions.map((a) => a.id),
    ...input.candidates.map((a) => a.id),
  ]);
}
