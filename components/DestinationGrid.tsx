"use client";

import { useState } from "react";
import CountryCard from "@/components/CountryCard";
import ComingSoonCountryCard from "@/components/ComingSoonCountryCard";
import type { Database } from "@/types/database";

type Country = Database["public"]["Tables"]["countries"]["Row"];

// Duas linhas visíveis antes do "Ver mais destinos". A grade tem 1, 2, 3 e 4
// colunas (base, sm, lg, xl), então o limite (2, 4, 6, 8) muda com a tela e é
// feito por CSS: os cards extras ficam escondidos até o breakpoint que os comporta.
const HIDDEN_UNTIL = ["hidden", "hidden sm:block", "hidden lg:block", "hidden xl:block"];
const LIMITS = [2, 4, 6, 8];

function hiddenClass(index: number) {
  const step = LIMITS.findIndex((limit) => index < limit);
  if (step === -1) return "hidden";
  return step === 0 ? "" : HIDDEN_UNTIL[step];
}

export default function DestinationGrid({
  countries,
  comingSoonCountries = [],
}: {
  countries: Country[];
  comingSoonCountries?: Country[];
}) {
  const [showAll, setShowAll] = useState(false);

  const allCards = [
    ...countries.map((country) => ({ country, comingSoon: false as const })),
    ...comingSoonCountries.map((country) => ({
      country,
      comingSoon: true as const,
    })),
  ];

  // Botão só aparece nas larguras em que ainda há cards escondidos.
  // (classes completas, para o Tailwind enxergá-las)
  const n = allCards.length;
  const buttonClass = [
    n > 2 ? "block" : "hidden",
    n > 4 ? "sm:block" : "sm:hidden",
    n > 6 ? "lg:block" : "lg:hidden",
    n > 8 ? "xl:block" : "xl:hidden",
  ].join(" ");

  return (
    <section
      id="destinos"
      className="scroll-mt-20 bg-areia-escura bg-[url('/author-paper.svg')] bg-[length:256px_256px] bg-blend-soft-light px-4 py-14 sm:px-6 sm:py-24 lg:px-10"
    >
      <div className="mx-auto max-w-[1440px]">
        <h2 className="text-center font-serif text-3xl text-branco sm:text-4xl">
          Explorar destinos
        </h2>
        <p className="mt-2 text-center text-branco">
          Cada lugar foi visitado e avaliado pessoalmente.
        </p>

        {allCards.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-serif text-xl text-branco">
              Novos destinos em breve
            </p>
            <p className="max-w-sm text-center text-branco">
              Estamos preparando a curadoria dos primeiros países. Volte em
              breve.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {allCards.map(({ country, comingSoon }, index) => (
                <div
                  key={country.id}
                  className={showAll ? "" : hiddenClass(index)}
                >
                  {comingSoon ? (
                    <ComingSoonCountryCard country={country} />
                  ) : (
                    <CountryCard country={country} />
                  )}
                </div>
              ))}
            </div>

            {!showAll && (
              <div className={`mt-10 text-center sm:mt-14 ${buttonClass}`}>
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="btn btn-terracota btn-cheio"
                >
                  Ver mais destinos
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
