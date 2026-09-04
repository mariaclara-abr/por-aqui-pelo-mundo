import type { Metadata } from "next";

export const SITE_NAME = "Por Aqui Pelo Mundo";
export const SITE_URL = "https://www.poraquipelomundo.com";

// Imagem de marca gerada em app/opengraph-image.tsx (via next/og). Next só
// aplica esse arquivo automaticamente em rotas que NÃO definem o próprio
// openGraph — qualquer rota que passa por buildOpenGraph já está definindo
// o seu, então precisamos referenciar essa imagem explicitamente aqui para
// não perder o fallback.
const DEFAULT_OG_IMAGE = "/opengraph-image";

/**
 * Monta o bloco openGraph de uma rota já incluindo os campos que deveriam
 * ser "herdados" do layout raiz (siteName, locale, type). Necessário porque
 * o Next.js substitui o openGraph inteiro quando uma rota filha define o
 * seu próprio, em vez de fazer merge com o do layout pai.
 *
 * Sem `images`, cai na imagem de marca padrão do site.
 */
export function buildOpenGraph(fields: {
  title: string;
  description: string;
  images?: string[];
  type?: "website" | "article";
}): NonNullable<Metadata["openGraph"]> {
  return {
    siteName: SITE_NAME,
    locale: "pt_BR",
    type: fields.type ?? "website",
    title: fields.title,
    description: fields.description,
    images: fields.images && fields.images.length > 0 ? fields.images : [DEFAULT_OG_IMAGE],
  };
}

// --- Gramática de país: contração de preposição (na/no/nas/nos, da/do/das/dos) ---
//
// Tabela mantida manualmente. Países novos cadastrados pelo admin que não
// estiverem aqui caem no fallback neutro "em"/"de" (sem artigo) — não é
// tecnicamente incorreto para nenhum caso comum, só não soa tão natural
// quanto a forma com artigo. Adicione o país aqui para ficar perfeito.
type CountryArticle = "a" | "o" | "as" | "os";

const COUNTRY_ARTICLES: Record<string, CountryArticle> = {
  Itália: "a",
  França: "a",
  Grécia: "a",
  "Estados Unidos": "os",
};

const DE_CONTRACTIONS: Record<CountryArticle, string> = {
  a: "da",
  o: "do",
  as: "das",
  os: "dos",
};

/** "da Itália", "dos Estados Unidos", ou "de {País}" se não mapeado. */
export function withDe(countryName: string): string {
  const article = COUNTRY_ARTICLES[countryName];
  return article ? `${DE_CONTRACTIONS[article]} ${countryName}` : `de ${countryName}`;
}

/** "1 cidade" / "3 cidades", com concordância singular/plural. */
export function countLabel(n: number, singular: string, plural: string): string {
  return n === 1 ? `1 ${singular}` : `${n} ${plural}`;
}

/** "A", "A e B", "A, B e C": junção de nomes em português. */
export function joinNames(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} e ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}

/**
 * Corta um texto em até `max` caracteres sem quebrar no meio de uma frase
 * ou palavra: prefere o último "." / "!" / "?" dentro do limite; se não
 * houver nenhum, corta na última palavra completa e fecha com ".".
 * Nunca retorna mais que `max` caracteres.
 */
export function truncateToSentence(text: string, max: number): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;

  const slice = trimmed.slice(0, max);
  const sentenceEnd = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
  );
  if (sentenceEnd > 0) {
    return slice.slice(0, sentenceEnd + 1).trim();
  }

  const wordSlice = trimmed.slice(0, max - 1);
  const lastSpace = wordSlice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? wordSlice.slice(0, lastSpace) : wordSlice;
  return `${cut.trim()}.`;
}
