import Link from "next/link";
import Image from "next/image";
import { deriveDestination, type ItinerarySummary } from "@/lib/itinerary-queries";

export default function PublicItineraryList({
  itineraries,
}: {
  itineraries: ItinerarySummary[];
}) {
  if (itineraries.length === 0) {
    return (
      <p className="text-oliva">Nenhum roteiro público por aqui ainda.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {itineraries.map((itinerary) => {
        const photos = itinerary.items
          .map((item) => item.attraction.coverPhotoUrl)
          .filter((url): url is string => url !== null)
          .slice(0, 4);

        return (
          <details
            key={itinerary.id}
            className="group rounded-xl bg-branco p-4 shadow-sm"
          >
            <summary className="flex cursor-pointer list-none flex-wrap items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <div>
                <h3 className="font-serif text-lg text-tinta">
                  {itinerary.title}
                </h3>
                <p className="text-sm text-oliva">
                  {deriveDestination(itinerary)}
                </p>
                <p className="mt-1 text-xs text-oliva">
                  {itinerary.items.length}{" "}
                  {itinerary.items.length === 1
                    ? "atração"
                    : "atrações"}{" "}
                  · {itinerary.status === "concluida" ? "concluído" : "planejando"}
                </p>
              </div>

              {photos.length > 0 && (
                <div className="flex -space-x-3">
                  {photos.map((url, index) => (
                    <div
                      key={index}
                      className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-branco"
                    >
                      <Image src={url} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </summary>

            <ul className="mt-4 flex flex-col gap-2 border-t border-oliva/15 pt-3">
              {itinerary.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/${item.attraction.countrySlug}/${item.attraction.citySlug}/${item.attraction.slug}`}
                    className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-areia"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-areia">
                      {item.attraction.coverPhotoUrl && (
                        <Image
                          src={item.attraction.coverPhotoUrl}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="text-sm text-tinta">
                      {item.attraction.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
