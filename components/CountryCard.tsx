import DestinationCard from "@/components/DestinationCard";
import { parseImagePosition } from "@/lib/image-position";
import type { Database } from "@/types/database";

type Country = Database["public"]["Tables"]["countries"]["Row"];

export default function CountryCard({ country }: { country: Country }) {
  return (
    <DestinationCard
      href={`/${country.slug}`}
      name={country.name}
      imageUrl={country.cover_image_url}
      imagePosition={parseImagePosition(country.cover_image_position)}
    />
  );
}
