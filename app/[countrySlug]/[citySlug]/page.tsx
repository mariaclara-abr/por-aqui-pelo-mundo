import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAttractionsByCity,
  getCityBySlug,
  getTags,
} from "@/lib/queries";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import type { AttractionCategory } from "@/types/database";
import AttractionFilters from "@/components/AttractionFilters";
import AttractionCard from "@/components/AttractionCard";
import RelatedContent from "@/components/RelatedContent";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
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
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/${countrySlug}`}
          className="text-sm text-oliva transition-colors hover:text-terracota"
        >
          {city.countries.name}
        </Link>
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          {city.name}
        </h1>

        <Suspense fallback={null}>
          <AttractionFilters tags={allTags} />
        </Suspense>

        {attractions.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-serif text-xl text-tinta">
              Nenhuma atração encontrada
            </p>
            <p className="max-w-sm text-oliva">
              Tente remover algum filtro, ou volte em breve — novas atrações
              chegam sempre.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
            Outras cidades próximas
          </h2>
          <div className="mt-4">
            <RelatedContent mode="city" citySlug={citySlug} />
          </div>
        </section>
      </div>
    </main>
  );
}
