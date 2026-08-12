import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAttractionNamesByCity,
  getAttractionsByCity,
  getCityBySlug,
  getTags,
} from "@/lib/queries";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import type { AttractionCategory } from "@/types/database";
import AttractionFilters from "@/components/AttractionFilters";
import AttractionCard from "@/components/AttractionCard";
import RelatedContent from "@/components/RelatedContent";
import { buildOpenGraph, joinNames } from "@/lib/metadata";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// Tenta com 3 nomes de atração na description; se passar de 160 caracteres
// (cidades com nomes de atração longos), reduz até caber.
function buildCityDescription(cityName: string, attractionNames: string[]) {
  for (let n = Math.min(3, attractionNames.length); n >= 1; n--) {
    const candidate = `Atrações de ${cityName} com curadoria pessoal: ${joinNames(attractionNames.slice(0, n))}. Dicas reais de tempo de visita e melhor horário para cada uma.`;
    if (candidate.length <= 160) return candidate;
  }
  return `Atrações de ${cityName}, com curadoria pessoal de quem esteve lá. Dicas reais de tempo de visita e melhor horário para cada uma.`;
}

export async function generateMetadata(
  props: PageProps<"/[countrySlug]/[citySlug]">,
): Promise<Metadata> {
  const { countrySlug, citySlug } = await props.params;
  const city = await getCityBySlug(citySlug).catch(() => null);

  if (!city || city.countries.slug !== countrySlug) {
    notFound();
  }

  const title = `O que fazer em ${city.name}, ${city.countries.name}`;

  const attractions = await getAttractionNamesByCity(citySlug).catch(() => []);
  const description =
    attractions.length > 0
      ? buildCityDescription(
          city.name,
          attractions.map((attraction) => attraction.name),
        )
      : `Guia de ${city.name}, ${city.countries.name}: em breve, atrações com curadoria pessoal de quem já esteve lá. Explore outros destinos e monte seu roteiro agora.`;

  const image = city.cover_image_url ?? city.countries.cover_image_url ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${countrySlug}/${citySlug}` },
    openGraph: buildOpenGraph({
      title,
      description,
      images: image ? [image] : undefined,
    }),
  };
}

export default async function CityPage(
  props: PageProps<"/[countrySlug]/[citySlug]">,
) {
  const { countrySlug, citySlug } = await props.params;
  const searchParams = await props.searchParams;

  const city = await getCityBySlug(citySlug).catch(() => null);

  if (!city || city.countries.slug !== countrySlug) {
    notFound();
  }

  const categoriasParam = firstValue(searchParams.categorias);
  const validCategoryValues = new Set(
    ATTRACTION_CATEGORIES.map((c) => c.value),
  );
  const categories = categoriasParam
    ? (categoriasParam
        .split(",")
        .filter((value): value is AttractionCategory =>
          validCategoryValues.has(value as AttractionCategory),
        ))
    : undefined;

  const tagsParam = firstValue(searchParams.tags);
  const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : undefined;

  const [attractions, allTags] = await Promise.all([
    getAttractionsByCity(citySlug, { categories, tags }),
    getTags(),
  ]);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <Link
          href={`/${countrySlug}`}
          className="text-sm text-oliva transition-colors hover:text-terracota"
        >
          {city.countries.name}
        </Link>
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          {city.name}
        </h1>

        {city.description && (
          <p className="mt-2 text-oliva">{city.description}</p>
        )}

        <Suspense fallback={null}>
          <AttractionFilters tags={allTags} />
        </Suspense>

        {attractions.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-serif text-xl text-tinta">
              Nenhuma atração encontrada
            </p>
            <p className="max-w-sm text-oliva">
              Tente remover algum filtro, ou volte em breve: novas atrações
              chegam sempre.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {attractions.map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                countrySlug={countrySlug}
                citySlug={citySlug}
              />
            ))}
          </div>
        )}

        <section className="mt-12 border-t border-tinta/10 pt-8">
          <h2 className="font-serif text-xl text-tinta">
            Cidades próximas
          </h2>
          <div className="mt-4">
            <RelatedContent mode="city" citySlug={citySlug} />
          </div>
        </section>
      </div>
    </main>
  );
}
