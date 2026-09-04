import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import {
  getAttractionNamesByCity,
  getCitiesByCountry,
  getPublishedCountries,
  getStatesByCountry,
} from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getPublishedCountries();
  const destinations = await Promise.all(
    countries.map(async (country) => {
      const [states, cities] = await Promise.all([
        getStatesByCountry(country.slug),
        getCitiesByCountry(country.slug),
      ]);
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
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ]),
    ]),
  ];
}
