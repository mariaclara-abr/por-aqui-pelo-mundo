import { getCountryBySlug } from "@/lib/queries";
import { OG_SIZE, placeImage } from "@/lib/og-place-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Foto de capa do país no Por Aqui Pelo Mundo";

export default async function Image(props: PageProps<"/[countrySlug]">) {
  const { countrySlug } = await props.params;
  const country = await getCountryBySlug(countrySlug).catch(() => null);
  return placeImage({
    name: country?.name ?? "Por Aqui Pelo Mundo",
    photoUrl: country?.cover_image_url ?? null,
  });
}
