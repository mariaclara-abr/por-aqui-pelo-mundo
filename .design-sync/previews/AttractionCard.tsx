import AttractionCard from "@/components/AttractionCard";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%234A5D43'/%3E%3C/svg%3E";

function makeAttraction(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "1",
    slug: "torre-de-belem",
    name: "Torre de Belém",
    category: "ponto_turistico",
    curation_rating: 5,
    attraction_photos: [{ url: PLACEHOLDER_IMG, order: 0 }],
    attraction_tags: [
      { tags: { id: "t1", name: "Imperdível", slug: "imperdivel" } },
      { tags: { id: "t2", name: "Gratuito", slug: "gratuito" } },
    ],
    ...overrides,
  } as any;
}

export function Default() {
  return (
    <div className="w-72 bg-branco p-6">
      <AttractionCard
        attraction={makeAttraction()}
        countrySlug="portugal"
        citySlug="lisboa"
      />
    </div>
  );
}

export function WithoutPhoto() {
  return (
    <div className="w-72 bg-branco p-6">
      <AttractionCard
        attraction={makeAttraction({
          name: "Miradouro da Senhora do Monte",
          attraction_photos: [],
          attraction_tags: [],
        })}
        countrySlug="portugal"
        citySlug="lisboa"
      />
    </div>
  );
}
