"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserSubscription } from "@/lib/useUserSubscription";
import type { PlanType } from "@/types/database";

const PLAN_INFO: Record<
  PlanType,
  { title: string; price: string; detail: string }
> = {
  roteiro_unico_1pais: {
    title: "Roteiro Inteligente",
    price: "R$ 19,90",
    detail: "Pagamento único · válido para este roteiro (máximo 1 país)",
  },
  premium_mensal: {
    title: "Premium Mensal",
    price: "R$ 29,90/mês",
    detail: "Roteiros ilimitados, qualquer número de países",
  },
  premium_anual: {
    title: "Premium Anual",
    price: "R$ 99,90/ano",
    detail: "Roteiros ilimitados, qualquer número de países",
  },
};

const MAX_POLL_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 1500;

function readCheckoutStatus() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("checkout");
}

export default function PaywallCard({
  itineraryId,
  countryCount,
  onAccessGranted,
}: {
  itineraryId: string;
  countryCount: number;
  onAccessGranted: () => void;
}) {
  const [checkoutStatus] = useState(readCheckoutStatus);
  const [confirming, setConfirming] = useState(checkoutStatus === "success");
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { refresh, isPremium, hasRoteiroUnicoFor } = useUserSubscription();

  // O redirecionamento de volta do Stripe pode chegar um pouco antes do
  // webhook terminar de gravar a assinatura — tenta de novo por alguns
  // segundos antes de desistir e mostrar o paywall normalmente.
  useEffect(() => {
    if (checkoutStatus !== "success") return;
    let attempts = 0;
    let cancelled = false;

    async function poll() {
      attempts += 1;
      await refresh();
      if (cancelled) return;
      if (attempts < MAX_POLL_ATTEMPTS) {
        setTimeout(poll, POLL_INTERVAL_MS);
      } else {
        setConfirming(false);
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutStatus]);

  useEffect(() => {
    if (isPremium || hasRoteiroUnicoFor(itineraryId)) {
      onAccessGranted();
    }
  }, [isPremium, itineraryId, hasRoteiroUnicoFor, onAccessGranted]);

  async function handleCheckout(plan: PlanType) {
    setLoadingPlan(plan);
    setError(null);

    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, itinerary_id: itineraryId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Não foi possível iniciar o pagamento.");
      }
      if (!data.url) throw new Error("Pagamento indisponível no momento.");

      window.location.assign(data.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível iniciar o pagamento.",
      );
      setLoadingPlan(null);
    }
  }

  if (confirming) {
    return (
      <div className="rounded-xl bg-branco p-8 text-center">
        <p className="font-serif text-lg text-tinta">
          Confirmando seu pagamento...
        </p>
        <p className="mt-1 text-sm text-oliva">Isso leva só alguns segundos.</p>
      </div>
    );
  }

  const plansToShow: PlanType[] =
    countryCount <= 1
      ? ["roteiro_unico_1pais", "premium_mensal", "premium_anual"]
      : ["premium_mensal", "premium_anual"];

  return (
    <div className="rounded-xl bg-branco p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-terracota">
        Recurso pago
      </p>
      <h2 className="mt-1 font-serif text-xl text-tinta">Organizar com IA</h2>

      {countryCount >= 2 ? (
        <p className="mt-2 text-sm text-oliva">
          Seu roteiro tem atrações em {countryCount} países. O plano avulso só
          vale para roteiros de até 1 país. Assine o Premium para organizar
          roteiros com múltiplos países, ou divida este roteiro em um roteiro
          por país em{" "}
          <Link href="/meu-roteiro" className="text-terracota hover:underline">
            Meu Roteiro
          </Link>
          .
        </p>
      ) : (
        <p className="mt-2 text-sm text-oliva">
          Escolha como quer desbloquear a organização por IA deste roteiro.
        </p>
      )}

      {checkoutStatus === "cancelled" && (
        <p className="mt-3 text-sm text-terracota">
          Pagamento cancelado. Tente novamente quando quiser.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {plansToShow.map((plan) => {
          const info = PLAN_INFO[plan];
          return (
            <button
              key={plan}
              type="button"
              onClick={() => handleCheckout(plan)}
              disabled={loadingPlan !== null}
              className="flex items-center justify-between gap-3 rounded-xl border border-oliva/20 p-4 text-left transition-colors hover:border-terracota hover:bg-terracota/5 disabled:opacity-60"
            >
              <div>
                <p className="font-serif text-base text-tinta">{info.title}</p>
                <p className="text-xs text-oliva">{info.detail}</p>
              </div>
              <span className="shrink-0 rounded-full bg-terracota px-4 py-2 text-sm font-medium text-white">
                {loadingPlan === plan ? "Aguarde..." : info.price}
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-terracota">{error}</p>}
    </div>
  );
}
