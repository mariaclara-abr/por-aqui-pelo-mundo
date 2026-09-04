import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getAttractionNamesByCity,
  getAttractionsByCity,
  getCitiesByState,
  getCityBySlug,
  getCityCountByState,
  getStateBySlug,
  getTags,
} from "@/lib/queries";
import { getCityQuestions } from "@/lib/questions";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import type { AttractionCategory } from "@/types/database";
import AttractionFilters from "@/components/AttractionFilters";
import AttractionCard from "@/components/AttractionCard";
import CityCard from "@/components/CityCard";
import RelatedContent from "@/components/RelatedContent";
import ExpandableText from "@/components/ExpandableText";
import CityQuestionsSection from "@/components/city/QuestionsSection";
import { buildOpenGraph, countLabel, joinNames } from "@/lib/metadata";

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

// Este segundo segmento da rota (ex: /brasil/santa-catarina ou
// /brasil/penha) tanto pode ser uma cidade quanto, para países grandes o
// bastante (hoje só o Brasil), um estado que agrupa várias cidades. Cidade
// tem prioridade: se o slug bater com uma cidade, a página é a de sempre
// (grade de atrações); só quando não existe cidade com esse slug é que
// tentamos achar um estado com ele.
export async function generateMetadata(
  props: PageProps<"/[countrySlug]/[citySlug]">,
): Promise<Metadata> {
  const { countrySlug, citySlug } = await props.params;
  const city = await getCityBySlug(citySlug).catch(() => null);

  if (city && city.countries.slug === countrySlug) {
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

  const state = await getStateBySlug(citySlug).catch(() => null);
  if (!state || state.countries.slug !== countrySlug) {
    notFound();
  }

  const title = `${state.name}: cidades e atrações`;
  const cityCount = await getCityCountByState(citySlug).catch(() => null);
  const description =
    cityCount !== null
      ? `Guias de ${countLabel(cityCount, "cidade", "cidades")} em ${state.name}, ${state.countries.name}, com atrações visitadas e avaliadas por quem esteve lá.`
      : `Cidades em ${state.name}, ${state.countries.name}: em breve, guias com curadoria pessoal de quem já esteve lá.`;

  const image = state.cover_image_url ?? state.countries.cover_image_url ?? undefined;

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

export default async function CityOrStatePage(
  props: PageProps<"/[countrySlug]/[citySlug]">,
) {
  const { countrySlug, citySlug } = await props.params;
  const searchParams = await props.searchParams;

  const city = await getCityBySlug(citySlug).catch(() => null);

  if (city && city.countries.slug === countrySlug) {
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

    const [attractions, allTags, questions] = await Promise.all([
      getAttractionsByCity(citySlug, { categories, tags }),
      getTags(),
      getCityQuestions(city.id).catch(() => []),
    ]);

    const coverImage = city.cover_image_url ?? city.countries.cover_image_url ?? undefined;

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
            Atrações em {city.name}
          </h1>

          {city.description && (
            <ExpandableText text={city.description} className="mt-2 text-oliva" />
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

          <section className="relative left-1/2 right-1/2 -mx-[50vw] mt-12 w-screen py-8 sm:py-10">
            {coverImage && (
              <>
                <Image
                  src={coverImage}
                  alt={city.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-tinta/60" />
              </>
            )}
            <div
              className={`relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 ${coverImage ? "" : "border-t border-tinta/10 pt-8"}`}
            >
              <h2
                className={`font-serif text-xl ${coverImage ? "text-white drop-shadow-sm" : "text-tinta"}`}
              >
                Perguntas sobre {city.name}
              </h2>
              <div className="mt-4">
                <CityQuestionsSection cityId={city.id} initialQuestions={questions} />
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const state = await getStateBySlug(citySlug).catch(() => null);
  if (!state || state.countries.slug !== countrySlug) {
    notFound();
  }

  const cities = await getCitiesByState(citySlug);

  // Estados com uma única cidade cadastrada não precisam da etapa
  // intermediária: vai direto para as atrações dessa cidade.
  if (cities.length === 1) {
    redirect(`/${countrySlug}/${cities[0].slug}`);
  }

  const coverImage = state.cover_image_url ?? state.countries.cover_image_url ?? undefined;

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <Link
          href={`/${countrySlug}`}
          className="text-sm text-oliva transition-colors hover:text-terracota"
        >
          {state.countries.name}
        </Link>
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          Cidades em {state.name}
        </h1>

        {state.description ? (
          <ExpandableText text={state.description} className="mt-2 text-oliva" />
        ) : (
          <p className="mt-2 text-oliva">
            Escolha uma cidade para ver as atrações com curadoria.
          </p>
        )}

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
            {cities.map((cityInState) => (
              <CityCard
                key={cityInState.id}
                city={cityInState}
                countrySlug={countrySlug}
              />
            ))}
          </div>
        )}

        <section className="relative left-1/2 right-1/2 -mx-[50vw] mt-12 w-screen py-8 sm:py-10">
          {coverImage && (
            <>
              <Image
                src={coverImage}
                alt={state.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-tinta/60" />
            </>
          )}
          <div
            className={`relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 ${coverImage ? "" : "border-t border-tinta/10 pt-8"}`}
          >
            <h2
              className={`font-serif text-xl ${coverImage ? "text-white drop-shadow-sm" : "text-tinta"}`}
            >
              {state.name}
            </h2>
          </div>
        </section>
      </div>
    </main>
  );
}
