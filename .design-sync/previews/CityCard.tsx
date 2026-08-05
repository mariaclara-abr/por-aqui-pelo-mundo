import CityCard from "@/components/CityCard";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%234A5D43'/%3E%3C/svg%3E";

const city = {
  id: "1",
  slug: "lisboa",
  name: "Lisboa",
  cover_image_url: PLACEHOLDER_IMG,
} as any;

export function Default() {
  return (
    <div className="w-72 bg-branco p-6">
      <CityCard city={city} countrySlug="portugal" />
    </div>
  );
}
