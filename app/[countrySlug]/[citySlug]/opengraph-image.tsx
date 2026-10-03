import { getCityBySlug, getStateBySlug } from "@/lib/queries";
import { OG_SIZE, placeImage } from "@/lib/og-place-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Foto de capa do destino no Por Aqui Pelo Mundo";

// O segundo segmento é uma cidade ou, no Brasil, um estado.
export default async function Image(props: PageProps<"/[countrySlug]/[citySlug]">) {
  const { citySlug } = await props.params;
  const city = await getCityBySlug(citySlug).catch(() => null);
  if (city) {
    return placeImage({
      name: city.name,
      subtitle: city.countries.name,
      photoUrl: city.cover_image_url ?? city.countries.cover_image_url,
    });
  }
  const state = await getStateBySlug(citySlug).catch(() => null);
  return placeImage({
    name: state?.name ?? "Por Aqui Pelo Mundo",
    subtitle: state?.countries.name,
    photoUrl: state?.cover_image_url ?? state?.countries.cover_image_url ?? null,
  });
}
