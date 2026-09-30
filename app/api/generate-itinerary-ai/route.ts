import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  getAttractionsForCities,
  getCandidateAttractions,
  getHotelsForCities,
  getCitySlugsInOtherCountries,
  getOtherCitySlugsInCountries,
  getCountrySlugsForCities,
  getItineraryForAIById,
  type AIAttraction,
} from "@/lib/itinerary-ai";
import { canUseAIForItinerary, countDistinctCountries } from "@/lib/subscription";
import {
  buildItineraryFromScratchWithAI,
  organizeItineraryWithAI,
  MIN_ITEMS_PER_DAY,
  suggestionsPerDayLimit,
  type OrganizeAttractionInput,
  type LodgingSuggestion,
  type OrganizedDay,
} from "@/lib/ai";
import { TIPOS_ROTEIRO, type TipoRoteiro } from "@/lib/prompts/roteiro-scripts";
import type {
  BudgetRange,
  TravelPace,
  TravelProfile,
} from "@/types/database";

interface RequestBody {
  itinerary_id?: string;
  num_days?: number;
  start_date?: string | null;
  tipo_roteiro?: string;
  from_scratch?: boolean;
  city_slugs?: string[];
  destination_order?: "ai" | "user";
  suggest_cities?: boolean;
  suggest_countries?: boolean;
  lodging?: { has_hotel?: boolean | null; hotel_details?: string | null } | null;
  preferences?: {
    budget?: BudgetRange | null;
    travel_pace?: TravelPace | null;
    travel_profile?: TravelProfile | null;
    traveling_with_kids?: boolean | null;
    children_age_ranges?: string[];
    interest_categories?: string[];
    notes?: string | null;
    extras?: { label?: unknown; value?: unknown }[];
  };
}

const MAX_DAYS = 90;

function toOrganizeAttractionInput(a: AIAttraction): OrganizeAttractionInput {
  return {
    id: a.id,
    name: a.name,
    categories: a.categories,
    cityName: a.cityName,
    curationRating: a.curationRating,
    averageVisitTime: a.averageVisitTime,
    bestTimeOfDay: a.bestTimeOfDay,
    latitude: a.latitude,
    longitude: a.longitude,
  };
}

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

  const tipoRoteiro: TipoRoteiro = TIPOS_ROTEIRO.includes(body.tipo_roteiro as TipoRoteiro)
    ? (body.tipo_roteiro as TipoRoteiro)
    : "internacional";

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

  // Sem nenhuma atração confirmada, este é um roteiro "do zero": a IA monta
  // tudo a partir dos destinos escolhidos pelo viajante, em vez de organizar
  // atrações já escolhidas.
  const isFromScratch = body.from_scratch === true || itinerary.attractions.length === 0;

  const fromScratchCitySlugs = Array.isArray(body.city_slugs)
    ? [...new Set(body.city_slugs.filter((slug): slug is string => typeof slug === "string" && slug.length > 0))]
    : [];

  if (isFromScratch && fromScratchCitySlugs.length === 0) {
    return NextResponse.json(
      { error: "Escolha pelo menos um destino para a IA montar o roteiro." },
      { status: 400 },
    );
  }

  let countryCount: number;
  let fromScratchCountrySlugs: string[] = [];
  if (isFromScratch) {
    let countrySlugs: string[];
    try {
      countrySlugs = await getCountrySlugsForCities(fromScratchCitySlugs);
    } catch {
      return NextResponse.json(
        { error: "Não foi possível validar os destinos escolhidos." },
        { status: 500 },
      );
    }
    if (countrySlugs.length === 0) {
      return NextResponse.json({ error: "Destinos inválidos." }, { status: 400 });
    }
    countryCount = countrySlugs.length;
    fromScratchCountrySlugs = countrySlugs;
  } else {
    countryCount = countDistinctCountries(itinerary.attractions);
  }

  const access = await canUseAIForItinerary(
    supabase,
    user.id,
    itinerary.itineraryId,
    countryCount,
  );
  if (!access.allowed) {
    return NextResponse.json(
      {
        error:
          access.reason === "needs_premium"
            ? isFromScratch
              ? "Você escolheu destinos em mais de 1 país. Assine o Premium para montar esse roteiro com IA."
              : "Este roteiro tem mais de 1 país. Assine o Premium para organizá-lo com IA."
            : "Organizar com IA é um recurso pago. Escolha um plano para continuar.",
        reason: access.reason,
        countryCount: access.countryCount,
      },
      { status: 403 },
    );
  }

  let candidates: AIAttraction[] = [];
  const allowExtraCities = isFromScratch && body.suggest_cities === true;
  // Outro país só para Premium (Roteiro Único vale para 1 país) e só em viagem internacional.
  const allowExtraCountries =
    isFromScratch &&
    body.suggest_countries === true &&
    access.reason === "premium" &&
    tipoRoteiro === "internacional";
  if (isFromScratch) {
    try {
      // Ritmo intenso chega a 10 atrações por dia: o pool precisa comportar isso.
      candidates = await getAttractionsForCities(
        fromScratchCitySlugs,
        Math.max(15, Math.ceil((numDays * 10) / fromScratchCitySlugs.length)),
      );
      if (allowExtraCities) {
        const extraSlugs = await getOtherCitySlugsInCountries(
          fromScratchCountrySlugs,
          fromScratchCitySlugs,
        );
        candidates.push(...(await getAttractionsForCities(extraSlugs, 4)));
      }
      if (allowExtraCountries) {
        const otherSlugs = await getCitySlugsInOtherCountries(fromScratchCountrySlugs);
        candidates.push(...(await getAttractionsForCities(otherSlugs, 3)));
      }
    } catch {
      return NextResponse.json(
        { error: "Não foi possível buscar as atrações da curadoria para esses destinos." },
        { status: 500 },
      );
    }
    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "Ainda não temos atrações cadastradas para os destinos escolhidos." },
        { status: 400 },
      );
    }
  } else {
    try {
      const cityCount = new Set(itinerary.attractions.map((a) => a.citySlug)).size;
      candidates = await getCandidateAttractions(
        itinerary,
        Math.max(6, Math.ceil((numDays * MIN_ITEMS_PER_DAY) / Math.max(1, cityCount))),
      );
    } catch {
      // Sugestões são um bônus opcional — se a busca de candidatas falhar, a
      // organização das atrações confirmadas segue normalmente sem sugestões.
      candidates = [];
    }
  }

  const preferences = {
    budget: body.preferences?.budget ?? null,
    pace: body.preferences?.travel_pace ?? null,
    travelProfile: body.preferences?.travel_profile ?? null,
    travelingWithKids: body.preferences?.traveling_with_kids ?? null,
    childrenAgeRanges: body.preferences?.children_age_ranges ?? [],
    interestCategories: body.preferences?.interest_categories ?? [],
    notes: body.preferences?.notes ?? null,
    extras: (Array.isArray(body.preferences?.extras) ? body.preferences.extras : [])
      .filter(
        (e): e is { label: string; value: string } =>
          typeof e?.label === "string" && typeof e?.value === "string" && e.value.trim() !== "",
      )
      .slice(0, 30)
      .map((e) => ({ label: e.label.slice(0, 80), value: e.value.slice(0, 300) })),
  };

  const lodging = {
    hasHotel: typeof body.lodging?.has_hotel === "boolean" ? body.lodging.has_hotel : null,
    hotelDetails:
      typeof body.lodging?.hotel_details === "string"
        ? body.lodging.hotel_details.trim().slice(0, 300) || null
        : null,
  };

  let organizedDays: OrganizedDay[];
  let lodgingSuggestions: LodgingSuggestion[];
  try {
    const generated = isFromScratch
      ? await buildItineraryFromScratchWithAI({
          tipoRoteiro,
          chosenCityNames: fromScratchCitySlugs
            .map((slug) => candidates.find((a) => a.citySlug === slug)?.cityName)
            .filter((name): name is string => !!name),
          userDefinedOrder: body.destination_order === "user",
          allowExtraCities,
          allowExtraCountries,
          candidates: candidates.map(toOrganizeAttractionInput),
          numDays,
          startDate: body.start_date ?? null,
          preferences,
          lodging,
        })
      : await organizeItineraryWithAI({
          tipoRoteiro,
          attractions: itinerary.attractions.map(toOrganizeAttractionInput),
          candidates: candidates.map(toOrganizeAttractionInput),
          numDays,
          startDate: body.start_date ?? null,
          preferences,
          lodging,
        });
    organizedDays = generated.days;
    lodgingSuggestions = generated.lodging;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao gerar o roteiro com IA.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // No modo "do zero" as atrações já salvas no roteiro são ignoradas nesta geração.
  const confirmedIds = new Set(isFromScratch ? [] : itinerary.attractions.map((a) => a.id));

  // Garante que nenhuma atração CONFIRMADA fique de fora, mesmo que a IA
  // tenha esquecido de posicionar alguma — sugestão é opcional, mas o que o
  // viajante já escolheu tem que aparecer sempre.
  const placedIds = new Set(
    organizedDays.flatMap((day) => day.items.map((item) => item.attractionId)),
  );
  const missing = isFromScratch ? [] : itinerary.attractions.filter((a) => !placedIds.has(a.id));
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
  // descarta uma atração confirmada. No modo "do zero" não há atração
  // confirmada nenhuma — todo o roteiro é feito de "sugestões" por
  // definição, então esse limite não se aplica.
  if (!isFromScratch) {
    const suggestionLimit = suggestionsPerDayLimit(itinerary.attractions.length, numDays);
    for (const day of organizedDays) {
      let suggestionCount = 0;
      day.items = day.items.filter((item) => {
        if (confirmedIds.has(item.attractionId)) return true;
        suggestionCount += 1;
        return suggestionCount <= suggestionLimit;
      });
    }
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
            categories: attraction.categories,
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

  // Sem hotel: além do bairro sugerido pela IA, lista os hotéis da curadoria
  // nas cidades do roteiro (vêm do banco, nunca inventados).
  let siteHotels: AIAttraction[] = [];
  if (lodging.hasHotel === false) {
    const citySlugs = isFromScratch
      ? fromScratchCitySlugs
      : [...new Set(itinerary.attractions.map((a) => a.citySlug))];
    siteHotels = await getHotelsForCities(citySlugs).catch(() => []);
  }

  // Cidades que a IA incluiu por conta própria (só existe com suggest_cities).
  const chosenSet = new Set(fromScratchCitySlugs);
  const addedCities = allowExtraCities || allowExtraCountries
    ? [
        ...new Set(
          days.flatMap((d) =>
            d.items.filter((i) => !chosenSet.has(i.citySlug)).map((i) => i.cityName),
          ),
        ),
      ]
    : [];

  return NextResponse.json({
    itineraryTitle: itinerary.title,
    days,
    addedCities,
    lodging:
      lodging.hasHotel === null
        ? null
        : {
            hasHotel: lodging.hasHotel,
            hotelDetails: lodging.hotelDetails,
            neighborhoods: lodgingSuggestions,
            siteHotels: siteHotels.map((h) => ({
              name: h.name,
              slug: h.slug,
              citySlug: h.citySlug,
              countrySlug: h.countrySlug,
              cityName: h.cityName,
            })),
          },
  });
}
