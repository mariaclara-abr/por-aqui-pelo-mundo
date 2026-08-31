import { createClient } from "@/lib/supabase-browser";
import type { ItineraryStatus } from "@/types/database";

export async function createItineraryRow(userId: string) {
  const supabase = createClient();

  const { data: created, error: createError } = await supabase
    .from("itineraries")
    .insert({ user_id: userId })
    .select("id, title")
    .single();

  if (createError) throw createError;
  return created;
}

export async function getOrCreateActiveItinerary(userId: string) {
  const supabase = createClient();

  const { data: existing, error: existingError } = await supabase
    .from("itineraries")
    .select("id, title")
    .eq("user_id", userId)
    .eq("status", "planejando")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing;

  return createItineraryRow(userId);
}

export async function getItineraryTitle(itineraryId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select("title")
    .eq("id", itineraryId)
    .single();
  if (error) throw error;
  return data.title;
}

export async function setCurrentItineraryId(
  userId: string,
  itineraryId: string,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ current_itinerary_id: itineraryId })
    .eq("id", userId);
  if (error) throw error;
}

// Resolve qual roteiro deve abrir em /meu-roteiro: o que estiver marcado como
// atual no perfil (se ainda for um roteiro "planejando" do usuário), ou o
// fallback de sempre (o mais antigo em planejamento, criando um se não
// houver nenhum) — e, nesse caso, já grava essa escolha como a atual, pra
// contas antigas (de antes dessa coluna existir) se auto-corrigirem.
export async function getOrCreateCurrentItinerary(userId: string) {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("current_itinerary_id")
    .eq("id", userId)
    .single();
  if (profileError) throw profileError;

  if (profile.current_itinerary_id) {
    const { data: current, error: currentError } = await supabase
      .from("itineraries")
      .select("id, title")
      .eq("id", profile.current_itinerary_id)
      .eq("user_id", userId)
      .eq("status", "planejando")
      .maybeSingle();
    if (currentError) throw currentError;
    if (current) return current;
  }

  const fallback = await getOrCreateActiveItinerary(userId);
  await setCurrentItineraryId(userId, fallback.id);
  return fallback;
}

export async function renameItinerary(itineraryId: string, title: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("itineraries")
    .update({ title })
    .eq("id", itineraryId);
  if (error) throw error;
}

export async function loadAccountItems(itineraryId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("itinerary_items")
    .select(
      "id, order, attraction_id, attractions(id, name, slug, categories, curation_rating, latitude, longitude, attraction_photos(url, order), cities(slug, countries(slug)))",
    )
    .eq("itinerary_id", itineraryId);

  if (error) throw error;
  return data;
}

export async function addAccountItem(
  itineraryId: string,
  attractionId: string,
  order: number,
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("itinerary_items")
    .insert({ itinerary_id: itineraryId, attraction_id: attractionId, order })
    .select("id, order, attraction_id")
    .single();

  if (error) throw error;
  return data;
}

export async function removeAccountItem(itemId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("itinerary_items")
    .delete()
    .eq("id", itemId);

  if (error) throw error;
}

export async function reorderAccountItems(
  items: { id: string; order: number }[],
) {
  const supabase = createClient();

  const results = await Promise.all(
    items.map(({ id, order }) =>
      supabase.from("itinerary_items").update({ order }).eq("id", id),
    ),
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
}

export async function migrateLocalItemsToAccount(
  itineraryId: string,
  attractionIds: string[],
) {
  const supabase = createClient();

  const { data: existingItems, error: existingError } = await supabase
    .from("itinerary_items")
    .select("attraction_id, order")
    .eq("itinerary_id", itineraryId);

  if (existingError) throw existingError;

  const existingIds = new Set(existingItems.map((item) => item.attraction_id));
  const nextOrderStart =
    existingItems.reduce((max, item) => Math.max(max, item.order), -1) + 1;

  const newRows = attractionIds
    .filter((id) => !existingIds.has(id))
    .map((attractionId, index) => ({
      itinerary_id: itineraryId,
      attraction_id: attractionId,
      order: nextOrderStart + index,
    }));

  if (newRows.length === 0) return;

  const { error } = await supabase.from("itinerary_items").insert(newRows);
  if (error) throw error;
}

export interface ItineraryItemSummary {
  id: string;
  order: number;
  attraction: {
    id: string;
    name: string;
    slug: string;
    coverPhotoUrl: string | null;
    citySlug: string;
    cityName: string;
    countrySlug: string;
  };
}

export interface ItinerarySummary {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  status: ItineraryStatus;
  isPublic: boolean;
  createdAt: string;
  items: ItineraryItemSummary[];
}

export function deriveDestination(itinerary: ItinerarySummary) {
  const cities = [
    ...new Set(itinerary.items.map((item) => item.attraction.cityName)),
  ];
  if (cities.length === 0) return "Sem destino definido ainda";
  return cities.join(" · ");
}

export async function getUserItineraries(
  userId: string,
): Promise<ItinerarySummary[]> {
  const supabase = createClient();

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

export async function duplicateItinerary(
  itinerary: ItinerarySummary,
  userId: string,
) {
  const supabase = createClient();

  const { data: created, error: createError } = await supabase
    .from("itineraries")
    .insert({ user_id: userId, title: `${itinerary.title} (cópia)` })
    .select("id")
    .single();
  if (createError) throw createError;

  if (itinerary.items.length > 0) {
    const { error: insertError } = await supabase.from("itinerary_items").insert(
      itinerary.items.map((item, index) => ({
        itinerary_id: created.id,
        attraction_id: item.attraction.id,
        order: index,
      })),
    );
    if (insertError) throw insertError;
  }

  return created.id;
}

export async function setItineraryStatus(
  itineraryId: string,
  status: ItineraryStatus,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("itineraries")
    .update({ status })
    .eq("id", itineraryId);
  if (error) throw error;
}

export async function getItineraryPublicStatus(
  itineraryId: string,
): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select("is_public")
    .eq("id", itineraryId)
    .single();
  if (error) throw error;
  return data.is_public;
}

export async function setItineraryPublic(itineraryId: string, isPublic: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("itineraries")
    .update({ is_public: isPublic })
    .eq("id", itineraryId);
  if (error) throw error;
}

export async function deleteItinerary(itineraryId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("itineraries")
    .delete()
    .eq("id", itineraryId);
  if (error) throw error;
}

export interface ItineraryShare {
  share_token: string;
  is_public: boolean;
  show_author_name: boolean;
}

const SHARE_FIELDS = "share_token, is_public, show_author_name";
// Código do Postgres pra violação de unique constraint — usado abaixo pra
// lidar com a corrida rara de duas abas criando o compartilhamento juntas.
const UNIQUE_VIOLATION = "23505";

// Um compartilhamento por roteiro: se já existe, reaproveita (e reativa,
// se preciso); só cria um token novo na primeira vez.
export async function getOrCreateShare(
  itineraryId: string,
  userId: string,
): Promise<ItineraryShare> {
  const supabase = createClient();

  const { data: existing, error: existingError } = await supabase
    .from("shared_itineraries")
    .select(SHARE_FIELDS)
    .eq("itinerary_id", itineraryId)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return existing;

  const shareToken = crypto.randomUUID().replace(/-/g, "");

  const { data: created, error: createError } = await supabase
    .from("shared_itineraries")
    .insert({
      itinerary_id: itineraryId,
      share_token: shareToken,
      created_by: userId,
    })
    .select(SHARE_FIELDS)
    .single();

  if (createError) {
    if (createError.code === UNIQUE_VIOLATION) {
      const { data: retried, error: retryError } = await supabase
        .from("shared_itineraries")
        .select(SHARE_FIELDS)
        .eq("itinerary_id", itineraryId)
        .single();
      if (retryError) throw retryError;
      return retried;
    }
    throw createError;
  }

  return created;
}

export async function setSharePublic(itineraryId: string, isPublic: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("shared_itineraries")
    .update({ is_public: isPublic })
    .eq("itinerary_id", itineraryId);
  if (error) throw error;
}

export async function setShareShowAuthorName(
  itineraryId: string,
  showAuthorName: boolean,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("shared_itineraries")
    .update({ show_author_name: showAuthorName })
    .eq("itinerary_id", itineraryId);
  if (error) throw error;
}
