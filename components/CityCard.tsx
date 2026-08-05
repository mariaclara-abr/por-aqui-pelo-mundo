import DestinationCard from "@/components/DestinationCard";
import type { Database } from "@/types/database";

type City = Database["public"]["Tables"]["cities"]["Row"];

export default function CityCard({
  city,
  countrySlug,
}: {
  city: City;
  countrySlug: string;
}) {
  return (
    <DestinationCard
      href={`/${countrySlug}/${city.slug}`}
      name={city.name}
      imageUrl={city.cover_image_url}
    />
  );
}
