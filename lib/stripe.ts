import Stripe from "stripe";
import type { PlanType } from "@/types/database";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

interface PlanConfig {
  label: string;
  amountCents: number;
  mode: "payment" | "subscription";
  interval?: "month" | "year";
}

// Preços definidos aqui e enviados como price_data inline no Checkout —
// não há Products/Prices pré-cadastrados no dashboard do Stripe.
export const PLANS: Record<PlanType, PlanConfig> = {
  roteiro_unico_1pais: {
    label: "Roteiro Inteligente",
    amountCents: 1990,
    mode: "payment",
  },
  premium_mensal: {
    label: "Premium Mensal",
    amountCents: 2990,
    mode: "subscription",
    interval: "month",
  },
  premium_anual: {
    label: "Premium Anual",
    amountCents: 9990,
    mode: "subscription",
    interval: "year",
  },
};
