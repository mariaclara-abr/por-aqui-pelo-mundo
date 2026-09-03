import { cache } from "react";
import { supabase } from "@/lib/supabase";
import type { AttractionCategory } from "@/types/database";

export async function getCountries() {
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

// Só os países já publicados: usada em pontos que não devem revelar um país
// "em breve" antes da hora (menu de navegação, sitemap, lista de países
// visitados no perfil). A home usa getCountries() e filtra os dois grupos
// ela mesma, para mostrar os rascunhos como teaser em preto e branco.
export async function getPublishedCountries() {
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("status", "published")
    .order("name");

  if (error) throw error;
  return data;
}

// Envolvidas em React cache(): tanto generateMetadata quanto o page.tsx da
// mesma rota chamam essas funções, e cache() garante que rodem só uma vez
// por request em vez de duas idas ao banco. Só as usadas em Server
// Components — getCitiesByCountry também é chamada por um Client Component
// (NavDrawer), então fica de fora.
export const getCountryBySlug = cache(async (countrySlug: string) => {
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("slug", countrySlug)
    .single();

  if (error) throw error;
  return data;
});

export async function getCountryById(id: string) {
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getCitiesByCountry(countrySlug: string) {
  const { data: country, error: countryError } = await supabase
    .from("countries")
    .select("id")
    .eq("slug", countrySlug)
    .single();

  if (countryError) throw countryError;

  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("country_id", country.id)
    .order("name");

  if (error) throw error;
  return data;
}

export async function getCityCountByCountry(countrySlug: string) {
  const { data: country, error: countryError } = await supabase
    .from("countries")
    .select("id")
    .eq("slug", countrySlug)
    .single();

  if (countryError) throw countryError;

  const { count, error } = await supabase
    .from("cities")
    .select("*", { count: "exact", head: true })
    .eq("country_id", country.id);

  if (error) throw error;
  return count ?? 0;
}

export const getCityBySlug = cache(async (citySlug: string) => {
  const { data, error } = await supabase
    .from("cities")
    .select("*, countries(*)")
    .eq("slug", citySlug)
    .single();

  if (error) throw error;
  return data;
});

export async function getCityById(id: string) {
  const { data, error } = await supabase
    .from("cities")
    .select("*, countries(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getCitiesWithCountry() {
  const { data, error } = await supabase
    .from("cities")
    .select("*, countries(*)")
    .order("name");

  if (error) throw error;
  return data;
}

export interface DestinationPickerCity {
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
}

// Lista enxuta de cidades + país usada pelo seletor de destinos do roteiro
// "do zero" com IA (components/itinerary-ai) — só os campos necessários
// pra montar a lista, sem o resto das colunas de cities/countries.
export async function getDestinationPickerCities(): Promise<
  DestinationPickerCity[]
> {
  const { data, error } = await supabase
    .from("cities")
    .select("slug, name, countries(slug, name)")
    .order("name");

  if (error) throw error;

  return data
    .filter(
      (c): c is typeof c & { countries: { slug: string; name: string } } =>
        c.countries !== null,
    )
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      countrySlug: c.countries.slug,
      countryName: c.countries.name,
    }));
}

export async function getTags() {
  const { data, error } = await supabase.from("tags").select("*").order("name");

  if (error) throw error;
  return data;
}

export interface SearchResult {
  result_type: "country" | "city" | "attraction";
  id: string;
  name: string;
  slug: string;
  city_name: string | null;
  city_slug: string | null;
  country_name: string | null;
  country_slug: string | null;
  rank: number;
}

// Busca tolerante a maiúsculas/minúsculas, acentos e pequenos erros de
// digitação (via pg_trgm), cobrindo países, cidades e atrações. A função
// search_destinations no banco só inclui países "em breve" (draft) quando
// includeDrafts é true, espelhando a regra de visibilidade das páginas de
// país (só a autora vê rascunhos).
export async function searchDestinations(
  query: string,
  includeDrafts = false,
) {
  const trimmed = query.trim();
  if (!trimmed) {
    return [] as SearchResult[];
  }

  const { data, error } = await supabase.rpc("search_destinations", {
    search_query: trimmed,
    include_drafts: includeDrafts,
  });

  if (error) throw error;
  return data as unknown as SearchResult[];
}

export interface AttractionFilters {
  categories?: AttractionCategory[];
  tags?: string[];
}

export async function getAttractionsByCity(
  citySlug: string,
  filters?: AttractionFilters,
) {
  const { data: city, error: cityError } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", citySlug)
    .single();

  if (cityError) throw cityError;

  // Atrações-filha (ex: um restaurante dentro de um parque) não aparecem
  // na grade da cidade, só na página da atração-pai.
  let query = supabase
    .from("attractions")
    .select("*, attraction_photos(*), attraction_tags(tags(*))")
    .eq("city_id", city.id)
    .is("parent_attraction_id", null);

  if (filters?.categories && filters.categories.length > 0) {
    // Retorna atrações que têm pelo menos uma das categorias selecionadas
    // (seleção soma, não restringe a uma categoria só).
    query = query.overlaps("categories", filters.categories);
  }

  if (filters?.tags && filters.tags.length > 0) {
    // Retorna atrações que têm pelo menos uma das tags informadas.
    const { data: tagRows, error: tagsError } = await supabase
      .from("tags")
      .select("id")
      .in("slug", filters.tags);

    if (tagsError) throw tagsError;

    const tagIds = tagRows.map((tag) => tag.id);

    const { data: matches, error: matchesError } = await supabase
      .from("attraction_tags")
      .select("attraction_id")
      .in("tag_id", tagIds);

    if (matchesError) throw matchesError;

    const attractionIds = [
      ...new Set(matches.map((match) => match.attraction_id)),
    ];

    query = query.in("id", attractionIds);
  }

  const { data, error } = await query.order("name");
  if (error) throw error;

  // Atrações "pasta" (com sub-atrações, ex: Parques) sempre aparecem
  // primeiro na grade, como um atalho fixo para esse conteúdo maior.
  const { data: childRows, error: childError } = await supabase
    .from("attractions")
    .select("parent_attraction_id")
    .eq("city_id", city.id)
    .not("parent_attraction_id", "is", null);

  if (childError) throw childError;

  const folderIds = new Set(
    childRows.map((row) => row.parent_attraction_id),
  );

  return [...data].sort((a, b) => {
    // "Parques" sempre vem primeiro, na frente de qualquer outra pasta.
    const aPinned = a.slug === "parques";
    const bPinned = b.slug === "parques";
    if (aPinned !== bPinned) return aPinned ? -1 : 1;

    const aIsFolder = folderIds.has(a.id);
    const bIsFolder = folderIds.has(b.id);
    if (aIsFolder === bIsFolder) return 0;
    return aIsFolder ? -1 : 1;
  });
}

export async function getAttractionNamesByCity(citySlug: string) {
  const { data: city, error: cityError } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", citySlug)
    .single();

  if (cityError) throw cityError;

  const { data, error } = await supabase
    .from("attractions")
    .select("id, name, slug")
    .eq("city_id", city.id)
    .is("parent_attraction_id", null)
    .order("name");

  if (error) throw error;
  return data;
}

export const getAttractionBySlug = cache(async (attractionSlug: string) => {
  const { data, error } = await supabase
    .from("attractions")
    .select(
      "*, attraction_photos(*), attraction_tags(tags(*)), cities(*, countries(*))",
    )
    .eq("slug", attractionSlug)
    .single();

  if (error) throw error;
  return data;
});

// Cadeia de atrações-ancestrais, da mais externa (ex: "Parques") até o pai
// direto, para montar o breadcrumb completo de uma atração aninhada em mais
// de um nível (ex: Orlando > Parques > Magic Kingdom > Satu'li Canteen).
// O limite de 10 níveis é só uma proteção contra um parent_attraction_id
// configurado errado formando um ciclo.
export async function getAttractionAncestors(
  parentAttractionId: string | null,
) {
  const ancestors: { id: string; name: string; slug: string }[] = [];
  let currentId = parentAttractionId;

  for (let depth = 0; currentId && depth < 10; depth++) {
    const { data, error } = await supabase
      .from("attractions")
      .select("id, name, slug, parent_attraction_id")
      .eq("id", currentId)
      .single();

    if (error) throw error;
    ancestors.unshift({ id: data.id, name: data.name, slug: data.slug });
    currentId = data.parent_attraction_id;
  }

  return ancestors;
}

// Sub-atrações de uma atração-pai (ex: os restaurantes e lojas dentro de um
// parque temático). Mesma cidade do pai, sempre.
export async function getChildAttractions(parentAttractionId: string) {
  const { data, error } = await supabase
    .from("attractions")
    .select("*, attraction_photos(*), attraction_tags(tags(*))")
    .eq("parent_attraction_id", parentAttractionId)
    .order("name");

  if (error) throw error;
  return data;
}

// Entre os ids informados, quais têm pelo menos uma sub-atração. Usada para
// decidir se a grade de filhos de uma atração-pasta mostra cards de destino
// (ex: os parques dentro de Parques, que por sua vez têm suas próprias
// sub-atrações) ou cards de atração comuns (ex: os restaurantes dentro de
// um parque, que não têm mais nada dentro).
export async function getAttractionIdsWithChildren(parentIds: string[]) {
  if (parentIds.length === 0) return new Set<string>();

  const { data, error } = await supabase
    .from("attractions")
    .select("parent_attraction_id")
    .in("parent_attraction_id", parentIds);

  if (error) throw error;
  return new Set(
    data
      .map((row) => row.parent_attraction_id)
      .filter((id): id is string => id !== null),
  );
}

export async function getAttractionById(id: string) {
  const { data, error } = await supabase
    .from("attractions")
    .select(
      "*, attraction_photos(*), attraction_tags(tags(*)), cities(*, countries(*))",
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getAllAttractions() {
  const { data, error } = await supabase
    .from("attractions")
    .select("*, attraction_photos(*), cities(*, countries(*))")
    .order("name");

  if (error) throw error;
  return data;
}

export async function getAttractionsSummaryByIds(ids: string[]) {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("attractions")
    .select(
      "id, name, slug, categories, curation_rating, latitude, longitude, attraction_photos(url, order), cities(slug, countries(slug))",
    )
    .in("id", ids);

  if (error) throw error;
  return data;
}

export async function getCounts() {
  const [countries, cities, attractions] = await Promise.all([
    supabase.from("countries").select("*", { count: "exact", head: true }),
    supabase.from("cities").select("*", { count: "exact", head: true }),
    supabase.from("attractions").select("*", { count: "exact", head: true }),
  ]);

  if (countries.error) throw countries.error;
  if (cities.error) throw cities.error;
  if (attractions.error) throw attractions.error;

  return {
    countries: countries.count ?? 0,
    cities: cities.count ?? 0,
    attractions: attractions.count ?? 0,
  };
}

export const getAboutPageContent = cache(async () => {
  const { data, error } = await supabase
    .from("about_page_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;
  return data;
});

export async function getAboutVisitedCountries() {
  const { data, error } = await supabase
    .from("about_visited_countries")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

export interface SiteReviewWithProfile {
  id: string;
  rating: number;
  comment: string;
  order: number;
  createdAt: string;
  reviewerName: string;
  reviewerUsername: string | null;
  reviewerAvatarUrl: string | null;
}

export async function getSiteReviews(): Promise<SiteReviewWithProfile[]> {
  const { data, error } = await supabase
    .from("site_reviews")
    .select("*")
    .order("order")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const userIds = [
    ...new Set(
      data
        .map((review) => review.user_id)
        .filter((id): id is string => id !== null),
    ),
  ];

  const { data: profiles, error: profilesError } =
    userIds.length === 0
      ? { data: [], error: null }
      : await supabase
          .from("public_profiles")
          .select("*")
          .in("id", userIds);

  if (profilesError) throw profilesError;
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  return data.map((review) => {
    const profile = review.user_id ? profileById.get(review.user_id) : undefined;
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      order: review.order,
      createdAt: review.created_at,
      reviewerName: profile?.display_name || profile?.username || review.reviewer_name,
      reviewerUsername: profile?.username ?? null,
      reviewerAvatarUrl: profile?.avatar_url ?? null,
    };
  });
}

export async function getTravelTips() {
  const { data, error } = await supabase
    .from("travel_tips")
    .select("*")
    .order("order")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

