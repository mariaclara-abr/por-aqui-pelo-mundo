"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useUserSubscription } from "@/lib/useUserSubscription";
import type { PlanType } from "@/types/database";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path
        d="M10 3l1.2 3.8L15 8l-3.8 1.2L10 13l-1.2-3.8L5 8l3.8-1.2L10 3z"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 12.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="M10 3v9m0 0l-3.2-3.2M10 12l3.2-3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path
        d="M11 3H5.5A1.5 1.5 0 0 0 4 4.5V10l8.3 8.3a1 1 0 0 0 1.4 0l5.6-5.6a1 1 0 0 0 0-1.4L11 3z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const HERO_BENEFITS: {
  icon: (props: { className?: string }) => ReactElement;
  title: string;
  detail: string;
}[] = [
  {
    icon: SparkleIcon,
    title: "IA organiza tudo por você",
    detail: "define ordem, horário e tempo ideal em cada atração",
  },
  {
    icon: DownloadIcon,
    title: "Baixe e leve com você",
    detail: "acesso total mesmo sem internet",
  },
  {
    icon: TagIcon,
    title: "Economia garantida",
    detail: "evite armadilhas turísticas e gaste só no que vale a pena",
  },
];

const COMPACT_BENEFITS = [
  "Roteiro sob medida: montado com base no seu estilo e ritmo de viagem, não um modelo genérico",
  "A IA sugere atrações além das que você escolheu, alinhadas ao seu perfil",
  "Roteiro completo, dia a dia: sem lacunas, sem inventar na hora",
  "Dicas exclusivas do destino: informação que não está em blog nenhum",
  "Suporte prioritário: resposta rápida quando você precisar",
  "Você pode fazer as alterações que quiser nos roteiros montados por IA",
];

const PLAN_INFO: Record<
  PlanType,
  { title: string; price: string; priceSuffix: string; belowPriceNote?: string; detail: string }
> = {
  roteiro_unico_1pais: {
    title: "Roteiro Premium",
    price: "R$ 19,90",
    priceSuffix: "",
    belowPriceNote: "Pagamento único",
    detail:
      "Válido para este roteiro (máximo 1 país)\ncidades e atrações ilimitadas",
  },
  premium_mensal: {
    title: "Premium Mensal",
    price: "R$ 29,90",
    priceSuffix: "/mês",
    detail: "Acesso ilimitado ao Premium em qualquer roteiro",
  },
  premium_anual: {
    title: "Premium Anual",
    price: "R$ 99,90",
    priceSuffix: "/ano",
    belowPriceNote: "ou R$8,30/mês",
    detail: "Acesso ilimitado ao Premium em qualquer roteiro",
  },
};

const LOCKED_ROTEIRO_UNICO_DETAIL =
  "Válido apenas para roteiros de até 1 país";

// (29,90 × 12 − 99,90) / (29,90 × 12) ≈ 72% de economia no plano anual.
const ANNUAL_SAVINGS_LABEL = "Economize 72% em relação ao mensal";

const PLAN_ORDER: PlanType[] = ["premium_anual", "premium_mensal", "roteiro_unico_1pais"];

const MAX_POLL_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 1500;

// Easing sofisticado/editorial (sem bounce) usado na entrada do pop-up.
const ENTER_EASING = "ease-[cubic-bezier(0.16,1,0.3,1)]";
const EXIT_DURATION_MS = 200;

// Conteúdo interno entra em stagger depois do card: benefícios primeiro
// (um a um), planos por último, um pouco depois do resto.
const STAGGER_BASE_MS = 100;
const STAGGER_STEP_MS = 30;
const STAGGERED_BENEFITS_COUNT = HERO_BENEFITS.length + COMPACT_BENEFITS.length;
const PLANS_DELAY_MS = STAGGER_BASE_MS + STAGGERED_BENEFITS_COUNT * STAGGER_STEP_MS + 80;

function staggerProps(index: number, entered: boolean) {
  return {
    className: `transition-all duration-300 ease-out ${
      entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
    }`,
    style: entered ? { transitionDelay: `${STAGGER_BASE_MS + index * STAGGER_STEP_MS}ms` } : undefined,
  };
}

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
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, refresh } = useUserSubscription();
  const [checkoutStatus] = useState(readCheckoutStatus);
  const [confirming, setConfirming] = useState(checkoutStatus === "success");
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"enter" | "entered" | "exit">("enter");
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Duas frames de espera garantem que o navegador pinte o estado inicial
  // (opacity-0/scale-95) antes de trocar para o estado final: sem isso a
  // transição não dispara, porque o elemento já nasce no estado final.
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPhase("entered"));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const requestClose = useCallback(() => {
    setPhase("exit");
    closeTimeoutRef.current = setTimeout(onClose, EXIT_DURATION_MS);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") requestClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [requestClose]);

  // Fecha o modal na hora (sem animação) e rola até a seção de destinos.
  // Um Link comum não funciona aqui porque, quando o pop-up já está aberto
  // na própria home, o Next não dispara o scroll até a hash numa navegação
  // para a mesma página: rolamos manualmente quando a seção já existe no
  // DOM, e navegamos normalmente quando ela está em outra página.
  const goToDestinos = useCallback(() => {
    document.body.style.overflow = "";
    onClose();
    const target = document.getElementById("destinos");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#destinos");
    }
  }, [onClose, router]);

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

  const entered = phase === "entered";

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div
        onClick={requestClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-tinta/60 transition-opacity duration-200 ease-out ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-branco shadow-lg transition-all ${ENTER_EASING} ${
          entered
            ? "duration-[320ms] translate-y-0 scale-100 opacity-100"
            : phase === "exit"
              ? "duration-[200ms] translate-y-5 scale-95 opacity-0"
              : "translate-y-5 scale-95 opacity-0"
        }`}
      >
        <div className="relative h-36 shrink-0 sm:h-44">
          <img
            src="/hero-por-do-sol.jpeg"
            alt="Pôr do sol visto pela janela do avião, com nuvens douradas acima da asa"
            className="h-full w-full object-cover object-[50%_65%]"
          />
          <button
            type="button"
            onClick={requestClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-tinta/50 text-white transition-colors hover:bg-tinta/70"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          <p className="inline-block rounded-full border border-terracota bg-terracota/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-terracota">
            Por Aqui Pelo Mundo Premium
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-tinta">
            Seu roteiro ideal pronto em minutos.
          </h2>
          <p className="mt-1.5 text-base font-medium text-terracota">
            Desbloqueie ainda mais benefícios
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {HERO_BENEFITS.map(({ icon: Icon, title, detail }, index) => {
              const stagger = staggerProps(index, entered);
              return (
                <div
                  key={title}
                  style={stagger.style}
                  className={`flex flex-col items-center gap-2 rounded-xl bg-areia p-4 text-center ${stagger.className}`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracota/15 text-terracota">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-center text-sm font-medium text-tinta">{title}</p>
                    <p className="mt-0.5 text-center text-xs text-oliva">{detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {COMPACT_BENEFITS.map((benefit, index) => {
              const stagger = staggerProps(HERO_BENEFITS.length + index, entered);
              return (
                <li
                  key={benefit}
                  style={stagger.style}
                  className={`flex items-start gap-2 text-xs text-tinta ${stagger.className}`}
                >
                  <span className="mt-0.5 shrink-0 text-terracota">✓</span>
                  <span>{benefit}</span>
                </li>
              );
            })}
          </ul>

          <div
            className={`mt-6 border-t border-oliva/15 pt-6 transition-all duration-300 ease-out ${
              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
            }`}
            style={entered ? { transitionDelay: `${PLANS_DELAY_MS}ms` } : undefined}
          >
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
              <div className="flex flex-col gap-5 pt-2">
                {checkoutStatus === "cancelled" && (
                  <p className="text-sm text-terracota">
                    Pagamento cancelado. Tente novamente quando quiser.
                  </p>
                )}
                {PLAN_ORDER.map((plan) => {
                  const info = PLAN_INFO[plan];
                  const isAnnual = plan === "premium_anual";
                  const noItinerary =
                    plan === "roteiro_unico_1pais" && !itineraryId;
                  const isLocked =
                    plan === "roteiro_unico_1pais" && countryCount >= 2;
                  const isLoading = loadingPlan === plan;

                  return (
                    <div
                      key={plan}
                      className={
                        isLocked
                          ? "relative rounded-xl border border-oliva/15 bg-areia/40 p-4"
                          : isAnnual
                            ? "relative rounded-xl border-2 border-terracota bg-terracota/5 p-4"
                            : "relative rounded-xl border border-oliva/20 p-4"
                      }
                    >
                      {isAnnual && (
                        <span className="absolute -top-3 left-4 rounded-full bg-terracota px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Melhor custo-benefício
                        </span>
                      )}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 pr-3">
                          <p
                            className={`font-serif text-base ${isLocked ? "text-oliva" : "text-tinta"}`}
                          >
                            {info.title}
                          </p>
                          <p className="mt-1 whitespace-pre-line text-xs text-oliva">
                            {noItinerary
                              ? "Monte seu roteiro escolhendo destinos para desbloquear este plano."
                              : isLocked
                                ? `${LOCKED_ROTEIRO_UNICO_DETAIL}: seu roteiro atual tem atrações em ${countryCount} países.`
                                : info.detail}
                          </p>
                        </div>
                        <div className="shrink-0 text-center">
                          <p
                            className={`text-center text-base font-semibold ${isLocked ? "text-oliva" : isAnnual ? "text-terracota" : "text-tinta"}`}
                          >
                            {info.price}
                            {info.priceSuffix && (
                              <span className="ml-1 text-xs font-normal text-oliva">
                                {info.priceSuffix}
                              </span>
                            )}
                          </p>
                          {info.belowPriceNote && !isLocked && (
                            <p className="text-center text-xs font-medium text-oliva">
                              {info.belowPriceNote}
                            </p>
                          )}
                        </div>
                      </div>
                      {isAnnual && (
                        <p className="mt-1 text-xs font-semibold text-terracota">
                          {ANNUAL_SAVINGS_LABEL}
                        </p>
                      )}
                      {noItinerary ? (
                        <button
                          type="button"
                          onClick={goToDestinos}
                          className="mt-3 flex w-full items-center justify-center rounded-full border-2 border-terracota py-2.5 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10"
                        >
                          Montar meu roteiro
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={isLocked ? undefined : () => handleCheckout(plan)}
                          disabled={isLocked || loadingPlan !== null}
                          className={
                            isLocked
                              ? "mt-3 w-full cursor-not-allowed rounded-full border border-oliva/25 py-2.5 text-sm font-medium text-oliva/60"
                              : isAnnual
                                ? "mt-3 w-full rounded-full bg-terracota py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
                                : "mt-3 w-full rounded-full border-2 border-terracota py-2.5 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10 disabled:opacity-60"
                          }
                        >
                          {isLocked
                            ? "Indisponível para múltiplos países"
                            : isLoading
                              ? "Aguarde..."
                              : "Desbloquear meu roteiro"}
                        </button>
                      )}
                    </div>
                  );
                })}
                {error && <p className="text-sm text-terracota">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
