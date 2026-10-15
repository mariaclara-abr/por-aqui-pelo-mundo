import { NextResponse } from "next/server";
import { after } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getCountrySlugsForCities, getItineraryForAIById } from "@/lib/itinerary-ai";
import { canUseAIForItinerary } from "@/lib/subscription";
import { executarPesquisa, type EntradaPremium } from "@/lib/premium-roteiro/gerar";
import { montarDestino } from "@/lib/premium-roteiro/destino";
import type { Json } from "@/types/database";

// A geração (pesquisa na web + composição) leva alguns minutos e roda em segundo
// plano depois da resposta; a tela acompanha pelo GET /api/premium-roteiro/[id].
export const maxDuration = 300;

const MAX_DAYS = 90;
// Pedido "gerando" há menos que isso é reaproveitado (evita gerar duas vezes por duplo clique).
const REAPROVEITA_MS = 15 * 60 * 1000;

interface RequestBody {
  itinerary_id?: string;
  num_days?: number;
  start_date?: string | null;
  city_slugs?: string[];
  destination_order?: "ai" | "user";
  lodging?: { has_hotel?: boolean | null; hotel_details?: string | null } | null;
  preferences?: {
    budget?: string | null;
    travel_pace?: string | null;
    travel_profile?: string | null;
    traveling_with_kids?: boolean | null;
    children_age_ranges?: string[];
    interest_categories?: string[];
    notes?: string | null;
    extras?: { label?: unknown; value?: unknown }[];
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body?.itinerary_id) {
    return NextResponse.json({ error: "itinerary_id é obrigatório." }, { status: 400 });
  }
  const numDays = Number(body.num_days);
  if (!Number.isInteger(numDays) || numDays < 1 || numDays > MAX_DAYS) {
    return NextResponse.json(
      { error: `num_days deve ser um número inteiro entre 1 e ${MAX_DAYS}.` },
      { status: 400 },
    );
  }
  const citySlugs = [
    ...new Set((body.city_slugs ?? []).filter((s): s is string => typeof s === "string" && s.length > 0)),
  ];
  if (citySlugs.length === 0) {
    return NextResponse.json({ error: "Escolha pelo menos um destino." }, { status: 400 });
  }

  // O roteiro precisa ser do usuário (a RLS devolve null para o de outra pessoa).
  const itinerary = await getItineraryForAIById(body.itinerary_id).catch(() => null);
  if (!itinerary) return NextResponse.json({ error: "Roteiro não encontrado." }, { status: 404 });

  const countrySlugs = await getCountrySlugsForCities(citySlugs).catch(() => []);
  if (countrySlugs.length === 0) return NextResponse.json({ error: "Destinos inválidos." }, { status: 400 });

  const admin = createAdminClient();

  // Duplo clique: devolve o que já está sendo gerado para este roteiro.
  const { data: existente } = await admin
    .from("premium_roteiros")
    .select("id, created_at")
    .eq("user_id", user.id)
    .eq("itinerary_id", itinerary.itineraryId)
    .eq("status", "gerando")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existente && Date.now() - new Date(existente.created_at).getTime() < REAPROVEITA_MS) {
    return NextResponse.json({ id: existente.id }, { status: 202 });
  }

  // Mesma regra de acesso e crédito do "Organizar com IA" (1 crédito por país).
  const access = await canUseAIForItinerary(supabase, user.id, itinerary.itineraryId, countrySlugs.length);
  if (!access.allowed) {
    return NextResponse.json(
      {
        error:
          access.reason === "needs_premium"
            ? "Este roteiro tem mais de 1 país. Assine o Premium para gerá-lo."
            : "O roteiro Premium é um recurso pago. Escolha um plano para continuar.",
        reason: access.reason,
        countryCount: access.countryCount,
      },
      { status: 403 },
    );
  }

  const extras = (Array.isArray(body.preferences?.extras) ? body.preferences.extras : [])
    .filter(
      (e): e is { label: string; value: string } =>
        typeof e?.label === "string" && typeof e?.value === "string" && e.value.trim() !== "",
    )
    .slice(0, 40)
    .map((e) => ({ label: e.label.slice(0, 80), value: e.value.slice(0, 300) }));

  const entrada: EntradaPremium = {
    citySlugs,
    userDefinedOrder: body.destination_order === "user",
    numDays,
    startDate: typeof body.start_date === "string" ? body.start_date : null,
    preferences: {
      budget: body.preferences?.budget ?? null,
      pace: body.preferences?.travel_pace ?? null,
      travelProfile: body.preferences?.travel_profile ?? null,
      travelingWithKids: body.preferences?.traveling_with_kids ?? null,
      childrenAgeRanges: body.preferences?.children_age_ranges ?? [],
      interestCategories: body.preferences?.interest_categories ?? [],
      notes: body.preferences?.notes?.slice(0, 600) ?? null,
      extras,
    },
    destino: await montarDestino(citySlugs).catch(() => null),
    lodging: {
      hasHotel: typeof body.lodging?.has_hotel === "boolean" ? body.lodging.has_hotel : null,
      hotelDetails:
        typeof body.lodging?.hotel_details === "string"
          ? body.lodging.hotel_details.trim().slice(0, 300) || null
          : null,
    },
  };

  const { data: criado, error } = await admin
    .from("premium_roteiros")
    .insert({
      user_id: user.id,
      itinerary_id: itinerary.itineraryId,
      entrada: entrada as unknown as Json,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: "Não foi possível iniciar o roteiro." }, { status: 500 });

  const origem = new URL(request.url).origin;
  after(() => executarPesquisa(criado.id, origem));
  return NextResponse.json({ id: criado.id }, { status: 202 });
}
