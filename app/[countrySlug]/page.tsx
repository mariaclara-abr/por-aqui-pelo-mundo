import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import {
  getCitiesByCountry,
  getCityCountByCountry,
  getCountryBySlug,
  getStatesByCountry,
} from "@/lib/queries";
import { getCountryQuestions } from "@/lib/questions";
import { checkIsAuthor } from "@/lib/server-auth";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";
import CityCard from "@/components/CityCard";
import ComingSoonCityCard from "@/components/ComingSoonCityCard";
import StateCard from "@/components/StateCard";
import CountryQuestionsSection from "@/components/country/QuestionsSection";
import ExpandableText from "@/components/ExpandableText";
import { buildOpenGraph, countLabel, withDe } from "@/lib/metadata";

export async function generateMetadata(
  props: PageProps<"/[countrySlug]">,
): Promise<Metadata> {
  const { countrySlug } = await props.params;
  const country = await getCountryBySlug(countrySlug).catch(() => null);
  if (!country) {
    notFound();
  }
  if (country.status === "draft" && !(await checkIsAuthor())) {
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
    ...(country.status === "draft"
      ? { robots: { index: false, follow: false } }
      : {}),
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
  if (country.status === "draft" && !(await checkIsAuthor())) {
    notFound();
  }

  // Países grandes o bastante (hoje só o Brasil) agrupam suas cidades em
  // estados: nesse caso a página do país lista estados, não cidades direto,
  // e cada estado tem sua própria página (mesma rota de cidade, ver
  // app/[countrySlug]/[citySlug]/page.tsx) com a grade de cidades dele.
  const states = await getStatesByCountry(countrySlug);
  const hasStates = states.length > 0;

  const cities = hasStates ? [] : await getCitiesByCountry(countrySlug);
  const publishedCities = cities.filter((city) => city.status === "published");
  const comingSoonCities = cities.filter((city) => city.status === "draft");

  // Países com uma única cidade já publicada (ex: Mônaco) não precisam da
  // etapa intermediária de escolher a cidade: vai direto para as atrações.
  // Se a única cidade ainda está "em breve", fica na grade como teaser em
  // vez de levar o visitante direto pra uma página bloqueada.
  if (!hasStates && cities.length === 1 && cities[0].status === "published") {
    redirect(`/${countrySlug}/${cities[0].slug}`);
  }

  const questions = await getCountryQuestions(country.id).catch(() => []);
  const coverImage = country.cover_image_url ?? undefined;

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        {country.status === "draft" && (
          <p className="mb-4 inline-block rounded-full bg-terracota/10 px-3 py-1 text-sm font-medium text-terracota">
            Prévia: este país ainda está marcado como em breve, só você
            consegue ver esta página.
          </p>
        )}
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          {country.name}
        </h1>
        {country.description ? (
          <ExpandableText
            text={country.description}
            className="mt-2 text-oliva"
          />
        ) : (
          <p className="mt-2 text-oliva">
            {hasStates
              ? "Escolha um estado para ver as cidades com curadoria."
              : "Escolha uma cidade para ver as atrações com curadoria."}
          </p>
        )}

        {hasStates ? (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {states.map((state) => (
              <StateCard key={state.id} state={state} countrySlug={countrySlug} />
            ))}
          </div>
        ) : cities.length === 0 ? (
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
            {publishedCities.map((city) => (
              <CityCard key={city.id} city={city} countrySlug={countrySlug} />
            ))}
            {comingSoonCities.map((city) => (
              <ComingSoonCityCard
                key={city.id}
                city={city}
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
                alt={country.name}
                fill
                sizes="100vw"
                className="object-cover"
                style={imagePositionStyle(parseImagePosition(country.cover_image_position))}
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
              Perguntas sobre {country.name}
            </h2>
            <div className="mt-4">
              <CountryQuestionsSection
                countryId={country.id}
                initialQuestions={questions}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
