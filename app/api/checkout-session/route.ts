import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getItineraryForAIById } from "@/lib/itinerary-ai";
import { countDistinctCountries } from "@/lib/subscription";
import { stripe, PLANS } from "@/lib/stripe";
import type { PlanType } from "@/types/database";

interface RequestBody {
  plan?: string;
  itinerary_id?: string;
  return_to?: string;
}

function isPlanType(value: string): value is PlanType {
  return value in PLANS;
}

// Só aceita caminhos relativos internos como destino pós-checkout — evita
// que o parâmetro vindo do cliente vire um open redirect.
function sanitizeReturnPath(path: string | undefined): string {
  if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  return "/meu-roteiro/organizar-com-ia";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RequestBody | null;
  if (!body?.plan || !isPlanType(body.plan)) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  const plan = PLANS[body.plan];
  let itineraryId: string | null = null;

  if (body.plan === "roteiro_unico_1pais") {
    if (!body.itinerary_id) {
      return NextResponse.json(
        { error: "itinerary_id é obrigatório para este plano." },
        { status: 400 },
      );
    }

    const itinerary = await getItineraryForAIById(body.itinerary_id);
    if (!itinerary) {
      return NextResponse.json(
        { error: "Roteiro não encontrado." },
        { status: 404 },
      );
    }

    const countryCount = countDistinctCountries(itinerary.attractions);
    if (countryCount > 1) {
      return NextResponse.json(
        {
          error:
            "Este roteiro tem mais de 1 país. O plano avulso só vale para roteiros de 1 país. Escolha um plano Premium.",
        },
        { status: 400 },
      );
    }

    itineraryId = itinerary.itineraryId;
  }

  const existingCustomers = await stripe.customers.list({
    email: user.email,
    limit: 1,
  });
  const customerId =
    existingCustomers.data[0]?.id ??
    (
      await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
    ).id;

  const origin = new URL(request.url).origin;
  const returnPath = sanitizeReturnPath(body.return_to);
  const metadata: Record<string, string> = {
    supabase_user_id: user.id,
    plan_type: body.plan,
    itinerary_id: itineraryId ?? "",
  };

  const session = await stripe.checkout.sessions.create({
    mode: plan.mode,
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          unit_amount: plan.amountCents,
          product_data: { name: plan.label },
          ...(plan.mode === "subscription"
            ? { recurring: { interval: plan.interval! } }
            : {}),
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}${returnPath}?checkout=success`,
    cancel_url: `${origin}${returnPath}?checkout=cancelled`,
    metadata,
    ...(plan.mode === "subscription"
      ? { subscription_data: { metadata } }
      : {}),
  });

  return NextResponse.json({ url: session.url });
}
