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

export async function getTags() {
  const { data, error } = await supabase.from("tags").select("*").order("name");

  if (error) throw error;
  return data;
}

export async function searchDestinations(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return { countries: [], cities: [] };
  }

  const [countriesResult, citiesResult] = await Promise.all([
    supabase
      .from("countries")
      .select("id, name, slug")
      .ilike("name", `%${trimmed}%`)
      .order("name")
      .limit(5),
    supabase
      .from("cities")
      .select("id, name, slug, countries(name, slug)")
      .ilike("name", `%${trimmed}%`)
      .order("name")
      .limit(5),
  ]);

  if (countriesResult.error) throw countriesResult.error;
  if (citiesResult.error) throw citiesResult.error;

  return { countries: countriesResult.data, cities: citiesResult.data };
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

  let query = supabase
    .from("attractions")
    .select("*, attraction_photos(*), attraction_tags(tags(*))")
    .eq("city_id", city.id);

  if (filters?.categories && filters.categories.length > 0) {
    // Retorna atrações que se enquadram em qualquer uma das categorias
    // selecionadas (seleção soma, não restringe a uma categoria só).
    query = query.in("category", filters.categories);
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
  return data;
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
      "id, name, slug, category, curation_rating, latitude, longitude, attraction_photos(url, order), cities(slug, countries(slug))",
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

export async function getSiteReviews() {
  const { data, error } = await supabase
    .from("site_reviews")
    .select("*")
    .order("order")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

