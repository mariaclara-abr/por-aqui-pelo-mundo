"use client";

import {
  AFFILIATE_PROGRAMS,
  type AffiliateLocation,
  type AffiliateProgram,
} from "@/lib/affiliates";

function trackClick(program: AffiliateProgram, attractionId?: string, context?: string) {
  fetch("/api/affiliate-click", {
    method: "POST",
    headers: { "content-type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      affiliate_program: program.id,
      attraction_id: attractionId ?? null,
      context: context ?? null,
    }),
  }).catch(() => {
    // Rastreio de clique é só analytics, nunca deve impedir o usuário de
    // seguir para o link do parceiro.
  });
}

function PoweredByBadge({ program }: { program: AffiliateProgram }) {
  return (
    <p className="mt-2 text-[11px] leading-snug text-oliva/80">
      🔗 Powered by {program.label}, sem custo extra pra você.
    </p>
  );
}

const EASYSIM_STEPS = [
  "Escolha o destino e o plano ideal para a sua viagem.",
  "Faça a compra pelo link do Por Aqui Pelo Mundo e aplique o cupom Poraquipelomundo.",
  "Siga as orientações enviadas pela EasySim.",
  "Use a internet durante a viagem e fique conectado no seu destino.",
];

// Destaque do parceiro EasySim na página de dicas de viagem.
export function EasySimBanner() {
  const program = AFFILIATE_PROGRAMS.find((p) => p.id === "easysim");
  if (!program?.isConfigured || !program.buildUrl) return null;
  // O link do EasySim é fixo, a cidade não é usada.
  const href = program.buildUrl({ cityName: "" });

  return (
    <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
      <div className="mx-auto grid max-w-[1240px] gap-10 rounded-xl bg-oliva p-6 text-areia sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-areia/70">
            Parceiro Por Aqui Pelo Mundo
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-branco sm:text-5xl">
            Internet no <span className="text-terracota">exterior</span>,
            sem complicação
          </h2>
          <p className="mt-5 text-base leading-relaxed text-areia/90 sm:text-lg">
            Ter internet durante uma viagem facilita muito a rotina: ajuda com
            mapas, reservas, transporte, mensagens, traduções e pesquisas
            durante os passeios.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-areia/80 sm:text-base">
            A EasySim oferece internet para viagens internacionais de forma
            prática, segura e sem complicação, com opções que podem atender
            diferentes perfis de viajantes.
          </p>

          <div className="mt-8 rounded-xl bg-areia p-5 text-tinta sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-oliva">
              Benefício exclusivo
            </p>
            <p className="mt-2 font-serif text-2xl leading-snug sm:text-3xl">
              {program.benefit}
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => trackClick(program, undefined, "dicas_de_viagem")}
              className="mt-5 inline-block rounded-full bg-terracota px-8 py-3 text-base font-medium text-white transition-colors hover:bg-terracota/90"
            >
              {program.checklistCtaLabel ?? "Ver opções"}
            </a>
            <PoweredByBadge program={program} />
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="font-serif text-2xl text-branco">Como funciona</h3>
          <ol className="mt-5 flex flex-col gap-4">
            {EASYSIM_STEPS.map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-4 rounded-xl bg-branco/10 p-4"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracota font-serif text-lg text-white"
                >
                  {i + 1}
                </span>
                <span className="pt-1 text-sm leading-relaxed text-areia sm:text-base">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <div
            role="img"
            aria-label="40% de desconto com o cupom Poraquipelomundo"
            className="mt-8 flex h-40 w-40 shrink-0 -rotate-6 items-center justify-center self-center rounded-full bg-terracota p-2 sm:h-48 sm:w-48 lg:mt-auto lg:self-end"
          >
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-dashed border-areia/70 text-center text-white">
              <span className="font-serif text-5xl leading-none sm:text-6xl">40%</span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-[0.2em]">
                de desconto
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AffiliateCallout({
  variant,
  location,
  attractionId,
}: {
  variant: "attraction" | "checklist";
  location: AffiliateLocation;
  attractionId?: string;
}) {
  if (variant === "attraction") {
    const programs = AFFILIATE_PROGRAMS.filter(
      (program) => program.isConfigured && program.buildUrl,
    );
    if (programs.length === 0) return null;

    return (
      <div className="mt-6 rounded-xl border border-oliva/15 bg-branco p-5">
        <h3 className="font-serif text-lg text-tinta">Continue planejando</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {programs.map((program) => (
            <div key={program.id} className="rounded-lg bg-areia p-4">
              <a
                href={program.buildUrl!(location)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() =>
                  trackClick(program, attractionId, "attraction_page")
                }
                className="inline-block rounded-full bg-terracota px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
              >
                {program.attractionCtaLabel ?? program.label}
              </a>
              {program.benefit && (
                <p className="mt-3 text-sm font-semibold text-tinta">
                  {program.benefit}
                </p>
              )}
              <PoweredByBadge program={program} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-oliva">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-10">
      <h3 className="font-serif text-lg text-branco">Antes de viajar</h3>
      <p className="mt-1 text-sm text-areia/80">
        Um checklist rápido pra fechar os últimos detalhes da viagem.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {AFFILIATE_PROGRAMS.map((program) => {
          const href = program.isConfigured && program.buildUrl
            ? program.buildUrl(location)
            : null;

          return (
            <div
              key={program.id}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                href
                  ? "border-branco/20 bg-branco/10"
                  : "border-dashed border-branco/20 bg-branco/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    href ? "border-terracota" : "border-branco/30"
                  }`}
                >
                  {href && (
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5 fill-none stroke-terracota"
                      strokeWidth={2.5}
                    >
                      <path
                        d="M4 10l4 4 8-9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <div>
                  <p className="text-sm text-branco">{program.checklistLabel}</p>
                  {href && (
                    <p className="text-[11px] text-areia/80">
                      via {program.label}
                    </p>
                  )}
                  {href && program.benefit && (
                    <p className="mt-1 text-sm font-semibold text-branco">
                      {program.benefit}
                    </p>
                  )}
                </div>
              </div>

              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() =>
                    trackClick(program, attractionId, "meu_roteiro_checklist")
                  }
                  className="shrink-0 rounded-full bg-terracota px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-terracota/90"
                >
                  {program.checklistCtaLabel ?? "Ver opções"}
                </a>
              ) : (
                <span className="shrink-0 text-xs text-areia/60">
                  Em breve
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-snug text-areia/80">
        🔗 Links marcados usam programas de afiliado, sem custo extra pra
        você.
      </p>
      </div>
    </div>
  );
}
