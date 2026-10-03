import { SITE_NAME, SITE_URL } from "@/lib/metadata";
import type { AttractionCategory } from "@/types/database";

type Json = Record<string, unknown>;

/** Renderiza um bloco JSON-LD. O `<` é escapado para o conteúdo não fechar a tag <script>. */
export default function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Trilha de navegação; `path` relativo ao site (ex: "/italia"). O item atual não precisa de path. */
export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Restaurante e café viram Restaurant/CafeOrCoffeeShop; o resto é TouristAttraction. */
export function attractionLd(a: {
  name: string;
  description?: string | null;
  url: string;
  image?: string;
  categories: AttractionCategory[];
  latitude: number | null;
  longitude: number | null;
  updatedAt: string;
}): Json {
  const type = a.categories.includes("restaurante")
    ? "Restaurant"
    : a.categories.includes("cafe")
      ? "CafeOrCoffeeShop"
      : "TouristAttraction";
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: a.name,
    url: `${SITE_URL}${a.url}`,
    dateModified: a.updatedAt,
    ...(a.description && { description: a.description }),
    ...(a.image && { image: a.image }),
    ...(a.latitude != null &&
      a.longitude != null && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: a.latitude,
          longitude: a.longitude,
        },
      }),
  };
}

export function articleLd(t: { title: string; description: string; path: string; createdAt: string; updatedAt: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.title,
    description: t.description,
    datePublished: t.createdAt,
    dateModified: t.updatedAt,
    mainEntityOfPage: `${SITE_URL}${t.path}`,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/**
 * QAPage exige uma única pergunta por página; as nossas listam várias, então
 * marcamos a primeira respondida. Sem pergunta respondida, retorna null.
 * ponytail: se quiser todas, trocar por FAQPage (Google restringe o rich result).
 */
export function qaPageLd(
  questions: {
    question: string;
    createdAt: string;
    answer: { answer: string; createdAt: string; author: { displayName: string } } | null;
  }[],
  path: string,
): Json | null {
  const q = questions.find((x) => x.answer);
  if (!q?.answer) return null;
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    url: `${SITE_URL}${path}`,
    mainEntity: {
      "@type": "Question",
      name: q.question,
      text: q.question,
      answerCount: 1,
      dateCreated: q.createdAt,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer.answer,
        dateCreated: q.answer.createdAt,
        author: { "@type": "Person", name: q.answer.author.displayName },
      },
    },
  };
}
