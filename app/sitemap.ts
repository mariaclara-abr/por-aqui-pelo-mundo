import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import {
  getAttractionNamesByCity,
  getCitiesByCountry,
  getPublishedCountries,
} from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getPublishedCountries();
  const destinations = await Promise.all(
    countries.map(async (country) => {
      const cities = await getCitiesByCountry(country.slug);
      const citiesWithAttractions = await Promise.all(
        cities.map(async (city) => ({
          city,
          attractions: await getAttractionNamesByCity(city.slug),
        })),
      );
      return { country, cities: citiesWithAttractions };
    }),
  );

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.7 },
    ...destinations.flatMap(({ country, cities }) => [
      {
        url: `${SITE_URL}/${country.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
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
