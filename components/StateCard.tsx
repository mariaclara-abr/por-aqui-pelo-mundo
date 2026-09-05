import DestinationCard from "@/components/DestinationCard";
import { parseImagePosition } from "@/lib/image-position";
import type { Database } from "@/types/database";

type State = Database["public"]["Tables"]["states"]["Row"];

export default function StateCard({
  state,
  countrySlug,
}: {
  state: State;
  countrySlug: string;
}) {
  return (
    <DestinationCard
      href={`/${countrySlug}/${state.slug}`}
      name={state.name}
      imageUrl={state.cover_image_url}
      imagePosition={parseImagePosition(state.cover_image_position)}
    />
  );
}
