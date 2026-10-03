import { getCitiesWithCountry, getPublishedCountries } from "@/lib/queries";

export interface TipDestination {
  href: string;
  name: string;
}

const norm = (t: string) =>
  t.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// Destinos publicados citados no texto de cada dica (nome inteiro, sem
// acento/caixa). Retorna { [tip.id]: destinos }.
export async function getTipDestinations(
  tips: { id: string; title: string; content: string }[],
) {
  const [countries, cities] = await Promise.all([
    getPublishedCountries(),
    getCitiesWithCountry(),
  ]);
  const published = new Set(countries.map((c) => c.slug));
  const candidates = [
    ...countries.map((c) => ({ href: `/${c.slug}`, name: c.name })),
    ...cities
      .filter((c) => c.countries && published.has(c.countries.slug))
      .map((c) => ({ href: `/${c.countries!.slug}/${c.slug}`, name: c.name })),
  ].map((d) => ({
    ...d,
    re: new RegExp(
      `(?<![a-z0-9])${norm(d.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9])`,
    ),
  }));

  return Object.fromEntries(
    tips.map((tip) => {
      const text = norm(`${tip.title} ${tip.content}`);
      return [
        tip.id,
        candidates
          .filter((d) => d.re.test(text))
          .map(({ href, name }) => ({ href, name })),
      ];
    }),
  ) as Record<string, TipDestination[]>;
}
