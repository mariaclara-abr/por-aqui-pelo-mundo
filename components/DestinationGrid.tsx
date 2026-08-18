import CountryCard from "@/components/CountryCard";
import type { Database } from "@/types/database";

type Country = Database["public"]["Tables"]["countries"]["Row"];

export default function DestinationGrid({
  countries,
}: {
  countries: Country[];
}) {
  return (
    <section id="destinos" className="scroll-mt-20 bg-branco px-4 py-14 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="text-center font-serif text-3xl text-tinta sm:text-4xl">
          Escolha um destino
        </h2>
        <p className="mt-2 text-center text-oliva">
          Menos horas pesquisando, mais dias aproveitando.
        </p>

        {countries.length === 0 ? (
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
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 sm:mt-10 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
            {countries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
