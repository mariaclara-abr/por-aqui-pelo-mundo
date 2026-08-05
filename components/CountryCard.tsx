import DestinationCard from "@/components/DestinationCard";
import type { Database } from "@/types/database";

type Country = Database["public"]["Tables"]["countries"]["Row"];

export default function CountryCard({ country }: { country: Country }) {
  return (
    <DestinationCard
      href={`/${country.slug}`}
      name={country.name}
      imageUrl={country.cover_image_url}
    />
  );
}
