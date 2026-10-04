import { joinNames } from "@/lib/metadata";

type FaqAttraction = {
  name: string;
  status: string;
  attraction_tags: { tags: { slug: string } | null }[];
};

const FAQ_BY_TAG = [
  { slug: "imperdivel", q: (c: string) => `Quais são as atrações imperdíveis em ${c}?` },
  { slug: "ideal_para_familias", q: (c: string) => `O que fazer em ${c} com a família e crianças?` },
  { slug: "gratuito", q: (c: string) => `Quais atrações gratuitas visitar em ${c}?` },
];

/** Perguntas respondidas só com atrações já cadastradas e etiquetadas (nunca inventadas). */
export function buildCityFaq(cityName: string, attractions: FaqAttraction[]) {
  const published = attractions.filter((a) => a.status === "published");
  return FAQ_BY_TAG.flatMap(({ slug, q }) => {
    const names = published
      .filter((a) => a.attraction_tags.some((t) => t.tags?.slug === slug))
      .map((a) => a.name);
    return names.length > 0
      ? [{ question: q(cityName), answer: `${joinNames(names)}.` }]
      : [];
  });
}
