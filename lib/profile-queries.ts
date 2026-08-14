import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-browser";
import type { ItineraryItemSummary, ItinerarySummary } from "@/lib/itinerary-queries";

export interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  memberSince: string;
}

export async function getPublicProfileByUsername(
  username: string,
): Promise<PublicProfile | null> {
  const { data, error } = await supabase
    .from("public_profiles")
    .select("id, username, display_name, avatar_url, created_at")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    username: data.username,
    displayName: data.display_name || data.username,
    avatarUrl: data.avatar_url,
    memberSince: data.created_at,
  };
}

export interface VisitedCountry {
  id: string;
  name: string;
  slug: string;
}

export async function getVisitedCountries(
  userId: string,
): Promise<VisitedCountry[]> {
  const { data, error } = await supabase
    .from("visited_countries")
    .select("countries(id, name, slug)")
    .eq("user_id", userId);

  if (error) throw error;

  return data
    .map((row) => row.countries)
    .filter((country): country is VisitedCountry => country !== null)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function addVisitedCountry(userId: string, countryId: string) {
  const client = createClient();
  const { error } = await client
    .from("visited_countries")
    .insert({ user_id: userId, country_id: countryId });
  if (error) throw error;
}

export async function removeVisitedCountry(
  userId: string,
  countryId: string,
) {
  const client = createClient();
  const { error } = await client
    .from("visited_countries")
    .delete()
    .eq("user_id", userId)
    .eq("country_id", countryId);
  if (error) throw error;
}

// Mesma leitura de lib/itinerary-queries.ts (getUserItineraries), mas com o
// cliente anônimo: quem chama pode ser um visitante sem sessão, e o próprio
// RLS de itineraries já decide o que volta (só os roteiros com is_public = true).
export async function getPublicItineraries(
  userId: string,
): Promise<ItinerarySummary[]> {
  const { data, error } = await supabase
    .from("itineraries")
    .select(
      "id, title, start_date, end_date, status, is_public, created_at, itinerary_items(id, order, attractions(id, name, slug, attraction_photos(url, order), cities(name, slug, countries(slug))))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((itinerary) => ({
    id: itinerary.id,
    title: itinerary.title,
    startDate: itinerary.start_date,
    endDate: itinerary.end_date,
    status: itinerary.status,
    isPublic: itinerary.is_public,
    createdAt: itinerary.created_at,
    items: itinerary.itinerary_items
      .map((item): ItineraryItemSummary | null => {
        const attraction = item.attractions;
        if (!attraction?.cities?.countries) return null;
        const cover = [...attraction.attraction_photos].sort(
          (a, b) => a.order - b.order,
        )[0];
        return {
          id: item.id,
          order: item.order,
          attraction: {
            id: attraction.id,
            name: attraction.name,
            slug: attraction.slug,
            coverPhotoUrl: cover?.url ?? null,
            citySlug: attraction.cities.slug,
            cityName: attraction.cities.name,
            countrySlug: attraction.cities.countries.slug,
          },
        };
      })
      .filter((item): item is ItineraryItemSummary => item !== null)
      .sort((a, b) => a.order - b.order),
  }));
}
