import CurationRating, { RATING_LABELS } from "@/components/CurationRating";
import { linkify } from "@/components/Linkify";
import { imagePositionStyle, type ImagePosition } from "@/lib/image-position";

export default function AboutPreview({
  authorName,
  authorPhotoUrl,
  authorPhotoPosition = null,
  bio,
  whySiteText,
  quoteText,
  travelPhoto1Url,
  travelPhoto1Position = null,
  travelPhoto2Url,
  travelPhoto2Position = null,
}: {
  authorName: string;
  authorPhotoUrl: string | null;
  authorPhotoPosition?: ImagePosition | null;
  bio: string;
  whySiteText: string;
  quoteText: string;
  travelPhoto1Url: string | null;
  travelPhoto1Position?: ImagePosition | null;
  travelPhoto2Url: string | null;
  travelPhoto2Position?: ImagePosition | null;
}) {
  const bioParagraphs = bio
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <div className="h-44 w-44 shrink-0 overflow-hidden rounded-full border-4 border-branco bg-branco shadow-sm sm:h-56 sm:w-56">
            {authorPhotoUrl ? (
              <img
                src={authorPhotoUrl}
                alt={authorName}
                className="h-full w-full object-cover"
                style={imagePositionStyle(authorPhotoPosition)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-serif text-sm text-oliva">
                  Foto em breve
                </span>
              </div>
            )}
          </div>
          <p className="mt-5 text-xs uppercase tracking-widest text-oliva">
            Sobre a autora
          </p>
          <h1 className="mt-2 font-serif text-3xl text-tinta sm:text-4xl">
            {authorName || "Nome da autora"}
          </h1>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="flex flex-col gap-5 text-left leading-relaxed text-tinta">
            {bioParagraphs.map((paragraph, index) => (
              <p key={index}>{linkify(paragraph)}</p>
            ))}
          </div>
        </div>

        <div className="mt-10 flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-branco">
          {travelPhoto1Url ? (
            <img
              src={travelPhoto1Url}
              alt={`Foto de viagem de ${authorName}`}
              className="h-full w-full rounded-xl object-cover"
              style={imagePositionStyle(travelPhoto1Position)}
            />
          ) : (
            <span className="text-sm text-oliva">Foto de viagem em breve</span>
          )}
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mt-10 flex flex-col gap-5 text-left leading-relaxed text-tinta">
            <h2 className="font-serif text-2xl text-tinta">
              Por que esse site existe
            </h2>
            <p>{linkify(whySiteText)}</p>
          </div>

          <blockquote className="mt-10 border-l-4 border-terracota pl-5 text-left">
            <p className="font-serif text-xl italic text-tinta sm:text-2xl">
              &ldquo;{linkify(quoteText)}&rdquo;
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

        <div className="mt-10 flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-branco">
          {travelPhoto2Url ? (
            <img
              src={travelPhoto2Url}
              alt={`Foto de viagem de ${authorName}`}
              className="h-full w-full rounded-xl object-cover"
              style={imagePositionStyle(travelPhoto2Position)}
            />
          ) : (
            <span className="text-sm text-oliva">Foto de viagem em breve</span>
          )}
        </div>

        <div className="mx-auto max-w-2xl text-left">
          <div className="mt-10">
            <h2 className="font-serif text-2xl text-tinta">
              Destinos já visitados
            </h2>
            <p className="mt-2 text-oliva">
              Editados na seção &ldquo;Destinos já visitados&rdquo;, abaixo
              deste formulário. Não fazem parte desta prévia.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
