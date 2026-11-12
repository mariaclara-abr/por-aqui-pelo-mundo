import CountryCard from "@/components/CountryCard";
import ComingSoonCountryCard from "@/components/ComingSoonCountryCard";
import type { Database } from "@/types/database";

type Country = Database["public"]["Tables"]["countries"]["Row"];

export default function DestinationGrid({
  countries,
  comingSoonCountries = [],
}: {
  countries: Country[];
  comingSoonCountries?: Country[];
}) {
  const allCards = [
    ...countries.map((country) => ({ country, comingSoon: false as const })),
    ...comingSoonCountries.map((country) => ({
      country,
      comingSoon: true as const,
    })),
  ];

  return (
    <section
      id="paises"
      className="flex-1 bg-fundo-paises bg-[url('/author-paper.svg')] bg-[length:256px_256px] bg-blend-soft-light px-4 py-14 sm:px-6 sm:py-24 lg:px-10"
    >
      <div className="mx-auto max-w-[1440px]">
        <h1 className="text-center font-serif text-3xl text-branco sm:text-4xl">
          Explorar países
        </h1>
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
          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {allCards.map(({ country, comingSoon }) =>
              comingSoon ? (
                <ComingSoonCountryCard key={country.id} country={country} />
              ) : (
                <CountryCard key={country.id} country={country} />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
