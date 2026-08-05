import Link from "next/link";
import type { Database } from "@/types/database";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import CurationRating from "@/components/CurationRating";
import RoteiroButton from "@/components/RoteiroButton";

type Attraction = Database["public"]["Tables"]["attractions"]["Row"] & {
  attraction_photos: Database["public"]["Tables"]["attraction_photos"]["Row"][];
  attraction_tags: {
    tags: Database["public"]["Tables"]["tags"]["Row"];
  }[];
};

export default function AttractionCard({
  attraction,
  countrySlug,
  citySlug,
}: {
  attraction: Attraction;
  countrySlug: string;
  citySlug: string;
}) {
  const coverPhoto = [...attraction.attraction_photos].sort(
    (a, b) => a.order - b.order,
  )[0];
  const tags = attraction.attraction_tags.map((entry) => entry.tags);
  const categoryLabel =
    ATTRACTION_CATEGORIES.find((c) => c.value === attraction.category)
      ?.label ?? attraction.category;

  return (
    <div className="group relative">
      <Link
        href={`/${countrySlug}/${citySlug}/${attraction.slug}`}
        className="block"
      >
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-branco shadow-sm">
          {coverPhoto ? (
            <img
              src={coverPhoto.url}
              alt={attraction.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-lg text-oliva">
                {attraction.name}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <p className="text-xs uppercase tracking-wide text-oliva">
            {categoryLabel}
          </p>
          <h2 className="truncate font-serif text-lg text-tinta transition-colors group-hover:text-terracota">
            {attraction.name}
          </h2>
          <div className="mt-1">
            <CurationRating
              rating={attraction.curation_rating}
              showLabel={false}
              size="sm"
            />
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-oliva/25 bg-branco px-2 py-0.5 text-xs text-oliva"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="absolute right-2 top-2 z-10">
        <RoteiroButton
          attraction={attraction}
          countrySlug={countrySlug}
          citySlug={citySlug}
          variant="icon"
        />
      </div>
    </div>
  );
}
