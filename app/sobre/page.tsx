import PaperFrame from "@/components/PaperFrame";
import type { Metadata } from "next";
import Image from "next/image";
import { getAboutPageContent, getAboutVisitedCountries } from "@/lib/queries";
import { linkify } from "@/components/Linkify";
import { buildOpenGraph } from "@/lib/metadata";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";

export const revalidate = 60;

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
    <main className="flex-1 overflow-x-clip bg-[url('/sobre-autora-background-v2.png')] bg-[length:100%_auto] bg-repeat-y bg-top">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <PaperFrame round className="shrink-0">
            <div className="relative h-44 w-44 overflow-hidden rounded-full bg-branco sm:h-56 sm:w-56">
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
          </PaperFrame>
          <p className="mt-5 text-xs uppercase tracking-widest text-oliva">
            Sobre a autora
          </p>
          <h1 className="mt-2 font-serif text-3xl text-tinta sm:text-4xl">
            {about.author_name}
          </h1>
        </div>

        <div className="mt-10">
          <div className="flex flex-col gap-5 text-left leading-relaxed text-tinta">
            {bioParagraphs.map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">{linkify(paragraph)}</p>
            ))}
          </div>
        </div>

        <PaperFrame className="mt-28">
          <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg bg-branco">
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
        </PaperFrame>

        <div className="">
          <div className="mt-10 flex flex-col gap-5 text-left leading-relaxed text-tinta">
            <h2 className="font-serif text-2xl text-tinta">
              Por que esse site existe
            </h2>
            <p className="whitespace-pre-line">{linkify(about.why_site_text)}</p>
          </div>

          <blockquote className="mt-10 border-l-4 border-terracota pl-5 text-left">
            <p className="font-serif text-xl italic text-tinta whitespace-pre-line sm:text-2xl">
              &ldquo;{linkify(about.quote_text)}&rdquo;
            </p>
          </blockquote>

        </div>

        <PaperFrame flip className="mt-28">
          <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg bg-branco">
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
        </PaperFrame>

        <div className="text-left">
          <div className="mt-10">
            <h2 className="font-serif text-2xl text-tinta">
              Destinos já visitados
            </h2>
            {visitedCountries.length === 0 ? (
              <p className="mt-4 text-oliva">Novos destinos em breve.</p>
            ) : (
              <div className="relative left-1/2 mt-4 w-screen -translate-x-1/2 overflow-hidden bg-terracota py-4">
                <p className="sr-only">
                  {visitedCountries.map((c) => c.name).join(", ")}
                </p>
                <div
                  aria-hidden="true"
                  className="marquee-track marquee-track-slow flex w-max items-center hover:[animation-play-state:paused]"
                >
                  {/* duas metades iguais (a animação anda -50%); cada uma repete a lista para cobrir a largura */}
                  {Array.from({ length: 2 }, (_, half) =>
                    Array.from({ length: 4 }, (_, rep) =>
                      visitedCountries.map((country) => (
                        <span
                          key={`${half}-${rep}-${country.id}`}
                          className="flex items-center"
                        >
                          <span className="whitespace-nowrap font-serif text-xl italic text-areia">
                            {country.name}
                          </span>
                          <span className="px-6 text-sm text-areia/60">•</span>
                        </span>
                      )),
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
