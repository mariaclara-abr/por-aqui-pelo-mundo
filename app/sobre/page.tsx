import type { Metadata } from "next";
import Image from "next/image";
import { getAboutPageContent, getAboutVisitedCountries } from "@/lib/queries";
import CurationRating, { RATING_LABELS } from "@/components/CurationRating";
import { linkify } from "@/components/Linkify";
import { buildOpenGraph } from "@/lib/metadata";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";

const TITLE = "Sobre a autora";

// O campo author_name no banco ainda está com o placeholder "[Nome da
// autora]" (visível na página, fora do escopo desta tarefa). Para a meta
// description usamos o nome real por instrução explícita, sem alterar o
// texto exibido na interface.
const AUTHOR_NAME_FALLBACK = "Rejane Abrantes";
const PLACEHOLDER_NAME = "[Nome da autora]";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPageContent();
  const authorName =
    about.author_name && about.author_name !== PLACEHOLDER_NAME
      ? about.author_name
      : AUTHOR_NAME_FALLBACK;

  const description = `${authorName} é mãe e viajante há quase 10 anos. Conheça quem visita e avalia pessoalmente cada atração recomendada aqui.`;

  const image = about.author_photo_url ?? about.travel_photo_1_url ?? undefined;

  return {
    title: TITLE,
    description,
    alternates: { canonical: "/sobre" },
    openGraph: buildOpenGraph({
      title: TITLE,
      description,
      images: image ? [image] : undefined,
    }),
  };
}

export default async function SobrePage() {
  const [visitedCountries, about] = await Promise.all([
    getAboutVisitedCountries(),
    getAboutPageContent(),
  ]);

  const bioParagraphs = about.bio
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="flex-1 bg-[url('/sobre-autora-background-v2.png')] bg-[length:100%_auto] bg-repeat-y bg-top">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <div className="shrink-0 rounded-full border border-oliva/20 bg-branco/70 p-1.5 shadow-sm">
            <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-branco bg-branco sm:h-56 sm:w-56">
              {about.author_photo_url ? (
                <Image
                  src={about.author_photo_url}
                  alt={about.author_name}
                  fill
                  sizes="224px"
                  className="object-cover"
                  style={imagePositionStyle(parseImagePosition(about.author_photo_position))}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-serif text-sm text-oliva">
                    Foto em breve
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className="mt-5 text-xs uppercase tracking-widest text-oliva">
            Sobre a autora
          </p>
          <h1 className="mt-2 font-serif text-3xl text-tinta sm:text-4xl">
            {about.author_name}
          </h1>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="flex flex-col gap-5 text-left leading-relaxed text-tinta">
            {bioParagraphs.map((paragraph, index) => (
              <p key={index}>{linkify(paragraph)}</p>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-oliva/20 bg-branco/70 p-2 shadow-sm sm:p-3">
          <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-branco">
            {about.travel_photo_1_url ? (
              <Image
                src={about.travel_photo_1_url}
                alt={`Foto de viagem de ${about.author_name}`}
                fill
                sizes="(min-width: 1024px) 1128px, 96vw"
                className="object-cover"
                style={imagePositionStyle(parseImagePosition(about.travel_photo_1_position))}
              />
            ) : (
              <span className="text-sm text-oliva">Foto de viagem em breve</span>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mt-10 flex flex-col gap-5 text-left leading-relaxed text-tinta">
            <h2 className="font-serif text-2xl text-tinta">
              Por que esse site existe
            </h2>
            <p>{linkify(about.why_site_text)}</p>
          </div>

          <blockquote className="mt-10 border-l-4 border-terracota pl-5 text-left">
            <p className="font-serif text-xl italic text-tinta sm:text-2xl">
              &ldquo;{linkify(about.quote_text)}&rdquo;
            </p>
          </blockquote>

          <div className="mt-10 flex flex-col gap-5 text-left leading-relaxed text-tinta">
            <h2 className="font-serif text-2xl text-tinta">
              Como funciona a nota da curadoria
            </h2>
            <p>
              Cada atração recebe de 1 a 5 estrelas, mas não é uma média de
              avaliações de usuários, e sim minha opinião pessoal sobre o
              lugar, com base na experiência de quem realmente esteve lá.
            </p>
            <div className="flex flex-col gap-4 rounded-xl bg-branco p-5">
              {[5, 4, 3, 2, 1].map((value) => (
                <div key={value} className="flex items-center gap-3">
                  <CurationRating rating={value} showLabel={false} size="sm" />
                  <span className="text-sm text-tinta">
                    {RATING_LABELS[value]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-oliva/20 bg-branco/70 p-2 shadow-sm sm:p-3">
          <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-branco">
            {about.travel_photo_2_url ? (
              <Image
                src={about.travel_photo_2_url}
                alt={`Foto de viagem de ${about.author_name}`}
                fill
                sizes="(min-width: 1024px) 1128px, 96vw"
                className="object-cover"
                style={imagePositionStyle(parseImagePosition(about.travel_photo_2_position))}
              />
            ) : (
              <span className="text-sm text-oliva">Foto de viagem em breve</span>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-2xl text-left">
          <div className="mt-10">
            <h2 className="font-serif text-2xl text-tinta">
              Destinos já visitados
            </h2>
            {visitedCountries.length === 0 ? (
              <p className="mt-4 text-oliva">Novos destinos em breve.</p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {visitedCountries.map((country) => (
                  <span
                    key={country.id}
                    className="rounded-full border border-oliva/30 px-4 py-1.5 text-sm text-oliva"
                  >
                    {country.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
