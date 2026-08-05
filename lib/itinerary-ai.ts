import { createClient } from "@/lib/supabase-server";
import { getActivePremium } from "@/lib/subscription";
import { canAddCountryToItinerary } from "@/lib/itinerary-country-limit";
import type { AttractionCategory } from "@/types/database";

// Quantas atrações "sugeridas" (ainda não escolhidas pelo viajante) buscamos
// por cidade do roteiro, no máximo, para oferecer como candidatas à IA.
const MAX_CANDIDATES_PER_CITY = 6;

export interface AIAttraction {
  id: string;
  name: string;
  slug: string;
  category: AttractionCategory;
  curationRating: number;
  latitude: number | null;
  longitude: number | null;
  averageVisitTime: string | null;
  bestTimeOfDay: string | null;
  description: string | null;
  cityName: string;
  citySlug: string;
  countrySlug: string;
  coverPhotoUrl: string | null;
}

export interface ItineraryForAI {
  itineraryId: string;
  title: string;
  attractions: AIAttraction[];
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

interface RawAttractionRow {
  id: string;
  name: string;
  slug: string;
  category: AttractionCategory;
  curation_rating: number;
  latitude: number | null;
  longitude: number | null;
  average_visit_time: string | null;
  best_time_of_day: string | null;
  description: string | null;
  attraction_photos: { url: string; order: number }[];
  cities: { name: string; slug: string; countries: { slug: string } | null } | null;
}

function mapAttractionRow(a: RawAttractionRow): AIAttraction | null {
  if (!a.cities || !a.cities.countries) return null;
  const cover = [...a.attraction_photos].sort((x, y) => x.order - y.order)[0];
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    category: a.category,
    curationRating: a.curation_rating,
    latitude: a.latitude,
    longitude: a.longitude,
    averageVisitTime: a.average_visit_time,
    bestTimeOfDay: a.best_time_of_day,
    description: a.description,
    cityName: a.cities.name,
    citySlug: a.cities.slug,
    countrySlug: a.cities.countries.slug,
    coverPhotoUrl: cover?.url ?? null,
  };
}

async function fetchItineraryAttractions(
  supabase: SupabaseServerClient,
  itineraryId: string,
): Promise<AIAttraction[]> {
  const { data, error } = await supabase
    .from("itinerary_items")
    .select(
      "order, attractions(id, name, slug, category, curation_rating, latitude, longitude, average_visit_time, best_time_of_day, description, attraction_photos(url, order), cities(name, slug, countries(slug)))",
    )
    .eq("itinerary_id", itineraryId)
    .order("order");

  if (error) throw error;

  return data
    .map((item) => item.attractions)
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .map(mapAttractionRow)
    .filter((a): a is AIAttraction => a !== null);
}

// Atrações da curadoria nas mesmas cidades do roteiro, ainda não escolhidas
// pelo viajante — o pool de onde a IA pode tirar sugestões novas. Nunca
// inventa lugares fora do que já está cadastrado no banco.
export async function getCandidateAttractions(
  itinerary: ItineraryForAI,
): Promise<AIAttraction[]> {
  const supabase = await createClient();
  const citySlugs = [...new Set(itinerary.attractions.map((a) => a.citySlug))];
  if (citySlugs.length === 0) return [];

  const existingIds = new Set(itinerary.attractions.map((a) => a.id));

  const { data: cities, error: citiesError } = await supabase
    .from("cities")
    .select("id")
    .in("slug", citySlugs);
  if (citiesError) throw citiesError;

  const cityIds = cities.map((c) => c.id);
  if (cityIds.length === 0) return [];

  const { data, error } = await supabase
    .from("attractions")
    .select(
      "id, name, slug, category, curation_rating, latitude, longitude, average_visit_time, best_time_of_day, description, attraction_photos(url, order), cities(name, slug, countries(slug))",
    )
    .in("city_id", cityIds);
  if (error) throw error;

  const byCity = new Map<string, AIAttraction[]>();
  for (const row of data) {
    if (existingIds.has(row.id)) continue;
    const attraction = mapAttractionRow(row);
    if (!attraction) continue;
    const list = byCity.get(attraction.citySlug) ?? [];
    list.push(attraction);
    byCity.set(attraction.citySlug, list);
  }

  const candidates: AIAttraction[] = [];
  for (const list of byCity.values()) {
    list.sort((a, b) => b.curationRating - a.curationRating);
    candidates.push(...list.slice(0, MAX_CANDIDATES_PER_CITY));
  }
  return candidates;
}

// Busca o roteiro que o usuário está editando no momento (o mesmo que
// /meu-roteiro mostra) — usada pela página de organizar com IA e pelo chat,
// que sempre devem operar no roteiro selecionado, não em qualquer um.
export async function getActiveItineraryForAI(
  userId: string,
): Promise<ItineraryForAI | null> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("current_itinerary_id")
    .eq("id", userId)
    .single();
  if (profileError) throw profileError;

  let itinerary: { id: string; title: string } | null = null;

  if (profile.current_itinerary_id) {
    const { data, error } = await supabase
      .from("itineraries")
      .select("id, title")
      .eq("id", profile.current_itinerary_id)
      .eq("user_id", userId)
      .eq("status", "planejando")
      .maybeSingle();
    if (error) throw error;
    itinerary = data;
  }

  if (!itinerary) {
    const { data, error } = await supabase
      .from("itineraries")
      .select("id, title")
      .eq("user_id", userId)
      .eq("status", "planejando")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    itinerary = data;
  }

  if (!itinerary) return null;

  const attractions = await fetchItineraryAttractions(supabase, itinerary.id);
  return { itineraryId: itinerary.id, title: itinerary.title, attractions };
}

// Busca um roteiro por id — usada pela API route. A RLS ("Users can view
// their own itineraries") garante que só retorna algo se o roteiro pertencer
// ao usuário autenticado da requisição.
export async function getItineraryForAIById(
  itineraryId: string,
): Promise<ItineraryForAI | null> {
  const supabase = await createClient();

  const { data: itinerary, error } = await supabase
    .from("itineraries")
    .select("id, title")
    .eq("id", itineraryId)
    .maybeSingle();

  if (error) throw error;
  if (!itinerary) return null;

  const attractions = await fetchItineraryAttractions(supabase, itinerary.id);
  return { itineraryId: itinerary.id, title: itinerary.title, attractions };
}

// --- Ferramentas usadas pelo chat de edição do roteiro (lib/itinerary-chat.ts) ---
// Cada função aqui é a implementação REAL por trás de uma ferramenta que a IA
// pode chamar. A IA nunca toca o banco diretamente — ela só decide qual
// ferramenta usar; quem executa e valida é este arquivo, sob a RLS do usuário
// autenticado da requisição.

export interface ChatAttractionMatch {
  id: string;
  name: string;
  cityName: string;
  category: AttractionCategory;
  curationRating: number;
}

// Busca por nome na curadoria — é assim que a IA descobre o id real de um
// lugar que o usuário mencionou por nome, sem nunca inventar um id.
export async function searchAttractionsForChat(
  query: string,
): Promise<ChatAttractionMatch[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attractions")
    .select("id, name, category, curation_rating, cities(name)")
    .ilike("name", `%${query}%`)
    .order("curation_rating", { ascending: false })
    .limit(8);

  if (error) throw error;

  return data
    .filter((a): a is typeof a & { cities: { name: string } } => a.cities !== null)
    .map((a) => ({
      id: a.id,
      name: a.name,
      cityName: a.cities.name,
      category: a.category,
      curationRating: a.curation_rating,
    }));
}

export async function addAttractionToItineraryChat(
  itineraryId: string,
  attractionId: string,
  userId: string,
) {
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("itinerary_items")
    .select("id")
    .eq("itinerary_id", itineraryId)
    .eq("attraction_id", attractionId)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return { alreadyInItinerary: true };

  const { data: attraction, error: attractionError } = await supabase
    .from("attractions")
    .select("id, name, cities(countries(slug))")
    .eq("id", attractionId)
    .maybeSingle();
  if (attractionError) throw attractionError;
  if (!attraction) {
    throw new Error("Essa atração não existe na curadoria do site.");
  }

  const newCountrySlug = attraction.cities?.countries?.slug;
  if (newCountrySlug) {
    const { data: existingItems, error: itemsError } = await supabase
      .from("itinerary_items")
      .select("attractions(cities(countries(slug)))")
      .eq("itinerary_id", itineraryId);
    if (itemsError) throw itemsError;

    const existingCountrySlugs = existingItems
      .map((item) => item.attractions?.cities?.countries?.slug)
      .filter((slug): slug is string => !!slug);

    const premium = await getActivePremium(supabase, userId);
    if (
      !canAddCountryToItinerary(existingCountrySlugs, newCountrySlug, !!premium)
    ) {
      throw new Error(
        "Esse roteiro já tem atrações de outro país — o limite é 1 país por roteiro, a menos que você seja Premium. Crie um novo roteiro pra essa atração (dá pra fazer isso na tela do roteiro).",
      );
    }
  }

  const { count, error: countError } = await supabase
    .from("itinerary_items")
    .select("*", { count: "exact", head: true })
    .eq("itinerary_id", itineraryId);
  if (countError) throw countError;

  const { error } = await supabase
    .from("itinerary_items")
    .insert({ itinerary_id: itineraryId, attraction_id: attractionId, order: count ?? 0 });
  if (error) throw error;

  return { alreadyInItinerary: false, name: attraction.name };
}

export async function removeAttractionFromItineraryChat(
  itineraryId: string,
  attractionId: string,
) {
  const supabase = await createClient();

  const { error, count } = await supabase
    .from("itinerary_items")
    .delete({ count: "exact" })
    .eq("itinerary_id", itineraryId)
    .eq("attraction_id", attractionId);
  if (error) throw error;

  return { removed: (count ?? 0) > 0 };
}

export async function reorderItineraryItemsChat(
  itineraryId: string,
  orderedAttractionIds: string[],
) {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("itinerary_items")
    .select("id, attraction_id")
    .eq("itinerary_id", itineraryId);
  if (error) throw error;

  const itemIdByAttractionId = new Map(items.map((i) => [i.attraction_id, i.id]));
  const updates = orderedAttractionIds
    .map((attractionId, index) => {
      const itemId = itemIdByAttractionId.get(attractionId);
      return itemId ? { id: itemId, order: index } : null;
    })
    .filter((u): u is { id: string; order: number } => u !== null);

  const results = await Promise.all(
    updates.map(({ id, order }) =>
      supabase.from("itinerary_items").update({ order }).eq("id", id),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;

  return { reordered: updates.length };
}

export async function renameItineraryChat(itineraryId: string, title: string) {
  const supabase = await createClient();

  const trimmed = title.trim().slice(0, 100);
  if (!trimmed) throw new Error("O título não pode ficar vazio.");

  const { error } = await supabase
    .from("itineraries")
    .update({ title: trimmed })
    .eq("id", itineraryId);
  if (error) throw error;

  return { title: trimmed };
}
