// Código ISO 3166-1 alpha-2 por slug de país. A bandeira é uma imagem em
// public/flags/<iso>.png (emoji de bandeira não renderiza no Windows: aparece
// só a sigla do país). País novo sem entrada aqui simplesmente fica sem bandeira.
const ISO_BY_COUNTRY_SLUG: Record<string, string> = {
  alemanha: "DE",
  belgica: "BE",
  brasil: "BR",
  chile: "CL",
  "emirados-arabes": "AE",
  espanha: "ES",
  "estados-unidos": "US",
  franca: "FR",
  grecia: "GR",
  holanda: "NL",
  inglaterra: "GB",
  italia: "IT",
  monaco: "MC",
  portugal: "PT",
  suica: "CH",
};

export function countryFlag(slug: string): string | null {
  const iso = ISO_BY_COUNTRY_SLUG[slug];
  return iso ? `/flags/${iso.toLowerCase()}.png` : null;
}
