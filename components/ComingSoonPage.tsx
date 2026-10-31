import Link from "next/link";

const TYPE_LABELS = {
  country: "este país",
  city: "esta cidade",
  attraction: "esta atração",
} as const;

// Página mostrada a quem chega (pela busca, por um link ou por um card) em
// um país, cidade ou atração ainda "em breve" (draft). No lugar do 404, avisa
// que o conteúdo está em preparação e leva a pessoa para algo disponível.
//
// O fundo é uma aquarela de lago ao entardecer (public/em-breve-*.avif), só
// decorativa. O céu da arte é escuro até perto das montanhas de propósito:
// o título e o texto brancos ficam sobre essa área.
export default function ComingSoonPage({
  type,
  name,
  parent,
}: {
  type: keyof typeof TYPE_LABELS;
  name: string;
  parent?: { href: string; label: string };
}) {
  return (
    <main className="flex min-h-[max(34rem,calc(100svh-5rem))] flex-1 justify-center bg-[#346a96] bg-[url('/em-breve-retrato.avif')] bg-cover bg-bottom px-4 pt-14 sm:min-h-[max(34rem,calc(100svh-5rem),50vw)] sm:bg-[url('/em-breve-paisagem.avif')] sm:bg-center sm:pt-16">
      <div className="flex max-w-2xl flex-col items-center text-center">
        <span className="rounded-full bg-terracota px-3 py-1 text-[11px] font-medium uppercase tracking-[0.17em] text-white">
          Em breve
        </span>
        <h1 className="mt-5 text-balance font-serif text-4xl leading-[1.1] tracking-tight text-white [text-shadow:0_1px_12px_rgb(43_38_32/45%)] sm:text-6xl">
          {name}
        </h1>
        <p className="mt-4 max-w-md text-center text-base leading-7 text-white [text-shadow:0_1px_10px_rgb(43_38_32/45%)]">
          Estamos preparando a curadoria de {TYPE_LABELS[type]}. Assim que o
          conteúdo estiver pronto, ele aparece por aqui.
        </p>
        <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-9">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-lg bg-areia px-8 py-3.5 text-[13px] font-semibold text-tinta transition-colors duration-200 hover:bg-branco focus-visible:outline-areia motion-safe:transition-[background-color,transform] motion-safe:active:scale-[0.98] sm:text-sm"
          >
            Ver destinos disponíveis
          </Link>
          {parent && (
            <Link
              href={parent.href}
              className="group inline-flex min-h-11 items-center text-sm text-white [text-shadow:0_1px_8px_rgb(43_38_32/40%)] focus-visible:outline-white"
            >
              <span className="underline decoration-white/45 decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-white">
                Voltar para {parent.label}
              </span>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
