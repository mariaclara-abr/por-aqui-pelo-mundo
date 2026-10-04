import { SITE_NAME, SITE_URL } from "@/lib/metadata";
import { getPublishedCountries, getTravelTips } from "@/lib/queries";

export const revalidate = 3600;

// Formato llms.txt: resumo do site e links principais para mecanismos de IA.
export async function GET() {
  const [countries, tips] = await Promise.all([getPublishedCountries(), getTravelTips()]);
  const body = `# ${SITE_NAME}

> Plataforma de planejamento de viagens com curadoria humana. Cada atração é visitada e avaliada pessoalmente por Rejane Abrantes (nota de 1 a 5, não é média de usuários). Foco em famílias com crianças e casais. O conteúdo vem de experiência real, não de roteiros genéricos.

## Destinos
${countries.map((c) => `- [${c.name}](${SITE_URL}/${c.slug}): cidades e atrações com curadoria`).join("\n")}

## Dicas de viagem
- [Todas as dicas](${SITE_URL}/dicas-de-viagem): ${tips.length} dicas práticas (documentos, dinheiro, parques, Europa, Dubai)

## Sobre
- [Quem avalia](${SITE_URL}/sobre): autoria e método de curadoria
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
