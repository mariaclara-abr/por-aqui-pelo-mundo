import Stripe from "stripe";
import type { PlanType } from "@/types/database";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

interface PlanConfig {
  label: string;
  amountCents: number;
  mode: "payment" | "subscription";
  interval?: "month" | "year";
  // Pagamento único que libera o Premium por N meses (sem renovação).
  accessMonths?: number;
}

// Preços definidos aqui e enviados como price_data inline no Checkout —
// não há Products/Prices pré-cadastrados no dashboard do Stripe.
export const PLANS: Record<PlanType, PlanConfig> = {
  roteiro_unico_1pais: {
    label: "Roteiro Único",
    amountCents: 4990,
    mode: "payment",
  },
  premium_mensal: {
    label: "1 mês Ilimitado",
    amountCents: 6990,
    mode: "payment",
    accessMonths: 1,
  },
  premium_anual: {
    label: "Premium Anual",
    amountCents: 29880,
    mode: "payment",
    accessMonths: 12,
  },
};
