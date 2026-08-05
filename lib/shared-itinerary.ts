import { cache } from "react";
import { createClient } from "@/lib/supabase-server";
import type { AttractionCategory } from "@/types/database";

export interface SharedItineraryAttraction {
  id: string;
  name: string;
  slug: string;
  category: AttractionCategory;
  curationRating: number;
  coverPhotoUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  citySlug: string;
  cityName: string;
  countrySlug: string;
}

export interface SharedItinerary {
  title: string;
  authorName: string | null;
  attractions: SharedItineraryAttraction[];
}

// Busca um roteiro pelo token de compartilhamento. Só retorna algo se o
// compartilhamento existir e estiver ativo (is_public = true) — a RLS de
// `itineraries`/`itinerary_items` também depende dessa mesma condição, então
// um link desativado já vem bloqueado no banco, não só aqui.
export const getSharedItineraryByToken = cache(async (
  token: string,
): Promise<SharedItinerary | null> => {
  const supabase = await createClient();

  const { data: share, error: shareError } = await supabase
    .from("shared_itineraries")
    .select("itinerary_id, created_by, show_author_name")
    .eq("share_token", token)
    .eq("is_public", true)
    .maybeSingle();
  if (shareError) throw shareError;
  if (!share) return null;

  const { data: itinerary, error: itineraryError } = await supabase
    .from("itineraries")
    .select(
      "title, itinerary_items(order, attractions(id, name, slug, category, curation_rating, latitude, longitude, attraction_photos(url, order), cities(name, slug, countries(slug))))",
    )
    .eq("id", share.itinerary_id)
    .maybeSingle();
  if (itineraryError) throw itineraryError;
  if (!itinerary) return null;

  let authorName: string | null = null;
  if (share.show_author_name) {
    const { data: profile } = await supabase
      .from("public_profiles")
      .select("display_name, username")
      .eq("id", share.created_by)
      .maybeSingle();
    authorName = profile?.display_name || profile?.username || null;
  }

  const attractions = itinerary.itinerary_items
    .map((item) => {
      const attraction = item.attractions;
      if (!attraction?.cities?.countries) return null;
      const cover = [...attraction.attraction_photos].sort(
        (a, b) => a.order - b.order,
      )[0];
      return {
        order: item.order,
        attraction: {
          id: attraction.id,
          name: attraction.name,
          slug: attraction.slug,
          category: attraction.category,
          curationRating: attraction.curation_rating,
          coverPhotoUrl: cover?.url ?? null,
          latitude: attraction.latitude,
          longitude: attraction.longitude,
          citySlug: attraction.cities.slug,
          cityName: attraction.cities.name,
          countrySlug: attraction.cities.countries.slug,
        },
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.attraction);

  return { title: itinerary.title, authorName, attractions };
});
