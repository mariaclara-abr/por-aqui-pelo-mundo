import { notFound } from "next/navigation";
import { getCitiesByCountry, getCountryBySlug } from "@/lib/queries";
import CityCard from "@/components/CityCard";

export default async function CountryPage(
  props: PageProps<"/[countrySlug]">,
) {
  const { countrySlug } = await props.params;

  const country = await getCountryBySlug(countrySlug).catch(() => null);
  if (!country) {
    notFound();
  }

  const cities = await getCitiesByCountry(countrySlug);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          {country.name}
        </h1>
        <p className="mt-2 max-w-xl text-oliva">
          Escolha uma cidade para ver as atrações com curadoria.
        </p>

        {cities.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-serif text-xl text-tinta">
              Novas cidades em breve
            </p>
            <p className="max-w-sm text-oliva">
              Estamos preparando a curadoria das primeiras cidades por aqui.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} countrySlug={countrySlug} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
