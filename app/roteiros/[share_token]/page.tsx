import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSharedItineraryByToken } from "@/lib/shared-itinerary";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import CurationRating from "@/components/CurationRating";
import SharedItineraryMap from "@/components/SharedItineraryMap";
import { buildOpenGraph } from "@/lib/metadata";

// " | Por Aqui Pelo Mundo" acrescentado pelo template do layout raiz.
const SUFFIX_LEN = 23;

export async function generateMetadata(
  props: PageProps<"/roteiros/[share_token]">,
): Promise<Metadata> {
  const { share_token } = await props.params;
  const shared = await getSharedItineraryByToken(share_token).catch(() => null);
  if (!shared) {
    notFound();
  }

  const withLabel = `${shared.title}: roteiro de viagem`;
  const title =
    withLabel.length + SUFFIX_LEN <= 60
      ? withLabel
      : shared.title.length + SUFFIX_LEN <= 60
        ? shared.title
        : `${shared.title.slice(0, 60 - SUFFIX_LEN - 1).trimEnd()}…`;

  const attractionCount = shared.attractions.length;
  const description = shared.authorName
    ? `Roteiro de viagem com ${attractionCount} ${attractionCount === 1 ? "atração" : "atrações"} escolhidas por ${shared.authorName}, com curadoria pessoal de quem esteve lá.`
    : `Roteiro de viagem com ${attractionCount} ${attractionCount === 1 ? "atração" : "atrações"} escolhidas com curadoria pessoal de quem esteve lá.`;

  const image = shared.attractions[0]?.coverPhotoUrl ?? undefined;

  return {
    title,
    description,
    // Roteiros compartilhados são conteúdo gerado por usuários (não pela
    // curadoria da autora), então ficam fora do índice de busca — evita
    // páginas finas/duplicadas competindo com o conteúdo editorial do site.
    robots: { index: false },
    alternates: { canonical: `/roteiros/${share_token}` },
    openGraph: buildOpenGraph({
      title,
      description,
      images: image ? [image] : undefined,
    }),
  };
}

export default async function SharedItineraryPage(
  props: PageProps<"/roteiros/[share_token]">,
) {
  const { share_token } = await props.params;
  const shared = await getSharedItineraryByToken(share_token).catch(() => null);

  if (!shared) notFound();

  const mapPoints = shared.attractions
    .filter(
      (attraction): attraction is typeof attraction & { latitude: number; longitude: number } =>
        attraction.latitude !== null && attraction.longitude !== null,
    )
    .map((attraction, index) => ({
      id: attraction.id,
      name: attraction.name,
      order: index,
      lat: attraction.latitude,
      lng: attraction.longitude,
    }));

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-wide text-terracota">
          Roteiro compartilhado
        </p>
        <h1 className="mt-1 font-serif text-3xl text-tinta sm:text-4xl">
          {shared.title}
        </h1>
        <p className="mt-2 text-oliva">
          {shared.authorName
            ? `Planejado por ${shared.authorName}`
            : "Compartilhado anonimamente"}
          {" · "}
          {shared.attractions.length}{" "}
          {shared.attractions.length === 1 ? "atração" : "atrações"}
        </p>

        {mapPoints.length > 0 && (
          <div className="isolate mt-8 overflow-hidden rounded-xl">
            <SharedItineraryMap points={mapPoints} />
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {shared.attractions.map((attraction) => {
            const categoryLabel =
              ATTRACTION_CATEGORIES.find((c) => c.value === attraction.category)
                ?.label ?? attraction.category;

            return (
              <Link
                key={attraction.id}
                href={`/${attraction.countrySlug}/${attraction.citySlug}/${attraction.slug}`}
                className="flex items-center gap-3 rounded-xl bg-branco p-3 shadow-sm transition-colors hover:bg-areia"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-areia">
                  {attraction.coverPhotoUrl && (
                    <img
                      src={attraction.coverPhotoUrl}
                      alt={attraction.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg text-tinta">
                    {attraction.name}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-oliva">
                    {categoryLabel} · {attraction.cityName}
                  </p>
                  <div className="mt-1">
                    <CurationRating
                      rating={attraction.curationRating}
                      showLabel={false}
                      size="sm"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border-2 border-terracota bg-terracota/5 p-6 text-center">
          <p className="font-serif text-lg text-tinta">
            Curioso pra planejar sua própria viagem?
          </p>
          <p className="mt-1 text-sm text-oliva">
            Monte seu roteiro com curadoria real de quem já foi.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
          >
            Conhecer o Por Aqui Pelo Mundo
          </Link>
        </div>
      </div>
    </main>
  );
}
