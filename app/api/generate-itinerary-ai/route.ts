import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  getCandidateAttractions,
  getItineraryForAIById,
  type AIAttraction,
} from "@/lib/itinerary-ai";
import { canUseAIForItinerary } from "@/lib/subscription";
import {
  organizeItineraryWithAI,
  MAX_SUGGESTIONS_PER_DAY,
  type OrganizedDay,
} from "@/lib/ai";
import type {
  BudgetRange,
  TravelPace,
  TravelProfile,
} from "@/types/database";

interface RequestBody {
  itinerary_id?: string;
  num_days?: number;
  start_date?: string | null;
  preferences?: {
    budget?: BudgetRange | null;
    travel_pace?: TravelPace | null;
    travel_profile?: TravelProfile | null;
    traveling_with_kids?: boolean | null;
    children_age_ranges?: string[];
  };
}

const MAX_DAYS = 30;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;

  if (!body?.itinerary_id) {
    return NextResponse.json(
      { error: "itinerary_id é obrigatório." },
      { status: 400 },
    );
  }

  const numDays = Number(body.num_days);
  if (!Number.isInteger(numDays) || numDays < 1 || numDays > MAX_DAYS) {
    return NextResponse.json(
      { error: `num_days deve ser um número inteiro entre 1 e ${MAX_DAYS}.` },
      { status: 400 },
    );
  }

  let itinerary;
  try {
    itinerary = await getItineraryForAIById(body.itinerary_id);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível carregar o roteiro." },
      { status: 500 },
    );
  }

  if (!itinerary) {
    return NextResponse.json({ error: "Roteiro não encontrado." }, { status: 404 });
  }

  if (itinerary.attractions.length === 0) {
    return NextResponse.json(
      { error: "Este roteiro ainda não tem atrações para organizar." },
      { status: 400 },
    );
  }

  const access = await canUseAIForItinerary(supabase, user.id, itinerary);
  if (!access.allowed) {
    return NextResponse.json(
      {
        error:
          access.reason === "needs_premium"
            ? "Este roteiro tem mais de 1 país — assine o Premium para organizá-lo com IA."
            : "Organizar com IA é um recurso pago. Escolha um plano para continuar.",
        reason: access.reason,
        countryCount: access.countryCount,
      },
      { status: 403 },
    );
  }

  let candidates: AIAttraction[] = [];
  try {
    candidates = await getCandidateAttractions(itinerary);
  } catch {
    // Sugestões são um bônus opcional — se a busca de candidatas falhar, a
    // organização das atrações confirmadas segue normalmente sem sugestões.
    candidates = [];
  }

  const preferences = {
    budget: body.preferences?.budget ?? null,
    pace: body.preferences?.travel_pace ?? null,
    travelProfile: body.preferences?.travel_profile ?? null,
    travelingWithKids: body.preferences?.traveling_with_kids ?? null,
    childrenAgeRanges: body.preferences?.children_age_ranges ?? [],
  };

  let organizedDays: OrganizedDay[];
  try {
    organizedDays = await organizeItineraryWithAI({
      attractions: itinerary.attractions.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        cityName: a.cityName,
        curationRating: a.curationRating,
        averageVisitTime: a.averageVisitTime,
        bestTimeOfDay: a.bestTimeOfDay,
      })),
      candidates: candidates.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        cityName: a.cityName,
        curationRating: a.curationRating,
        averageVisitTime: a.averageVisitTime,
        bestTimeOfDay: a.bestTimeOfDay,
      })),
      numDays,
      startDate: body.start_date ?? null,
      preferences,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao gerar o roteiro com IA.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const confirmedIds = new Set(itinerary.attractions.map((a) => a.id));

  // Garante que nenhuma atração CONFIRMADA fique de fora, mesmo que a IA
  // tenha esquecido de posicionar alguma — sugestão é opcional, mas o que o
  // viajante já escolheu tem que aparecer sempre.
  const placedIds = new Set(
    organizedDays.flatMap((day) => day.items.map((item) => item.attractionId)),
  );
  const missing = itinerary.attractions.filter((a) => !placedIds.has(a.id));
  if (missing.length > 0) {
    const lastDay = organizedDays[organizedDays.length - 1];
    for (const attraction of missing) {
      lastDay.items.push({
        attractionId: attraction.id,
        order: lastDay.items.length,
        suggestedStartTime: null,
        suggestedDurationMinutes: null,
      });
    }
  }

  // Rede de segurança contra a IA ignorar o limite pedido no prompt: nunca
  // deixa mais que MAX_SUGGESTIONS_PER_DAY sugestões por dia, mas nunca
  // descarta uma atração confirmada.
  for (const day of organizedDays) {
    let suggestionCount = 0;
    day.items = day.items.filter((item) => {
      if (confirmedIds.has(item.attractionId)) return true;
      suggestionCount += 1;
      return suggestionCount <= MAX_SUGGESTIONS_PER_DAY;
    });
  }

  const attractionById = new Map<string, AIAttraction>([
    ...itinerary.attractions.map((a) => [a.id, a] as const),
    ...candidates.map((a) => [a.id, a] as const),
  ]);
  const startDate = body.start_date ? new Date(`${body.start_date}T00:00:00`) : null;

  const days = organizedDays
    .slice()
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((day) => {
      const sortedItems = day.items.slice().sort((a, b) => a.order - b.order);
      const date =
        startDate !== null
          ? new Date(startDate.getTime() + (day.dayNumber - 1) * 86_400_000)
              .toISOString()
              .slice(0, 10)
          : null;

      const items = sortedItems
        .map((item) => {
          const attraction = attractionById.get(item.attractionId);
          if (!attraction) return null;

          return {
            attractionId: attraction.id,
            name: attraction.name,
            slug: attraction.slug,
            citySlug: attraction.citySlug,
            countrySlug: attraction.countrySlug,
            cityName: attraction.cityName,
            category: attraction.category,
            curationRating: attraction.curationRating,
            description: attraction.description,
            coverPhotoUrl: attraction.coverPhotoUrl,
            latitude: attraction.latitude,
            longitude: attraction.longitude,
            suggestedStartTime: item.suggestedStartTime,
            suggestedDurationMinutes: item.suggestedDurationMinutes,
            isSuggestion: !confirmedIds.has(attraction.id),
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      return { dayNumber: day.dayNumber, date, items };
    });

  return NextResponse.json({ itineraryTitle: itinerary.title, days });
}
