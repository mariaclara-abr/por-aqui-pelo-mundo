import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, PACKS, PACK_VALIDITY_MONTHS, type PackId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";

function toIso(unixSeconds: number | null | undefined) {
  return unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null;
}

// Desde a versão da API usada pelo SDK instalado, `current_period_end` fica
// no item da assinatura, não mais na assinatura em si (cada item pode ter um
// ciclo de cobrança próprio). Nossos planos sempre têm um único item.
function subscriptionPeriodEnd(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.current_period_end ?? null;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  const userId = session.metadata?.supabase_user_id;
  const pack = PACKS[session.metadata?.plan_type as PackId];

  if (!userId || !pack) return;

  // Stripe reenvia eventos: não credita duas vezes a mesma sessão.
  const { count } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("stripe_checkout_session_id", session.id);
  if (count) return;

  const end = new Date();
  end.setMonth(end.getMonth() + PACK_VALIDITY_MONTHS);
  const expiration = end.toISOString();

  // Um crédito por roteiro, sem itinerary_id até o usuário usá-lo.
  const { error } = await supabase.from("subscriptions").insert(
    Array.from({ length: pack.quantity }, () => ({
      user_id: userId,
      plan_type: "roteiro_unico_1pais" as const,
      expiration_date: expiration,
      tips_unlock_expiration: expiration,
      is_active: true,
      stripe_customer_id:
        typeof session.customer === "string"
          ? session.customer
          : (session.customer?.id ?? null),
      stripe_checkout_session_id: session.id,
    })),
  );

  if (error) throw error;
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = createAdminClient();
  const isActive =
    subscription.status === "active" || subscription.status === "trialing";

  const { error } = await supabase
    .from("subscriptions")
    .update({
      expiration_date: toIso(subscriptionPeriodEnd(subscription)),
      is_active: isActive,
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) throw error;
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("subscriptions")
    .update({ is_active: false })
    .eq("stripe_subscription_id", subscription.id);

  if (error) throw error;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook não configurado." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Assinatura inválida.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
    }
  } catch (error) {
    console.error("Erro ao processar webhook do Stripe:", error);
    return NextResponse.json(
      { error: "Erro ao processar evento." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
