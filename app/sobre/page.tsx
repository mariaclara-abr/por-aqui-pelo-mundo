import type { Metadata } from "next";
import { getAboutPageContent, getCountries } from "@/lib/queries";
import CurationRating, { RATING_LABELS } from "@/components/CurationRating";
import { buildOpenGraph } from "@/lib/metadata";

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

  const description = `${authorName} é mãe, avó e viajante há mais de 20 anos. Conheça quem visita e avalia pessoalmente cada atração recomendada aqui.`;

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
  const [countries, about] = await Promise.all([
    getCountries(),
    getAboutPageContent(),
  ]);

  const bioParagraphs = about.bio
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="flex-1">
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-branco sm:aspect-[21/9]">
        {about.author_photo_url ? (
          <img
            src={about.author_photo_url}
            alt={about.author_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-serif text-lg text-oliva">
            Foto da autora em breve
          </span>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <p className="text-xs uppercase tracking-widest text-oliva">
          Sobre a autora
        </p>
        <h1 className="mt-2 font-serif text-3xl text-tinta sm:text-4xl">
          {about.author_name}
        </h1>

        <div className="mt-8 flex flex-col gap-5 leading-relaxed text-tinta">
          {bioParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-branco">
          {about.travel_photo_1_url ? (
            <img
              src={about.travel_photo_1_url}
              alt=""
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <span className="text-sm text-oliva">Foto de viagem em breve</span>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-5 leading-relaxed text-tinta">
          <h2 className="font-serif text-2xl text-tinta">
            Por que esse site existe
          </h2>
          <p>{about.why_site_text}</p>
        </div>

        <blockquote className="mt-10 border-l-4 border-terracota pl-5">
          <p className="font-serif text-xl italic text-tinta sm:text-2xl">
            &ldquo;{about.quote_text}&rdquo;
          </p>
        </blockquote>

        <div className="mt-10 flex flex-col gap-5 leading-relaxed text-tinta">
          <h2 className="font-serif text-2xl text-tinta">
            Como funciona a nota da curadoria
          </h2>
          <p>
            Cada atração recebe de 1 a 5 estrelas — mas não é uma média de
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

        <div className="mt-10 flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-branco">
          {about.travel_photo_2_url ? (
            <img
              src={about.travel_photo_2_url}
              alt=""
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <span className="text-sm text-oliva">Foto de viagem em breve</span>
          )}
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-2xl text-tinta">
            Destinos já visitados
          </h2>
          <p className="mt-2 text-oliva">
            Alguns dos lugares já cobertos pela curadoria.
          </p>
          {countries.length === 0 ? (
            <p className="mt-4 text-oliva">Novos destinos em breve.</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {countries.map((country) => (
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
    </main>
  );
}
