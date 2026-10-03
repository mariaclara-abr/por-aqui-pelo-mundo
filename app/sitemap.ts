import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import {
  getAttractionNamesByCity,
  getCitiesByCountry,
  getPublishedCountries,
  getStatesByCountry,
  getTravelTips,
} from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [countries, tips] = await Promise.all([
    getPublishedCountries(),
    getTravelTips(),
  ]);
  const destinations = await Promise.all(
    countries.map(async (country) => {
      const [states, allCities] = await Promise.all([
        getStatesByCountry(country.slug),
        getCitiesByCountry(country.slug),
      ]);
      const cities = allCities.filter((city) => city.status === "published");
      const citiesWithAttractions = await Promise.all(
        cities.map(async (city) => ({
          city,
          attractions: await getAttractionNamesByCity(city.slug),
        })),
      );
      return { country, states, cities: citiesWithAttractions };
    }),
  );

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/dicas-de-viagem`, changeFrequency: "weekly", priority: 0.8 },
    ...tips.map((tip) => ({
      url: `${SITE_URL}/dicas-de-viagem/${tip.slug}`,
      lastModified: tip.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/privacidade`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/termos`, changeFrequency: "yearly", priority: 0.3 },
    ...destinations.flatMap(({ country, states, cities }) => [
      {
        url: `${SITE_URL}/${country.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      // Estados (ex: Brasil) usam a mesma rota das cidades, um nível acima.
      ...states.map((state) => ({
        url: `${SITE_URL}/${country.slug}/${state.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
      ...cities.flatMap(({ city, attractions }) => [
        {
          url: `${SITE_URL}/${country.slug}/${city.slug}`,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        },
        ...attractions.map((attraction) => ({
          url: `${SITE_URL}/${country.slug}/${city.slug}/${attraction.slug}`,
          lastModified: attraction.updated_at,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ]),
    ]),
  ];
}
