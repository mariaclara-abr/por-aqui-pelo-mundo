import Link from "next/link";
import Image from "next/image";

export default function AuthorBand({
  authorName,
  authorPhotoUrl,
}: {
  authorName: string;
  authorPhotoUrl: string | null;
}) {
  return (
    <section className="bg-oliva">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:gap-14 lg:px-10 lg:py-20">
        <div className="flex flex-col justify-center lg:w-3/5">
          <p className="text-xs uppercase tracking-widest text-areia/70">
            Quem está por trás da curadoria
          </p>
          <h2 className="mt-2 font-serif text-3xl text-branco sm:text-4xl">
            {authorName}
          </h2>
          <p className="mt-4 max-w-xl text-left text-sm leading-relaxed text-areia/90 sm:mt-5 sm:text-base">
            Há quase 10 anos, é a responsável por planejar cada detalhe das
            viagens da própria família: passagens, seguro, hospedagem,
            transporte e roteiro dia a dia. Formada em Administração, mãe de
            dois filhos, ela monta roteiros equilibrados para todas as
            idades, testados na prática antes de virarem recomendação aqui no
            site.
          </p>
          <blockquote className="mt-6 max-w-xl border-l-4 border-terracota pl-4">
            <p className="font-serif text-lg italic text-branco sm:text-xl">
              &ldquo;Eu não vendo viagens. Eu ensino você a viajar com
              planejamento e a aproveitar cada minuto do seu destino.&rdquo;
            </p>
          </blockquote>
          <Link
            href="/sobre"
            className="mt-7 inline-flex w-fit items-center gap-1.5 rounded-lg bg-terracota px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
          >
            Saiba mais sobre a autora
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-sm shrink-0 rounded-2xl border border-areia/35 bg-branco/10 p-1.5 shadow-sm sm:p-2 lg:mx-0 lg:w-2/5">
          <span
            aria-hidden="true"
            className="absolute -left-1 -top-1 h-7 w-7 rounded-tl-2xl border-l border-t border-terracota"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-br-2xl border-b border-r border-terracota"
          />

          <div className="relative aspect-[9/10] overflow-hidden rounded-xl border border-branco/70">
            {authorPhotoUrl ? (
              <Image
                src={authorPhotoUrl}
                alt={authorName}
                fill
                sizes="(min-width: 1024px) 40vw, 384px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-oliva/80">
                <span className="font-serif text-sm text-areia/70">
                  Foto em breve
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
