import CurationRating from "@/components/CurationRating";
import AttractionPhotos from "@/components/attraction/AttractionPhotos";
import { linkify } from "@/components/Linkify";
import type { AdminPhoto } from "@/components/admin/PhotoUploader";
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
  importantNotes,
  averageVisitTime,
  bestTimeOfDay,
  bestSeason,
  recommendedAudience,
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
  importantNotes: string;
  averageVisitTime: string;
  bestTimeOfDay: string;
  bestSeason: string;
  recommendedAudience: string;
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
  }));

  const quickFacts = [
    { label: "Tempo médio de visita", value: averageVisitTime },
    { label: "Melhor horário", value: bestTimeOfDay },
    { label: "Melhor época", value: bestSeason },
    { label: "Público recomendado", value: recommendedAudience },
  ].filter((fact): fact is { label: string; value: string } => !!fact.value);

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
              <p className="leading-relaxed text-tinta">
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
                    <dd className="mt-1 text-sm text-oliva">{fact.value}</dd>
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
              <p className="mt-2 leading-relaxed text-tinta">
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
              <p className="mt-2 leading-relaxed text-tinta/90">
                {linkify(personalExperience)}
              </p>
            </section>
          )}

          {importantTips && (
            <section className="mt-6 rounded-xl border border-terracota/30 bg-terracota/5 p-5">
              <h2 className="font-serif text-lg text-tinta">
                Dicas importantes
              </h2>
              <p className="mt-2 leading-relaxed text-tinta/90">
                {linkify(importantTips)}
              </p>
            </section>
          )}

          {importantNotes && (
            <section className="mt-6 border-l-2 border-oliva/40 pl-4">
              <h2 className="font-serif text-lg text-tinta">
                Observações importantes
              </h2>
              <p className="mt-2 leading-relaxed text-tinta/90">
                {linkify(importantNotes)}
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
