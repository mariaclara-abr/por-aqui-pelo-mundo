"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { useAuth } from "@/lib/auth";
import { useUserSubscription } from "@/lib/useUserSubscription";
import type { PackId } from "@/lib/stripe";

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

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path
        d="M10 3a5 5 0 0 0-3 9v2h6v-2a5 5 0 0 0-3-9z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M8.3 17h3.4" strokeLinecap="round" />
    </svg>
  );
}

type PremiumHighlight = "dicas" | "ia" | "download";

export const HERO_BENEFITS: {
  id: PremiumHighlight | "economia";
  icon: (props: { className?: string }) => ReactElement;
  title: string;
  detail: string;
}[] = [
  {
    id: "ia",
    icon: SparkleIcon,
    title: "IA organiza tudo por você",
    detail: "define ordem, horário e tempo ideal em cada atração do roteiro",
  },
  {
    id: "dicas",
    icon: LightbulbIcon,
    title: "Todas as dicas do site",
    detail: "acesso completo às dicas imperdíveis, sem cards bloqueados",
  },
  {
    id: "download",
    icon: DownloadIcon,
    title: "Baixe e leve com você",
    detail: "acesso total ao roteiro mesmo sem internet",
  },
  {
    id: "economia",
    icon: TagIcon,
    title: "Economia garantida",
    detail: "evite armadilhas turísticas e gaste só no que vale a pena",
  },
];

export const COMPACT_BENEFITS = [
  "Roteiro sob medida: montado com base no seu estilo e ritmo de viagem, não um modelo genérico",
  "A IA sugere atrações além das que você escolheu, alinhadas ao seu perfil",
  "Roteiro completo, dia a dia: sem lacunas, sem inventar na hora",
  "Dicas exclusivas do destino: informação que não está em blog nenhum",
  "Suporte prioritário: resposta rápida quando você precisar",
  "Você pode fazer as alterações que quiser nos roteiros montados por IA",
];

const PLAN_INFO: Record<
  PackId,
  {
    // Quantos roteiros o pacote libera: vira um aviãozinho no cartão de embarque.
    count: number;
    title: string;
    price: string;
    originalPrice?: string;
    belowPriceNote?: string;
    detail: string;
  }
> = {
  roteiro_1: {
    count: 1,
    title: "1 roteiro premium",
    price: "R$ 89,90",
    detail: "Um roteiro organizado pela nossa IA especializada (cidades e atrações ilimitadas, 1 país)",
  },
  pacote_4: {
    count: 4,
    title: "4 roteiros premium",
    price: "R$ 299,90",
    originalPrice: "R$ 359,60",
    belowPriceNote: "R$ 74,98 por roteiro",
    detail: "Quatro roteiros organizados pela nossa IA especializada, cada um com até 1 país",
  },
  pacote_8: {
    count: 8,
    title: "8 roteiros premium",
    price: "R$ 499,90",
    originalPrice: "R$ 719,20",
    belowPriceNote: "R$ 62,49 por roteiro",
    detail: "Oito roteiros organizados pela nossa IA especializada, cada um com até 1 país",
  },
};

const PLAN_ORDER: PackId[] = ["roteiro_1", "pacote_4", "pacote_8"];

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
  onAccessGranted,
  highlight,
}: {
  itineraryId: string | null;
  countryCount: number;
  onClose: () => void;
  onAccessGranted?: () => void;
  highlight?: PremiumHighlight;
}) {
  const { user, loading: authLoading } = useAuth();
  const { isPremium, hasRoteiroUnicoFor, credits, refresh } = useUserSubscription();

  useEffect(() => {
    if (isPremium || (itineraryId && hasRoteiroUnicoFor(itineraryId))) {
      onAccessGranted?.();
    }
  }, [isPremium, itineraryId, hasRoteiroUnicoFor, onAccessGranted]);
  const [checkoutStatus] = useState(readCheckoutStatus);
  // Acabou de comprar: o crédito ainda não está atrelado a nenhum roteiro.
  useEffect(() => {
    if (checkoutStatus === "success" && credits > 0) onAccessGranted?.();
  }, [checkoutStatus, credits, onAccessGranted]);
  const [confirming, setConfirming] = useState(checkoutStatus === "success");
  const [loadingPlan, setLoadingPlan] = useState<PackId | null>(null);
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

  async function handleCheckout(plan: PackId) {
    if (!user) {
      // Rota de servidor (GET): precisa de navegação completa, não do router.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/comprar?plano=${plan}`);
      return;
    }
    setLoadingPlan(plan);
    setError(null);

    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          plan,
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
            Roteiro sob medida pronto em minutos
          </h2>
          <p className="mt-1.5 text-base font-medium text-terracota">
            Desbloqueie ainda mais benefícios
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {HERO_BENEFITS.map(({ id, icon: Icon, title, detail }, index) => {
              const stagger = staggerProps(index, entered);
              return (
                <div
                  key={title}
                  style={stagger.style}
                  className={`relative flex flex-col items-center gap-2 rounded-xl bg-areia p-4 text-center ${
                    id === highlight ? "ring-2 ring-terracota" : ""
                  } ${stagger.className}`}
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
            ) : (
              <div className="flex flex-col gap-5 pt-2">
                {checkoutStatus === "cancelled" && (
                  <p className="text-sm text-terracota">
                    Pagamento cancelado. Tente novamente quando quiser.
                  </p>
                )}
                {countryCount >= 2 && (
                  <p className="text-sm text-oliva">
                    Seu roteiro atual tem atrações em {countryCount} países. Cada roteiro
                    comprado vale para até 1 país.
                  </p>
                )}
                {PLAN_ORDER.map((plan) => {
                  const info = PLAN_INFO[plan];
                  const isFeatured = plan === "pacote_4";
                  const isLoading = loadingPlan === plan;

                  // Cartão de embarque: corpo + canhoto separados por picote (horizontal
                  // no celular, vertical no desktop). Os recortes são círculos da cor do
                  // modal sobre a borda; um aviãozinho por roteiro do pacote.
                  return (
                    <div
                      key={plan}
                      onClick={loadingPlan !== null ? undefined : () => handleCheckout(plan)}
                      className={`relative flex cursor-pointer flex-col rounded-xl bg-areia transition-transform duration-200 hover:scale-[1.02] sm:flex-row ${
                        isFeatured ? "border-2 border-terracota" : "border border-oliva/20"
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
                        {isFeatured && (
                          // Etiqueta de bilhete: mesmos recortes laterais do cartão, levemente torta.
                          <span className="relative mb-2 -rotate-2 self-start rounded-sm bg-terracota px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                            Favorito
                            <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-areia" />
                            <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-areia" />
                          </span>
                        )}
                        <p className="font-serif text-base text-tinta">{info.title}</p>
                        <p className="mt-1 text-left text-xs text-oliva">{info.detail}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {Array.from({ length: info.count }, (_, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={i} src="/assets/simbolo.svg" alt="" width={16} height={16} />
                          ))}
                        </div>
                      </div>
                      <div className="relative border-t-2 border-dashed border-oliva/30 sm:border-l-2 sm:border-t-0">
                        <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-branco" />
                        <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-branco sm:bottom-0 sm:left-0 sm:right-auto sm:top-auto sm:-translate-x-1/2 sm:translate-y-1/2" />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:w-44 sm:flex-col sm:flex-nowrap sm:justify-center">
                        <div className="shrink-0 text-center">
                          {info.originalPrice && (
                            <p className="text-left text-xs text-oliva/50 line-through sm:text-center">
                              {info.originalPrice}
                            </p>
                          )}
                          <p
                            className={`text-left text-base font-semibold sm:text-center ${isFeatured || plan === "pacote_8" ? "text-terracota" : "text-tinta"}`}
                          >
                            {info.price}
                          </p>
                          {info.belowPriceNote && (
                            <p className="text-left text-xs font-medium text-oliva sm:text-center">
                              {info.belowPriceNote}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={loadingPlan !== null}
                          className={
                            isFeatured
                              ? "grow rounded-full bg-terracota px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-terracota/90 disabled:opacity-60 sm:w-full sm:grow-0"
                              : "grow rounded-full border-2 border-terracota px-5 py-2.5 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10 disabled:opacity-60 sm:w-full sm:grow-0"
                          }
                        >
                          {isLoading ? "Aguarde..." : "Comprar"}
                        </button>
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-oliva">
                  Use seus roteiros em até 6 meses após a compra. Nesse período, todas as dicas Premium do
                  site ficam liberadas.
                </p>
                {error && <p className="text-sm text-terracota">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
