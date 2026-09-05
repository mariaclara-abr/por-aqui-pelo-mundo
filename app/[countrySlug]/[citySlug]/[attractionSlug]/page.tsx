import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAttractionAncestors,
  getAttractionBySlug,
  getAttractionIdsWithChildren,
  getChildAttractions,
} from "@/lib/queries";
import { getAttractionQuestions } from "@/lib/questions";
import { categoryLabels } from "@/types/database";
import type { Database } from "@/types/database";
import CurationRating from "@/components/CurationRating";
import PriceRange from "@/components/PriceRange";
import RoteiroButton from "@/components/RoteiroButton";
import RelatedContent from "@/components/RelatedContent";
import AttractionCard from "@/components/AttractionCard";
import DestinationCard from "@/components/DestinationCard";
import QuestionsSection from "@/components/attraction/QuestionsSection";
import AttractionPhotos from "@/components/attraction/AttractionPhotos";
import AffiliateCallout from "@/components/AffiliateCallout";
import { linkify } from "@/components/Linkify";
import { buildOpenGraph, truncateToSentence } from "@/lib/metadata";
import { parseImagePosition } from "@/lib/image-position";

type AttractionWithRelations = Database["public"]["Tables"]["attractions"]["Row"] & {
  cities: Database["public"]["Tables"]["cities"]["Row"] & {
    countries: Database["public"]["Tables"]["countries"]["Row"];
  };
};

// Monta a description a partir da descrição curta real da atração (nunca
// inventada) mais tempo de visita / melhor horário quando existirem,
// sempre cabendo em 160 caracteres sem cortar frase no meio.
function buildAttractionDescription(attraction: AttractionWithRelations) {
  const facts: string[] = [];
  if (attraction.average_visit_time) {
    facts.push(`Visita de ${attraction.average_visit_time}`);
  }
  if (attraction.best_time_of_day) {
    facts.push(`melhor horário: ${attraction.best_time_of_day}`);
  }
  const factsClause = facts.length > 0 ? ` ${facts.join(", ")}.` : "";
  const suffix = `${factsClause} Dicas de quem já foi.`;

  const base = attraction.description?.trim();
  if (base) {
    const available = 160 - suffix.length;
    const fittedBase = base.length <= available ? base : truncateToSentence(base, available);
    return `${fittedBase}${suffix}`.trim();
  }

  const fallback = `${attraction.name}, em ${attraction.cities.name} (${attraction.cities.countries.name}): recomendação com curadoria pessoal de quem já esteve lá. Confira dicas reais para a sua visita.`;
  return truncateToSentence(fallback, 160);
}

export async function generateMetadata(
  props: PageProps<"/[countrySlug]/[citySlug]/[attractionSlug]">,
): Promise<Metadata> {
  const { countrySlug, citySlug, attractionSlug } = await props.params;
  const attraction = await getAttractionBySlug(attractionSlug).catch(() => null);

  if (
    !attraction ||
    attraction.cities.slug !== citySlug ||
    attraction.cities.countries.slug !== countrySlug
  ) {
    notFound();
  }

  const title = `${attraction.name}, ${attraction.cities.name}: vale a pena?`;
  const description = buildAttractionDescription(attraction);

  const photos = [...attraction.attraction_photos].sort((a, b) => a.order - b.order);
  const image =
    photos[0]?.url ??
    attraction.cities.cover_image_url ??
    attraction.cities.countries.cover_image_url ??
    undefined;

  return {
    title,
    description,
    alternates: { canonical: `/${countrySlug}/${citySlug}/${attractionSlug}` },
    openGraph: buildOpenGraph({
      title,
      description,
      images: image ? [image] : undefined,
      type: "article",
    }),
  };
}

export default async function AttractionPage(
  props: PageProps<"/[countrySlug]/[citySlug]/[attractionSlug]">,
) {
  const { countrySlug, citySlug, attractionSlug } = await props.params;

  const attraction = await getAttractionBySlug(attractionSlug).catch(
    () => null,
  );

  if (
    !attraction ||
    attraction.cities.slug !== citySlug ||
    attraction.cities.countries.slug !== countrySlug
  ) {
    notFound();
  }

  const photos = [...attraction.attraction_photos].sort(
    (a, b) => a.order - b.order,
  );
  const tags = attraction.attraction_tags.map((entry) => entry.tags);
  const categoryLabel = categoryLabels(attraction.categories);

  const questions = await getAttractionQuestions(attraction.id).catch(() => []);
  const childAttractions = await getChildAttractions(attraction.id).catch(
    () => [],
  );
  const ancestors = await getAttractionAncestors(
    attraction.parent_attraction_id,
  ).catch(() => []);

  // Uma atração com sub-atrações vira uma "pasta" e deixa de ter a
  // formatação de uma atração única (sem foto de capa, nota, etiquetas ou
  // botão de roteiro). Se os próprios filhos também tiverem sub-atrações,
  // ela funciona como um país (lista destinos, ex: Parques > Magic
  // Kingdom, que por sua vez tem seus restaurantes); senão, funciona como
  // uma cidade (lista atrações, ex: Magic Kingdom > Satu'li Canteen).
  const isContainer = childAttractions.length > 0;
  const childrenWithChildren = isContainer
    ? await getAttractionIdsWithChildren(
        childAttractions.map((child) => child.id),
      ).catch(() => new Set<string>())
    : new Set<string>();
  const childrenAreDestinations = childAttractions.some((child) =>
    childrenWithChildren.has(child.id),
  );

  const quickFacts = [
    attraction.average_visit_time
      ? { label: "Tempo médio de visita", content: attraction.average_visit_time as React.ReactNode }
      : null,
    attraction.best_time_of_day
      ? { label: "Melhor horário", content: attraction.best_time_of_day as React.ReactNode }
      : null,
    attraction.best_season
      ? { label: "Melhor época", content: attraction.best_season as React.ReactNode }
      : null,
    attraction.recommended_audience
      ? { label: "Público recomendado", content: attraction.recommended_audience as React.ReactNode }
      : null,
    attraction.price_range != null
      ? { label: "Faixa de preço", content: <PriceRange value={attraction.price_range} /> }
      : null,
    attraction.weather_sensitive
      ? { label: "Sensível à chuva", content: "Sim" as React.ReactNode }
      : null,
    attraction.intense_physical_effort
      ? { label: "Esforço físico", content: "Intenso" as React.ReactNode }
      : null,
    attraction.requires_advance_purchase
      ? { label: "Compra antecipada", content: "Necessária" as React.ReactNode }
      : null,
    attraction.requires_reservation
      ? { label: "Reserva", content: "Necessária" as React.ReactNode }
      : null,
    attraction.has_air_conditioning
      ? { label: "Ar condicionado", content: "Sim" as React.ReactNode }
      : null,
    attraction.no_air_conditioning
      ? { label: "Ar condicionado", content: "Não tem" as React.ReactNode }
      : null,
  ].filter((fact): fact is { label: string; content: React.ReactNode } => fact !== null);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-1 text-sm text-oliva">
          <Link
            href={`/${countrySlug}`}
            className="transition-colors hover:text-terracota"
          >
            {attraction.cities.countries.name}
          </Link>
          <span>/</span>
          <Link
            href={`/${countrySlug}/${citySlug}`}
            className="transition-colors hover:text-terracota"
          >
            {attraction.cities.name}
          </Link>
          {ancestors.map((ancestor) => (
            <span key={ancestor.id} className="flex items-center gap-1">
              <span>/</span>
              <Link
                href={`/${countrySlug}/${citySlug}/${ancestor.slug}`}
                className="transition-colors hover:text-terracota"
              >
                {ancestor.name}
              </Link>
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate font-serif text-3xl text-tinta sm:text-4xl">
              {attraction.name}
            </h1>
            {!isContainer && (
              <p className="mt-1 text-xs uppercase tracking-wide text-oliva">
                {categoryLabel}
              </p>
            )}
          </div>

          {!isContainer && (
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <CurationRating rating={attraction.curation_rating} alignEnd />
              <RoteiroButton
                attraction={attraction}
                countrySlug={countrySlug}
                citySlug={citySlug}
              />
            </div>
          )}
        </div>

        {!isContainer && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-oliva/25 bg-branco px-3 py-1 text-xs text-oliva"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {!isContainer && (
          <div className="mt-8">
            <AttractionPhotos photos={photos} attractionName={attraction.name} />
          </div>
        )}

        <div className="mt-8">
          {attraction.description && (
            <section>
              <p className="leading-relaxed text-tinta whitespace-pre-line">
                {linkify(attraction.description)}
              </p>
            </section>
          )}

          {quickFacts.length > 0 && (
            <div className="mt-6 rounded-xl p-5">
              <h2 className="font-serif text-lg text-oliva">
                Detalhes rápidos
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {quickFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs uppercase tracking-wide text-oliva/70">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm text-oliva">{fact.content}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {!isContainer && attraction.exclusive_perk_description && (
            <section className="mt-6 rounded-xl border-2 border-terracota bg-terracota/5 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-terracota">
                Exclusivo Por Aqui Pelo Mundo
              </p>
              <p className="mt-2 leading-relaxed text-tinta">
                {linkify(attraction.exclusive_perk_description)}
              </p>
              {attraction.exclusive_perk_url && (
                <a
                  href={attraction.exclusive_perk_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
                >
                  {attraction.exclusive_perk_cta_label ||
                    "Aproveitar parceria"}
                </a>
              )}
            </section>
          )}

          {!isContainer && attraction.personal_experience && (
            <section className="mt-6 rounded-xl bg-branco p-5">
              <h2 className="font-serif text-lg text-tinta">
                Experiência de quem já foi
              </h2>
              <p className="mt-2 leading-relaxed text-tinta/90 whitespace-pre-line">
                {linkify(attraction.personal_experience)}
              </p>
            </section>
          )}

          {attraction.important_tips && (
            <section className="mt-6 rounded-xl border border-terracota/30 bg-terracota/5 p-5">
              <h2 className="font-serif text-lg text-tinta">
                Dicas importantes
              </h2>
              <p className="mt-2 leading-relaxed text-tinta/90 whitespace-pre-line">
                {linkify(attraction.important_tips)}
              </p>
            </section>
          )}
        </div>

        {isContainer && (
          <section className="mt-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {childrenAreDestinations
                ? childAttractions.map((child) => {
                    const childPhoto = [...child.attraction_photos].sort(
                      (a, b) => a.order - b.order,
                    )[0];
                    return (
                      <DestinationCard
                        key={child.id}
                        href={`/${countrySlug}/${citySlug}/${child.slug}`}
                        name={child.name}
                        imageUrl={childPhoto?.url ?? null}
                        imagePosition={parseImagePosition(childPhoto?.position)}
                      />
                    );
                  })
                : childAttractions.map((child) => (
                    <AttractionCard
                      key={child.id}
                      attraction={child}
                      countrySlug={countrySlug}
                      citySlug={citySlug}
                    />
                  ))}
            </div>
          </section>
        )}

        {!isContainer && (
          <AffiliateCallout
            variant="attraction"
            location={{
              cityName: attraction.cities.name,
              countryName: attraction.cities.countries.name,
            }}
            attractionId={attraction.id}
          />
        )}

        <section className="relative left-1/2 mt-12 w-screen -translate-x-1/2 bg-oliva">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
            <h2 className="font-serif text-xl text-branco">
              Perguntas sobre este lugar
            </h2>
            <div className="mt-4">
              <QuestionsSection
                attractionId={attraction.id}
                initialQuestions={questions}
              />
            </div>
          </div>
        </section>

        {!isContainer && (
          <section className="mt-12 border-t border-tinta/10 pt-8">
            <h2 className="font-serif text-xl text-tinta">
              Recomendações relacionadas
            </h2>
            <div className="mt-4">
              <RelatedContent
                mode="attraction"
                attraction={{
                  id: attraction.id,
                  citySlug: attraction.cities.slug,
                  latitude: attraction.latitude,
                  longitude: attraction.longitude,
                }}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
