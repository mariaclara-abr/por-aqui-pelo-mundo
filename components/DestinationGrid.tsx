"use client";

import { useState } from "react";
import CountryCard from "@/components/CountryCard";
import ComingSoonCountryCard from "@/components/ComingSoonCountryCard";
import Image from "next/image";
import type { Database } from "@/types/database";

type Country = Database["public"]["Tables"]["countries"]["Row"];

const DESTINATIONS_PER_PAGE = 6;

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

  const visibleCards = showAll
    ? allCards
    : allCards.slice(0, DESTINATIONS_PER_PAGE);

  return (
    <section
      id="destinos"
      className="relative isolate scroll-mt-20 overflow-hidden bg-branco px-4 py-14 sm:px-6 sm:py-24 lg:px-10"
    >
      <Image
        src="/destinos-background.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center opacity-70"
      />
      <div className="absolute inset-0 -z-10 bg-white/45" />

      <div className="relative mx-auto max-w-[1440px]">
        <h2 className="text-center font-serif text-3xl text-tinta sm:text-4xl">
          Explorar destinos
        </h2>
        <p className="mt-2 text-center text-oliva">
          Menos horas pesquisando, mais dias aproveitando.
        </p>

        {allCards.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-serif text-xl text-tinta">
              Novos destinos em breve
            </p>
            <p className="max-w-sm text-oliva">
              Estamos preparando a curadoria dos primeiros países. Volte em
              breve.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:mt-10 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
              {visibleCards.map(({ country, comingSoon }) =>
                comingSoon ? (
                  <ComingSoonCountryCard key={country.id} country={country} />
                ) : (
                  <CountryCard key={country.id} country={country} />
                )
              )}
            </div>

            {!showAll && allCards.length > DESTINATIONS_PER_PAGE && (
              <div className="mt-10 text-center sm:mt-14">
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="rounded-full border border-terracota px-6 py-2.5 text-sm font-semibold text-terracota transition-colors hover:bg-terracota hover:text-branco"
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
