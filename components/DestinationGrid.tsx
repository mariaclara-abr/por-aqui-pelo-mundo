import CountryCard from "@/components/CountryCard";
import type { Database } from "@/types/database";

type Country = Database["public"]["Tables"]["countries"]["Row"];

export default function DestinationGrid({
  countries,
}: {
  countries: Country[];
}) {
  return (
    <section id="destinos" className="bg-branco px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
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
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
