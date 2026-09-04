import ExpandableText from "@/components/ExpandableText";

export default function StatePreview({
  countryName,
  name,
  description,
  coverImageUrl,
}: {
  countryName: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
}) {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-sm text-oliva">{countryName || "País"}</p>
        <h1 className="font-serif text-3xl text-tinta sm:text-4xl">
          Cidades em {name || "nome do estado"}
        </h1>

        {description && (
          <ExpandableText text={description} className="mt-2 text-oliva" />
        )}

        <div className="mt-16 flex flex-col items-center gap-2 rounded-xl border border-dashed border-oliva/30 py-16 text-center">
          <p className="max-w-sm text-sm text-oliva">
            As cidades cadastradas para este estado aparecem aqui, na página
            publicada.
          </p>
        </div>

        <section className="relative left-1/2 right-1/2 -mx-[50vw] mt-12 w-screen py-8 sm:py-10">
          {coverImageUrl && (
            <>
              <img
                src={coverImageUrl}
                alt={name || "Nome do estado"}
                className="absolute inset-0 h-full w-full object-cover"
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
              {name || "O estado"}
            </h2>
          </div>
        </section>
      </div>
    </main>
  );
}
