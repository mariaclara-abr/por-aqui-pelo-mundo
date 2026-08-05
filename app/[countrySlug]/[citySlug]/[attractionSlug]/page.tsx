import Link from "next/link";
import { notFound } from "next/navigation";
import { getAttractionBySlug } from "@/lib/queries";
import { getAttractionQuestions } from "@/lib/questions";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import CurationRating from "@/components/CurationRating";
import RoteiroButton from "@/components/RoteiroButton";
import RelatedContent from "@/components/RelatedContent";
import QuestionsSection from "@/components/attraction/QuestionsSection";
import AffiliateCallout from "@/components/AffiliateCallout";

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
  const categoryLabel =
    ATTRACTION_CATEGORIES.find((c) => c.value === attraction.category)
      ?.label ?? attraction.category;

  const questions = await getAttractionQuestions(attraction.id).catch(() => []);

  const quickFacts = [
    { label: "Tempo médio de visita", value: attraction.average_visit_time },
    { label: "Melhor horário", value: attraction.best_time_of_day },
    { label: "Melhor época", value: attraction.best_season },
    { label: "Público recomendado", value: attraction.recommended_audience },
  ].filter((fact): fact is { label: string; value: string } => !!fact.value);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
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
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate font-serif text-3xl text-tinta sm:text-4xl">
              {attraction.name}
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-oliva">
              {categoryLabel}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <CurationRating rating={attraction.curation_rating} alignEnd />
            <RoteiroButton
              attraction={attraction}
              countrySlug={countrySlug}
              citySlug={citySlug}
            />
          </div>
        </div>

        {tags.length > 0 && (
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

        <div className="mt-8">
          {photos.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-branco">
                <img
                  src={photos[0].url}
                  alt={attraction.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {photos.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {photos.slice(1).map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-[4/3] overflow-hidden rounded-lg bg-branco"
                    >
                      <img
                        src={photo.url}
                        alt={attraction.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-branco">
              <span className="font-serif text-lg text-oliva">
                {attraction.name}
              </span>
            </div>
          )}
        </div>

        {attraction.description && (
          <section className="mt-8">
            <p className="leading-relaxed text-tinta">
              {attraction.description}
            </p>
          </section>
        )}

        {attraction.exclusive_perk_description && (
          <section className="mt-6 rounded-xl border-2 border-terracota bg-terracota/5 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-terracota">
              Exclusivo Por Aqui Pelo Mundo
            </p>
            <p className="mt-2 leading-relaxed text-tinta">
              {attraction.exclusive_perk_description}
            </p>
            {attraction.exclusive_perk_url && (
              <a
                href={attraction.exclusive_perk_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
              >
                {attraction.exclusive_perk_cta_label || "Aproveitar parceria"}
              </a>
            )}
          </section>
        )}

        {attraction.personal_experience && (
          <section className="mt-6 rounded-xl bg-branco p-5">
            <h2 className="font-serif text-lg text-tinta">
              Experiência de quem já foi
            </h2>
            <p className="mt-2 leading-relaxed text-tinta/90">
              {attraction.personal_experience}
            </p>
          </section>
        )}

        {attraction.important_tips && (
          <section className="mt-6 rounded-xl border border-terracota/30 bg-terracota/5 p-5">
            <h2 className="font-serif text-lg text-tinta">
              Dicas importantes
            </h2>
            <p className="mt-2 leading-relaxed text-tinta/90">
              {attraction.important_tips}
            </p>
          </section>
        )}

        {quickFacts.length > 0 && (
          <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <p className="text-xs uppercase tracking-wide text-oliva">
                  {fact.label}
                </p>
                <p className="mt-1 text-sm text-tinta">{fact.value}</p>
              </div>
            ))}
          </section>
        )}

        {attraction.important_notes && (
          <section className="mt-6 border-l-2 border-oliva/40 pl-4">
            <h2 className="font-serif text-lg text-tinta">
              Observações importantes
            </h2>
            <p className="mt-2 leading-relaxed text-tinta/90">
              {attraction.important_notes}
            </p>
          </section>
        )}

        <AffiliateCallout
          variant="attraction"
          location={{
            cityName: attraction.cities.name,
            countryName: attraction.cities.countries.name,
          }}
          attractionId={attraction.id}
        />

        <section className="mt-12 border-t border-tinta/10 pt-8">
          <h2 className="font-serif text-xl text-tinta">
            Perguntas sobre este lugar
          </h2>
          <div className="mt-4">
            <QuestionsSection
              attractionId={attraction.id}
              initialQuestions={questions}
            />
          </div>
        </section>

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
      </div>
    </main>
  );
}
