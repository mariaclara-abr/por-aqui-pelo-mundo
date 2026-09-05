import ExpandableText from "@/components/ExpandableText";
import { imagePositionStyle, type ImagePosition } from "@/lib/image-position";

export default function CountryPreview({
  name,
  description,
  coverImageUrl,
  coverImagePosition = null,
  isDraft = false,
}: {
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  coverImagePosition?: ImagePosition | null;
  isDraft?: boolean;
}) {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        {isDraft && (
          <p className="mb-6 rounded-lg bg-terracota/10 px-4 py-3 text-sm text-terracota">
            Este país está marcado como &quot;Em breve&quot;: na home ele
            aparece em preto e branco, e esta página abaixo só fica acessível
            ao público depois que você publicar.
          </p>
        )}
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          {name || "Nome do país"}
        </h1>
        {description ? (
          <ExpandableText
            text={description}
            className="mt-2 max-w-xl text-oliva"
          />
        ) : (
          <p className="mt-2 max-w-xl text-oliva">
            Escolha uma cidade para ver as atrações com curadoria.
          </p>
        )}

        <div className="mt-16 flex flex-col items-center gap-2 rounded-xl border border-dashed border-oliva/30 py-16 text-center">
          <p className="max-w-sm text-sm text-oliva">
            As cidades cadastradas para este país aparecem aqui, na página
            publicada.
          </p>
        </div>

        <section className="relative left-1/2 right-1/2 -mx-[50vw] mt-12 w-screen py-8 sm:py-10">
          {coverImageUrl && (
            <>
              <img
                src={coverImageUrl}
                alt={name || "Nome do país"}
                className="absolute inset-0 h-full w-full object-cover"
                style={imagePositionStyle(coverImagePosition)}
              />
              <div className="absolute inset-0 bg-tinta/60" />
            </>
          )}
          <div
            className={`relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 ${coverImageUrl ? "" : "border-t border-tinta/10 pt-8"}`}
          >
            <h2
              className={`font-serif text-xl ${coverImageUrl ? "text-white drop-shadow-sm" : "text-tinta"}`}
            >
              Perguntas sobre {name || "o país"}
            </h2>
            <p
              className={`mt-4 text-sm ${coverImageUrl ? "text-white/80" : "text-oliva"}`}
            >
              As perguntas dos visitantes aparecem aqui, na página publicada.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
