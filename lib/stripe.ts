import Stripe from "stripe";
import type { PlanType } from "@/types/database";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export type PackId = "roteiro_1" | "pacote_4" | "pacote_8";

interface PackConfig {
  label: string;
  amountCents: number;
  // Quantos roteiros (créditos) a compra libera.
  quantity: number;
}

// Venda por unidade: cada roteiro comprado vira uma linha `roteiro_unico_1pais`
// em `subscriptions`, sem roteiro atrelado até ser usado (ver lib/subscription.ts).
// Preços enviados como price_data inline no Checkout, não há Products/Prices
// pré-cadastrados no dashboard do Stripe.
export const PACKS: Record<PackId, PackConfig> = {
  roteiro_1: { label: "1 roteiro premium", amountCents: 8990, quantity: 1 },
  pacote_4: { label: "4 roteiros premium", amountCents: 29990, quantity: 4 },
  pacote_8: { label: "8 roteiros premium", amountCents: 49990, quantity: 8 },
};

// Prazo para usar os roteiros comprados; também é a janela de dicas Premium liberadas.
export const PACK_VALIDITY_MONTHS = 6;

// Planos Premium antigos, não são mais vendidos: só rotulam assinaturas já existentes.
export const PLANS = {
  roteiro_unico_1pais: { label: "Roteiro", accessMonths: 0 },
  premium_mensal: { label: "1 mês Ilimitado", accessMonths: 1 },
  premium_anual: { label: "Premium Anual", accessMonths: 12 },
} satisfies Record<PlanType, { label: string; accessMonths: number }>;
