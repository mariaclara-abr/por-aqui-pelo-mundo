"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useUserSubscription } from "@/lib/useUserSubscription";
import type { PlanType } from "@/types/database";

const BENEFITS = [
  "Roteiro sob medida: montado com base no seu estilo e ritmo de viagem, não um modelo genérico",
  "IA organiza tudo por você: define ordem, horário e tempo ideal em cada atração",
  "Roteiro completo, dia a dia: sem lacunas, sem inventar na hora",
  "Baixe e leve com você: acesso total mesmo sem internet",
  "A IA descobre o que você ainda não sabe que quer: sugere atrações além das que você escolheu, alinhadas ao seu perfil",
  "Dicas exclusivas do destino: informação que não está em blog nenhum",
  "Economia garantida: evite armadilhas turísticas e gaste só no que vale a pena",
  "Suporte prioritário: resposta rápida quando você precisar",
];

const PLAN_INFO: Record<PlanType, { title: string; price: string; detail: string }> = {
  roteiro_unico_1pais: {
    title: "Roteiro Premium",
    price: "R$ 19,90",
    detail:
      "Pagamento único · válido para este roteiro (máximo 1 país) · cidades e atrações ilimitadas dentro dele",
  },
  premium_mensal: {
    title: "Premium Mensal",
    price: "R$ 29,90/mês",
    detail: "Acesso ilimitado ao Premium em qualquer roteiro enquanto durar a assinatura",
  },
  premium_anual: {
    title: "Premium Anual",
    price: "R$ 99,90/ano",
    detail: "Acesso ilimitado ao Premium em qualquer roteiro enquanto durar a assinatura",
  },
};

const MAX_POLL_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 1500;

function readCheckoutStatus() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("checkout");
}

export default function PremiumDialog({
  itineraryId,
  countryCount,
  onClose,
}: {
  itineraryId: string | null;
  countryCount: number;
  onClose: () => void;
}) {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, refresh } = useUserSubscription();
  const [checkoutStatus] = useState(readCheckoutStatus);
  const [confirming, setConfirming] = useState(checkoutStatus === "success");
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

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

  async function handleCheckout(plan: PlanType) {
    setLoadingPlan(plan);
    setError(null);

    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          plan,
          itinerary_id: plan === "roteiro_unico_1pais" ? itineraryId : undefined,
          return_to: "/meu-roteiro",
        }),
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

  const plansToShow: PlanType[] =
    itineraryId && countryCount <= 1
      ? ["roteiro_unico_1pais", "premium_mensal", "premium_anual"]
      : ["premium_mensal", "premium_anual"];

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div onClick={onClose} aria-hidden="true" className="absolute inset-0 bg-tinta/60" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-y-auto rounded-xl bg-branco p-6 shadow-lg sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-terracota">
              Por Aqui Pelo Mundo Premium
            </p>
            <h2 className="mt-1 font-serif text-2xl text-tinta">
              Seu roteiro ideal pronto em minutos.
            </h2>
            <p className="mt-1 text-sm text-oliva">
              Desbloqueie ainda mais benefícios
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 text-oliva transition-colors hover:text-terracota"
          >
            ✕
          </button>
        </div>

        <ul className="mt-5 flex flex-col gap-2.5">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm text-tinta">
              <span className="mt-0.5 shrink-0 text-terracota">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-oliva/15 pt-6">
          {authLoading ? (
            <p className="text-sm text-oliva">Carregando...</p>
          ) : confirming ? (
            <div className="text-center">
              <p className="font-serif text-lg text-tinta">
                Confirmando seu pagamento...
              </p>
              <p className="mt-1 text-sm text-oliva">Isso leva só alguns segundos.</p>
            </div>
          ) : isPremium ? (
            <p className="text-sm text-tinta">Você já é Premium. Aproveite!</p>
          ) : !user ? (
            <div>
              <p className="text-sm text-oliva">
                Entre na sua conta para desbloquear o Premium.
              </p>
              <Link
                href="/entrar"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-terracota px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
              >
                Entrar
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {itineraryId && countryCount >= 2 && (
                <p className="text-sm text-oliva">
                  Seu roteiro tem atrações em {countryCount} países: o Roteiro
                  Premium avulso só vale para roteiros de até 1 país. Escolha
                  um plano Premium para desbloquear roteiros com múltiplos
                  países.
                </p>
              )}
              {checkoutStatus === "cancelled" && (
                <p className="text-sm text-terracota">
                  Pagamento cancelado. Tente novamente quando quiser.
                </p>
              )}
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
              {error && <p className="text-sm text-terracota">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
