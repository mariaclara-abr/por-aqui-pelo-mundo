import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCitiesByCountry, getCityCountByCountry, getCountryBySlug } from "@/lib/queries";
import CityCard from "@/components/CityCard";
import { buildOpenGraph, countLabel, withDe } from "@/lib/metadata";

export async function generateMetadata(
  props: PageProps<"/[countrySlug]">,
): Promise<Metadata> {
  const { countrySlug } = await props.params;
  const country = await getCountryBySlug(countrySlug).catch(() => null);
  if (!country) {
    notFound();
  }

  // "O que fazer na {País}: cidades e atrações" estoura 60 caracteres com o
  // sufixo do template para países de nome longo (ex: Estados Unidos), então
  // usamos uma forma mais compacta que cabe em qualquer nome de país.
  const title = `${country.name}: o que fazer e onde ir`;

  const cityCount = await getCityCountByCountry(countrySlug).catch(() => null);
  const description =
    cityCount !== null
      ? `Guias de ${countLabel(cityCount, "cidade", "cidades")} ${withDe(country.name)} com atrações visitadas e avaliadas por quem esteve lá. Escolha um destino e monte seu roteiro.`
      : `Guias de cidades ${withDe(country.name)} com atrações visitadas e avaliadas por quem esteve lá. Escolha um destino e monte seu roteiro.`;

  const image = country.cover_image_url ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${countrySlug}` },
    openGraph: buildOpenGraph({
      title,
      description,
      images: image ? [image] : undefined,
    }),
  };
}

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
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
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
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} countrySlug={countrySlug} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
