import { supabase } from "@/lib/supabase";
import type { AttractionCategory } from "@/types/database";

const EARTH_RADIUS_KM = 6371;
const NEARBY_RADIUS_KM = 20;
const DEFAULT_LIMIT = 6;
const NEARBY_CITIES_LIMIT = 4;
const NEARBY_CITIES_MAX_DISTANCE_KM = 1000;
const WALK_SPEED_KMH = 4.5;

const ALL_CATEGORIES: AttractionCategory[] = [
  "ponto_turistico",
  "restaurante",
  "hotel",
  "museu",
  "natureza",
  "compras",
  "passeio",
  "cafe",
  "estacionamentos",
  "outro",
];

export interface RecommendedAttraction {
  id: string;
  name: string;
  slug: string;
  category: AttractionCategory;
  curationRating: number;
  latitude: number | null;
  longitude: number | null;
  coverPhotoUrl: string | null;
  citySlug: string;
  cityName: string;
  countrySlug: string;
  distanceKm: number | null;
}

export interface RecommendedCity {
  slug: string;
  name: string;
  countrySlug: string;
  coverImageUrl: string | null;
  distanceKm: number | null;
}

export interface AttractionRecommendations {
  nearbyAttractions: RecommendedAttraction[];
  nearbyCities: RecommendedCity[];
}

interface GeoReference {
  latitude: number | null;
  longitude: number | null;
  citySlug: string | null;
}

interface GeoIndexRow {
  id: string;
  name: string;
  slug: string;
  category: AttractionCategory;
  curationRating: number;
  latitude: number | null;
  longitude: number | null;
  coverPhotoUrl: string | null;
  citySlug: string;
  cityName: string;
  countrySlug: string;
  cityCoverImageUrl: string | null;
  cityLatitude: number | null;
  cityLongitude: number | null;
}

export function haversineDistanceKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(h));
}

export function estimateWalkMinutes(distanceKm: number) {
  return Math.max(1, Math.round((distanceKm / WALK_SPEED_KMH) * 60));
}

export function formatDistanceKm(distanceKm: number) {
  return distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} m`
    : `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
}

// Busca todas as atrações com localização geográfica e dados de cidade/país.
// Base compartilhada por todas as recomendações (atração, cidade e roteiro),
// já que o cálculo de proximidade é sempre feito em memória a partir dela.
export async function getAttractionsGeoIndex(): Promise<GeoIndexRow[]> {
  const { data, error } = await supabase
    .from("attractions")
    .select(
      "id, name, slug, category, curation_rating, latitude, longitude, attraction_photos(url, order), cities(name, slug, cover_image_url, latitude, longitude, countries(slug))",
    );

  if (error) throw error;

  return data
    .filter((row) => row.cities?.countries)
    .map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      category: row.category,
      curationRating: row.curation_rating,
      latitude: row.latitude,
      longitude: row.longitude,
      coverPhotoUrl:
        [...row.attraction_photos].sort((a, b) => a.order - b.order)[0]
          ?.url ?? null,
      citySlug: row.cities!.slug,
      cityName: row.cities!.name,
      countrySlug: row.cities!.countries!.slug,
      cityCoverImageUrl: row.cities!.cover_image_url,
      cityLatitude: row.cities!.latitude,
      cityLongitude: row.cities!.longitude,
    }));
}

// Ordena por proximidade (atrações sem coordenadas ficam por último,
// desempatando por nota de curadoria).
function rankAttractionsByCategory(
  index: GeoIndexRow[],
  reference: GeoReference,
  categories: AttractionCategory[],
  excludeIds: Set<string>,
  limit: number,
): RecommendedAttraction[] {
  const hasCoords = reference.latitude !== null && reference.longitude !== null;

  return index
    .filter((item) => categories.includes(item.category) && !excludeIds.has(item.id))
    .map((item) => ({
      item,
      distanceKm:
        hasCoords && item.latitude !== null && item.longitude !== null
          ? haversineDistanceKm(
              { latitude: reference.latitude as number, longitude: reference.longitude as number },
              { latitude: item.latitude, longitude: item.longitude },
            )
          : null,
    }))
    .filter(({ item, distanceKm }) =>
      hasCoords ? distanceKm !== null && distanceKm <= NEARBY_RADIUS_KM : item.citySlug === reference.citySlug,
    )
    .sort((a, b) => {
      if (a.distanceKm === null && b.distanceKm === null) {
        return b.item.curationRating - a.item.curationRating;
      }
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
      return b.item.curationRating - a.item.curationRating;
    })
    .slice(0, limit)
    .map(({ item, distanceKm }) => ({ ...item, distanceKm }));
}

// Preferência: coordenadas próprias da cidade (quando cadastradas) sobre o
// centroide das atrações, já que a cidade pode ter atrações sem lat/lng ainda.
function computeCityCentroid(index: GeoIndexRow[], citySlug: string) {
  const cityRow = index.find(
    (item) => item.citySlug === citySlug && item.cityLatitude !== null && item.cityLongitude !== null,
  );
  if (cityRow) {
    return { latitude: cityRow.cityLatitude as number, longitude: cityRow.cityLongitude as number };
  }

  const points = index.filter(
    (item) => item.citySlug === citySlug && item.latitude !== null && item.longitude !== null,
  );
  if (points.length === 0) return null;

  const sum = points.reduce(
    (acc, item) => ({
      lat: acc.lat + (item.latitude as number),
      lng: acc.lng + (item.longitude as number),
    }),
    { lat: 0, lng: 0 },
  );
  return { latitude: sum.lat / points.length, longitude: sum.lng / points.length };
}

function rankNearbyCities(
  index: GeoIndexRow[],
  reference: GeoReference,
  excludeCitySlug: string | null,
  limit: number,
): RecommendedCity[] {
  // Sem coordenadas de referência (nem a atração, nem nenhuma atração da
  // cidade atual têm lat/lng cadastrados) não há como saber o que é
  // realmente próximo — melhor não sugerir nada do que "adivinhar".
  if (reference.latitude === null || reference.longitude === null) return [];

  const centroids = new Map<
    string,
    {
      name: string;
      countrySlug: string;
      coverImageUrl: string | null;
      cityLatitude: number | null;
      cityLongitude: number | null;
      lat: number;
      lng: number;
      count: number;
    }
  >();

  for (const item of index) {
    if (!item.citySlug || item.citySlug === excludeCitySlug) continue;

    const entry = centroids.get(item.citySlug);
    if (entry) {
      if (item.latitude !== null && item.longitude !== null) {
        entry.lat += item.latitude;
        entry.lng += item.longitude;
        entry.count += 1;
      }
    } else {
      centroids.set(item.citySlug, {
        name: item.cityName,
        countrySlug: item.countrySlug,
        coverImageUrl: item.cityCoverImageUrl,
        cityLatitude: item.cityLatitude,
        cityLongitude: item.cityLongitude,
        lat: item.latitude ?? 0,
        lng: item.longitude ?? 0,
        count: item.latitude !== null && item.longitude !== null ? 1 : 0,
      });
    }
  }

  const referencePoint = { latitude: reference.latitude, longitude: reference.longitude };

  const cities: RecommendedCity[] = Array.from(centroids.entries())
    // Cidade só entra na comparação se tiver coordenadas próprias ou pelo
    // menos uma atração com lat/lng — sem isso não há ponto para calcular distância.
    .filter(([, entry]) => (entry.cityLatitude !== null && entry.cityLongitude !== null) || entry.count > 0)
    .map(([slug, entry]) => {
      const point =
        entry.cityLatitude !== null && entry.cityLongitude !== null
          ? { latitude: entry.cityLatitude, longitude: entry.cityLongitude }
          : { latitude: entry.lat / entry.count, longitude: entry.lng / entry.count };

      return {
        slug,
        name: entry.name,
        countrySlug: entry.countrySlug,
        coverImageUrl: entry.coverImageUrl,
        distanceKm: haversineDistanceKm(referencePoint, point),
      };
    })
    // Cidades muito distantes (ex: outro continente) não contam como "próximas",
    // mesmo que estejam no mesmo roteiro.
    .filter((city) => (city.distanceKm as number) <= NEARBY_CITIES_MAX_DISTANCE_KM);

  cities.sort((a, b) => (a.distanceKm as number) - (b.distanceKm as number));

  return cities.slice(0, limit);
}

// Junta todas as categorias em uma única lista ordenada por proximidade
// (mesma lógica usada em "Atrações próximas" do /meu-roteiro), em vez de
// separar por restaurante/hotel/passeio/estacionamento.
function buildRecommendations(
  index: GeoIndexRow[],
  reference: GeoReference,
  excludeIds: Set<string>,
  limit: number,
): AttractionRecommendations {
  return {
    nearbyAttractions: rankAttractionsByCategory(index, reference, ALL_CATEGORIES, excludeIds, limit),
    nearbyCities: rankNearbyCities(index, reference, reference.citySlug, NEARBY_CITIES_LIMIT),
  };
}

// Recomendações a partir de uma atração específica: prioriza proximidade
// geográfica (raio de ~20km); quando a atração não tem coordenadas
// cadastradas, cai para "mesma cidade" como aproximação.
export async function getAttractionRecommendations(
  attraction: { id: string; citySlug: string; latitude: number | null; longitude: number | null },
  options?: { excludeAttractionIds?: string[]; limit?: number },
): Promise<AttractionRecommendations> {
  const index = await getAttractionsGeoIndex();
  const excludeIds = new Set([attraction.id, ...(options?.excludeAttractionIds ?? [])]);
  const reference: GeoReference = {
    latitude: attraction.latitude,
    longitude: attraction.longitude,
    citySlug: attraction.citySlug,
  };

  return buildRecommendations(index, reference, excludeIds, options?.limit ?? DEFAULT_LIMIT);
}

// Cidades próximas a partir do centroide das atrações já cadastradas na
// cidade de referência (cidades não têm coordenadas próprias no banco).
export async function getNearbyCities(
  citySlug: string,
  limit = NEARBY_CITIES_LIMIT,
): Promise<RecommendedCity[]> {
  const index = await getAttractionsGeoIndex();
  const centroid = computeCityCentroid(index, citySlug);
  return rankNearbyCities(
    index,
    { latitude: centroid?.latitude ?? null, longitude: centroid?.longitude ?? null, citySlug },
    citySlug,
    limit,
  );
}

// Recomendações para a página /meu-roteiro: usa o centroide das atrações já
// adicionadas (com coordenadas) como ponto de referência, e a cidade mais
// frequente entre os itens como aproximação quando não há coordenadas.
export async function getItineraryRecommendations(
  items: { id: string; citySlug: string; latitude: number | null; longitude: number | null }[],
  options?: { limit?: number },
): Promise<AttractionRecommendations> {
  const index = await getAttractionsGeoIndex();
  const excludeIds = new Set(items.map((item) => item.id));

  const withCoords = items.filter((item) => item.latitude !== null && item.longitude !== null);
  const latitude =
    withCoords.length > 0
      ? withCoords.reduce((sum, item) => sum + (item.latitude as number), 0) / withCoords.length
      : null;
  const longitude =
    withCoords.length > 0
      ? withCoords.reduce((sum, item) => sum + (item.longitude as number), 0) / withCoords.length
      : null;

  const cityCounts = new Map<string, number>();
  for (const item of items) {
    cityCounts.set(item.citySlug, (cityCounts.get(item.citySlug) ?? 0) + 1);
  }
  let citySlug: string | null = null;
  let topCount = 0;
  for (const [slug, count] of cityCounts) {
    if (count > topCount) {
      topCount = count;
      citySlug = slug;
    }
  }

  const reference: GeoReference = { latitude, longitude, citySlug };

  return buildRecommendations(index, reference, excludeIds, options?.limit ?? DEFAULT_LIMIT);
}
