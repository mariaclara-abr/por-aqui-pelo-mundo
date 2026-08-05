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
    // Rastreio de clique é só analytics — nunca deve impedir o usuário de
    // seguir para o link do parceiro.
  });
}

function PoweredByBadge({ program }: { program: AffiliateProgram }) {
  return (
    <p className="mt-2 text-[11px] leading-snug text-oliva/80">
      🔗 Powered by {program.label} — ganhamos uma comissão sem custo extra
      pra você.
    </p>
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
              <PoweredByBadge program={program} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-terracota bg-branco p-5">
      <h3 className="font-serif text-lg text-tinta">Antes de viajar</h3>
      <p className="mt-1 text-sm text-oliva">
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
                  ? "border-oliva/20 bg-areia"
                  : "border-dashed border-oliva/20 bg-areia/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    href ? "border-terracota" : "border-oliva/30"
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
                  <p className="text-sm text-tinta">{program.checklistLabel}</p>
                  {href && (
                    <p className="text-[11px] text-oliva/80">
                      via {program.label}
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
                  Ver opções
                </a>
              ) : (
                <span className="shrink-0 text-xs text-oliva/60">
                  Em breve
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-snug text-oliva/80">
        🔗 Links marcados usam programas de afiliado — ganhamos uma comissão
        sem custo extra pra você.
      </p>
    </div>
  );
}
