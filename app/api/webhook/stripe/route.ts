import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-admin";
import { computeTipsUnlockExpiration } from "@/lib/subscription";
import type { PlanType } from "@/types/database";

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
  const planType = session.metadata?.plan_type as PlanType | undefined;
  const itineraryId = session.metadata?.itinerary_id || null;

  if (!userId || !planType) return;

  let expirationDate: string | null = null;
  let stripeSubscriptionId: string | null = null;

  if (session.mode === "subscription" && session.subscription) {
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription.id;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    expirationDate = toIso(subscriptionPeriodEnd(subscription));
    stripeSubscriptionId = subscription.id;
  }

  const tipsUnlockExpiration =
    planType === "roteiro_unico_1pais" ? computeTipsUnlockExpiration() : null;

  const { error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    plan_type: planType,
    itinerary_id: itineraryId,
    expiration_date: expirationDate,
    tips_unlock_expiration: tipsUnlockExpiration,
    is_active: true,
    stripe_customer_id:
      typeof session.customer === "string"
        ? session.customer
        : (session.customer?.id ?? null),
    stripe_subscription_id: stripeSubscriptionId,
    stripe_checkout_session_id: session.id,
  });

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
