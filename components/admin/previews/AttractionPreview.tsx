import CurationRating from "@/components/CurationRating";
import PriceRange from "@/components/PriceRange";
import AttractionPhotos from "@/components/attraction/AttractionPhotos";
import { linkify } from "@/components/Linkify";
import type { AdminPhoto } from "@/components/admin/PhotoUploader";
import { imagePositionToJson } from "@/lib/image-position";
import type { Database } from "@/types/database";

type Tag = Database["public"]["Tables"]["tags"]["Row"];

export default function AttractionPreview({
  name,
  categoryLabel,
  cityName,
  countryName,
  curationRating,
  tags,
  photos,
  description,
  personalExperience,
  importantTips,
  averageVisitTime,
  bestTimeOfDay,
  bestSeason,
  recommendedAudience,
  priceRange,
  weatherSensitive,
  intensePhysicalEffort,
  requiresAdvancePurchase,
  requiresReservation,
  hasAirConditioning,
  noAirConditioning,
  exclusivePerkDescription,
  exclusivePerkUrl,
  exclusivePerkCtaLabel,
}: {
  name: string;
  categoryLabel: string;
  cityName: string;
  countryName: string;
  curationRating: number | null;
  tags: Tag[];
  photos: AdminPhoto[];
  description: string;
  personalExperience: string;
  importantTips: string;
  averageVisitTime: string;
  bestTimeOfDay: string;
  bestSeason: string;
  recommendedAudience: string;
  priceRange: number | null;
  weatherSensitive: boolean;
  intensePhysicalEffort: boolean;
  requiresAdvancePurchase: boolean;
  requiresReservation: boolean;
  hasAirConditioning: boolean;
  noAirConditioning: boolean;
  exclusivePerkDescription: string;
  exclusivePerkUrl: string;
  exclusivePerkCtaLabel: string;
}) {
  const photoRows = photos.map((photo, index) => ({
    id: photo.id,
    attraction_id: "preview",
    url: photo.url,
    order: index,
    caption: photo.caption ?? null,
    position: photo.position ? imagePositionToJson(photo.position) : null,
  }));

  const quickFacts = [
    averageVisitTime
      ? { label: "Tempo médio de visita", content: averageVisitTime as React.ReactNode }
      : null,
    bestTimeOfDay
      ? { label: "Melhor horário", content: bestTimeOfDay as React.ReactNode }
      : null,
    bestSeason
      ? { label: "Melhor época", content: bestSeason as React.ReactNode }
      : null,
    recommendedAudience
      ? { label: "Público recomendado", content: recommendedAudience as React.ReactNode }
      : null,
    priceRange != null
      ? { label: "Faixa de preço", content: <PriceRange value={priceRange} /> }
      : null,
    weatherSensitive
      ? { label: "Sensível à chuva", content: "Sim" as React.ReactNode }
      : null,
    intensePhysicalEffort
      ? { label: "Esforço físico", content: "Intenso" as React.ReactNode }
      : null,
    requiresAdvancePurchase
      ? { label: "Compra antecipada", content: "Necessária" as React.ReactNode }
      : null,
    requiresReservation
      ? { label: "Reserva", content: "Necessária" as React.ReactNode }
      : null,
    hasAirConditioning
      ? { label: "Ar condicionado", content: "Sim" as React.ReactNode }
      : null,
    noAirConditioning
      ? { label: "Ar condicionado", content: "Não tem" as React.ReactNode }
      : null,
  ].filter((fact): fact is { label: string; content: React.ReactNode } => fact !== null);

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-1 text-sm text-oliva">
          <span>{countryName || "País"}</span>
          <span>/</span>
          <span>{cityName || "Cidade"}</span>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate font-serif text-3xl text-tinta sm:text-4xl">
              {name || "Nome da atração"}
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-oliva">
              {categoryLabel}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <CurationRating rating={curationRating} alignEnd />
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
          <AttractionPhotos
            photos={photoRows}
            attractionName={name || "Atração"}
          />
        </div>

        <div className="mt-8">
          {description && (
            <section>
              <p className="leading-relaxed text-tinta whitespace-pre-line">
                {linkify(description)}
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

          {exclusivePerkDescription && (
            <section className="mt-6 rounded-xl border-2 border-terracota bg-terracota/5 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-terracota">
                Exclusivo Por Aqui Pelo Mundo
              </p>
              <p className="mt-2 leading-relaxed text-tinta whitespace-pre-line">
                {linkify(exclusivePerkDescription)}
              </p>
              {exclusivePerkUrl && (
                <a
                  href={exclusivePerkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
                >
                  {exclusivePerkCtaLabel || "Aproveitar parceria"}
                </a>
              )}
            </section>
          )}

          {personalExperience && (
            <section className="mt-6 rounded-xl bg-branco p-5">
              <h2 className="font-serif text-lg text-tinta">
                Experiência de quem já foi
              </h2>
              <p className="mt-2 leading-relaxed text-tinta/90 whitespace-pre-line">
                {linkify(personalExperience)}
              </p>
            </section>
          )}

          {importantTips && (
            <section className="mt-6 rounded-xl border border-terracota/30 bg-terracota/5 p-5">
              <h2 className="font-serif text-lg text-tinta">
                Dicas importantes
              </h2>
              <p className="mt-2 leading-relaxed text-tinta/90 whitespace-pre-line">
                {linkify(importantTips)}
              </p>
            </section>
          )}
        </div>

        <div className="mt-12 rounded-xl border border-dashed border-oliva/30 p-5 text-center">
          <p className="text-sm text-oliva">
            Perguntas dos visitantes e recomendações relacionadas aparecem
            aqui, na página publicada.
          </p>
        </div>
      </div>
    </main>
  );
}
