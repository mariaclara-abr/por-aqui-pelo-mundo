"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ACHADINHOS,
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

function AffiliateTag({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        light ? "border-areia/40 text-areia/80" : "border-oliva/40 text-oliva"
      }`}
    >
      link de afiliada
    </span>
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
            <p className="text-left mt-2 text-left font-serif text-2xl leading-snug sm:text-3xl">
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
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <AffiliateTag />
              <p className="flex items-center gap-1.5 text-xs text-oliva">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-3.5 w-3.5 fill-none stroke-current"
                  strokeWidth={2}
                >
                  <rect x="4" y="9" width="12" height="8" rx="2" />
                  <path d="M7 9V6a3 3 0 016 0v3" strokeLinecap="round" />
                </svg>
                Compra segura
              </p>
            </div>
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

// Itens para sua viagem (Mercado Livre) na página de dicas de viagem.
export function AchadinhosCard() {
  const program = AFFILIATE_PROGRAMS.find((p) => p.id === "mercadolivre");
  if (!program?.isConfigured) return null;

  return (
    <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
      <div className="mx-auto max-w-[1240px] rounded-xl bg-areia p-6 text-tinta sm:p-10">
        <p className="text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota">
          Parceiro Por Aqui Pelo Mundo
        </p>
        <h2 className="mt-3 text-left font-serif text-2xl leading-tight sm:text-4xl">
          Itens para sua <span className="text-terracota">viagem</span>
        </h2>
        <p className="mt-4 max-w-2xl text-left text-sm leading-relaxed text-oliva sm:text-base">
          Ao longo das minhas viagens, alguns itens acabam fazendo bastante
          diferença no dia a dia. São produtos que ajudam a deixar a viagem
          mais prática, organizada e confortável, seja na hora de montar a
          mala, durante os passeios ou no próprio deslocamento.
        </p>
        <ul className="mt-6 flex flex-col gap-4">
          {ACHADINHOS.map((item) => (
            <li
              key={item.href}
              className="flex flex-col gap-4 rounded-lg bg-branco p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-left font-serif text-lg text-tinta">
                  <span aria-hidden="true">🧳 </span>
                  {item.name}
                </h3>
                <p className="mt-1 text-left text-sm leading-relaxed text-oliva">
                  {item.description}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => trackClick(program, undefined, "dicas_de_viagem")}
                  className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
                >
                  {program.checklistCtaLabel}
                </a>
                <AffiliateTag />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Destaque do parceiro Rentcars na página de dicas de viagem.
export function RentcarsBanner() {
  const program = AFFILIATE_PROGRAMS.find((p) => p.id === "rentcars");
  if (!program?.isConfigured || !program.buildUrl) return null;
  const href = program.buildUrl({ cityName: "" });

  return (
    <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
      <div className="mx-auto grid max-w-[1240px] gap-8 rounded-xl bg-oliva p-6 text-areia sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:p-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-areia/70">
            Parceiro Por Aqui Pelo Mundo
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-branco sm:text-5xl">
            <span className="text-terracota">Alugue um carro</span> e viaje mais
            tranquilo
          </h2>
          <p className="mt-5 text-base leading-relaxed text-areia/90 sm:text-lg">
            Ter um carro à disposição dá liberdade para montar o roteiro no seu
            ritmo, chegar a lugares de difícil acesso e se programar melhor
            para estradas, estacionamentos e deslocamentos.
          </p>
        </div>
        <div className="rounded-xl bg-areia p-5 text-tinta sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-oliva">
            Aluguel de carro
          </p>
          <p className="mt-2 text-left font-serif text-2xl leading-snug sm:text-3xl">
            Reserve pela Rentcars
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
          <div className="mt-3">
            <AffiliateTag />
          </div>
          <PoweredByBadge program={program} />
        </div>
      </div>
    </section>
  );
}

// Destaque da Natura na página de dicas de viagem: linha completa de
// cuidados, não só protetor solar.
export function NaturaCard() {
  const program = AFFILIATE_PROGRAMS.find((p) => p.id === "natura");
  if (!program?.isConfigured || !program.buildUrl) return null;
  const href = program.buildUrl({ cityName: "" });
  const categorias = [
    "Proteção solar",
    "Cuidados com a pele",
    "Cabelo",
    "Perfumaria",
    "Corpo e banho",
  ];

  return (
    <section className="px-4 pb-14 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
      <div className="mx-auto grid max-w-[1240px] gap-8 rounded-xl bg-areia p-6 text-tinta sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16 lg:p-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota">
            Parceiro Por Aqui Pelo Mundo
          </p>
          <h2 className="mt-4 text-left font-serif text-3xl leading-tight sm:text-5xl">
            Cuide de você <span className="text-terracota">em cada destino</span>
          </h2>
          <p className="mt-5 max-w-xl text-left text-base leading-relaxed text-oliva sm:text-lg">
            Clima, sol e dias longos de passeio pedem atenção com a pele, o
            cabelo e o bem-estar. Na loja da minha consultoria Natura você
            encontra de proteção solar a perfumaria para montar a nécessaire da
            viagem.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <li
                key={c}
                className="rounded-full border border-oliva/30 px-4 py-1.5 text-sm text-oliva"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-branco p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-oliva">
            Cupom de desconto
          </p>
          <p className="mt-2 text-left font-serif text-5xl leading-none text-terracota sm:text-6xl">
            10%
          </p>
          <p className="mt-2 text-left text-sm text-oliva">de desconto com o cupom</p>
          <p className="mt-3 rounded-lg border border-dashed border-terracota px-4 py-3 text-center font-serif text-xl tracking-[0.18em] text-tinta">
            VIAJARDEZ
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackClick(program, undefined, "dicas_de_viagem")}
            className="mt-5 inline-block rounded-full bg-terracota px-8 py-3 text-base font-medium text-white transition-colors hover:bg-terracota/90"
          >
            {program.checklistCtaLabel}
          </a>
          <div className="mt-3">
            <AffiliateTag />
          </div>
          <PoweredByBadge program={program} />
        </div>
      </div>
    </section>
  );
}

// Destaque editorial da Rentcars na página inicial.
export function RentcarsSlimBanner() {
  const program = AFFILIATE_PROGRAMS.find((p) => p.id === "rentcars");
  if (!program?.isConfigured || !program.buildUrl) return null;
  const href = program.buildUrl({ cityName: "" });

  return (
    <section aria-labelledby="rentcars-home-title" className="overflow-hidden bg-branco px-4 py-14 text-tinta sm:px-6 sm:py-20 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="min-w-0 max-w-xl lg:order-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-2xl font-semibold tracking-tight text-oliva">
              {program.label}
            </span>
            <span aria-hidden="true" className="hidden h-5 w-px bg-oliva/25 sm:block" />
            <p className="text-left text-xs font-medium text-oliva">
              Parceira Por Aqui Pelo Mundo
            </p>
          </div>
          <h2 id="rentcars-home-title" className="mt-5 text-balance font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Aluguel de carro para a <span className="text-terracota">sua viagem</span>
          </h2>
          <p className="mt-5 max-w-lg text-left text-base leading-7 text-oliva">
            Pesquise as opções de aluguel para o seu destino e faça a reserva
            diretamente na Rentcars, nossa parceira para viajar de carro.
          </p>
          <p className="mt-6 text-sm font-semibold text-terracota">
            A maior plataforma de aluguel de carros online da América Latina
          </p>
          <dl className="mt-4 grid max-w-lg grid-cols-3 gap-4 border-y border-oliva/20 py-4">
            {[
              ["160+", "países"],
              ["300+", "locadoras comparadas"],
              ["Desde 2009", "no mercado"],
            ].map(([valor, rotulo]) => (
              <div key={rotulo}>
                <dt className="font-serif text-xl leading-none text-tinta sm:text-2xl">{valor}</dt>
                <dd className="mt-1.5 text-xs leading-snug text-oliva">{rotulo}</dd>
              </div>
            ))}
          </dl>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackClick(program, undefined, "home")}
            className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-oliva px-6 py-3.5 text-center text-sm font-semibold text-branco transition-colors duration-200 hover:bg-tinta active:bg-tinta motion-reduce:transition-none sm:w-auto"
          >
            Ver carros na {program.label}
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1">
              <path d="M5 15 15 5M5 5h10v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="mt-4 max-w-lg text-left text-xs leading-relaxed text-oliva">
            Link de afiliada. Sem custo extra para você.
          </p>
        </div>
        <div className="mx-auto w-full max-w-xl lg:order-1 lg:max-w-none">
          <Image
            src="/rentcars-viagem.webp"
            alt=""
            width={960}
            height={640}
            sizes="(min-width: 1520px) 688px, (min-width: 1024px) 46vw, (min-width: 640px) 576px, calc(100vw - 32px)"
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}

// Versão fina do destaque EasySim para a página inicial.
export function EasySimSlimBanner() {
  const program = AFFILIATE_PROGRAMS.find((p) => p.id === "easysim");
  if (!program?.isConfigured || !program.buildUrl) return null;
  const href = program.buildUrl({ cityName: "" });

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-4 rounded-xl bg-oliva p-5 text-areia sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8">
        <div className="flex items-center gap-4">
          <div
            role="img"
            aria-label="40% de desconto com o cupom Poraquipelomundo"
            className="flex h-16 w-16 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full bg-terracota text-white"
          >
            <span className="font-serif text-2xl leading-none">40%</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider">
              off
            </span>
          </div>
          <div>
            <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-areia/70">
              EasySim: parceiro Por Aqui Pelo Mundo
              <AffiliateTag light />
            </p>
            <h2 className="mt-1 font-serif text-xl leading-tight text-branco sm:text-2xl">
              Internet no <span className="text-terracota">exterior</span>, com
              eSIM ou chip físico
            </h2>
            <p className="text-left mt-1 text-sm text-areia/80">
              {program.benefit}
            </p>
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackClick(program, undefined, "home")}
          className="shrink-0 self-center rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
        >
          {program.checklistCtaLabel ?? "Ver opções"}
        </a>
      </div>
    </section>
  );
}

// Protetor solar (Natura) na página de atração, só para passeios ao ar livre.
export function SunscreenCallout({
  attractionId,
  context = "attraction_page",
  className = "mt-8",
}: {
  attractionId?: string;
  context?: string;
  className?: string;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const program = AFFILIATE_PROGRAMS.find((p) => p.id === "natura");
  if (!program?.isConfigured || !program.buildUrl) return null;

  async function handleCopyCoupon() {
    setCopyStatus("copying");
    try {
      await navigator.clipboard.writeText("VIAJARDEZ");
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className={`${className} overflow-hidden rounded-xl border border-oliva/20 bg-branco lg:grid lg:grid-cols-[minmax(0,1fr)_20rem]`}>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-x-3 gap-y-3 bg-areia/55 p-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-6 sm:p-6 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-y-2 lg:p-8">
        <Image
          src="/natura-protecao-solar.webp"
          alt=""
          width={640}
          height={640}
          sizes="(min-width: 1024px) 160px, (min-width: 640px) 128px, 88px"
          className="col-start-2 row-start-2 h-auto w-full sm:col-start-1 sm:row-start-1 sm:row-span-2"
        />
        <div className="col-span-2 col-start-1 row-start-1 min-w-0 sm:col-span-1 sm:col-start-2 sm:self-end">
          <p className="text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-oliva sm:text-[11px]">
            Natura · cuidado para a viagem
          </p>
          <h2 className="mt-2 whitespace-nowrap text-left font-serif text-base leading-tight tracking-tight text-tinta sm:text-2xl">
            Não esqueça o protetor solar
          </h2>
        </div>
        <p className="col-start-1 row-start-2 max-w-sm text-pretty text-left text-sm leading-relaxed text-oliva sm:col-start-2 sm:self-start">
          Praia, trilha ou passeio ao ar livre: leve seu protetor solar e
          aproveite cada destino com mais cuidado.
        </p>
      </div>
      <div className="min-w-0 border-t border-dashed border-oliva/25 p-5 sm:p-6 lg:border-t-0 lg:border-l">
        <p className="mb-3 text-left text-xs font-semibold text-oliva">
          Exclusivo Por Aqui Pelo Mundo
        </p>
        <div className="flex items-center gap-3">
          <p className="sr-only">{program.benefit}</p>
          <p aria-hidden="true" className="text-left font-serif text-5xl leading-none tracking-tight text-terracota">
            10<span className="text-3xl">%</span>
          </p>
          <p aria-hidden="true" className="text-left text-sm leading-snug text-oliva">
            de desconto
          </p>
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-oliva/30 bg-areia/35 px-3 py-2.5">
          <p className="text-left text-xs text-oliva">Use o cupom</p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="select-all text-sm font-semibold tracking-[0.14em] text-tinta">
              VIAJARDEZ
            </span>
            <button
              type="button"
              onClick={handleCopyCoupon}
              disabled={copyStatus === "copying"}
              aria-label="Copiar cupom VIAJARDEZ"
              className="flex min-h-11 min-w-20 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-semibold text-oliva transition-colors hover:bg-oliva/10 active:bg-oliva/15 disabled:opacity-60 motion-reduce:transition-none"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
                {copyStatus === "copied" ? (
                  <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <>
                    <rect x="7" y="7" width="10" height="10" rx="2" />
                    <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" strokeLinecap="round" />
                  </>
                )}
              </svg>
              {copyStatus === "copied" ? "Copiado" : copyStatus === "copying" ? "Copiando" : "Copiar"}
            </button>
          </div>
          <p role="status" className={copyStatus === "error" ? "mt-1 text-left text-xs leading-relaxed text-tinta" : "sr-only"}>
            {copyStatus === "copied"
              ? "Cupom VIAJARDEZ copiado."
              : copyStatus === "error"
                ? "Não foi possível copiar. Selecione o código para copiá-lo manualmente."
                : ""}
          </p>
        </div>
        <a
          href={program.buildUrl({ cityName: "" })}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackClick(program, attractionId, context)}
          className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-oliva px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-tinta active:bg-tinta motion-reduce:transition-none"
        >
          {program.checklistCtaLabel}
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
            <path d="M4 10h12m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <p className="mt-3 text-left text-[11px] leading-relaxed text-oliva">
          Link de afiliada, sem custo extra para você.
        </p>
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
                <p className="text-left mt-3 text-sm font-semibold text-tinta">
                  {program.benefit}
                </p>
              )}
              <p className="mt-3">
                <AffiliateTag />
              </p>
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
        {[...AFFILIATE_PROGRAMS]
          .sort((a, b) => Number(!!(b.isConfigured && b.buildUrl)) - Number(!!(a.isConfigured && a.buildUrl)))
          .map((program) => {
          const href = program.isConfigured && program.buildUrl
            ? program.buildUrl(location)
            : null;

          return (
            <div
              key={program.id}
              className={`relative flex items-center justify-between gap-3 rounded-lg border p-3 ${
                href
                  ? "border-branco/20 bg-branco/10 transition-colors hover:bg-branco/15"
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
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-areia/80">
                      via {program.label}
                      <AffiliateTag light />
                    </p>
                  )}
                  {href && program.benefit && (
                    <p className="text-left mt-1 text-sm font-semibold text-branco">
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
                  className="w-44 shrink-0 whitespace-nowrap rounded-full bg-terracota px-4 py-1.5 text-center text-xs font-medium text-white transition-colors after:absolute after:inset-0 after:content-[''] hover:bg-terracota/90"
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
