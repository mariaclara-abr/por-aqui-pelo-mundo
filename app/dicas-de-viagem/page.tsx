import type { Metadata } from "next";
import Image from "next/image";
import { getTravelTips } from "@/lib/queries";
import TravelTipsGrid from "@/components/TravelTipsGrid";
import { buildOpenGraph } from "@/lib/metadata";

const TITLE = "Dicas de viagem";
const DESCRIPTION =
  "Dicas exclusivas de quem viveu cada viagem: truques práticos, curiosidades e detalhes que fazem diferença no dia a dia do roteiro.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/dicas-de-viagem" },
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION }),
};

export default async function DicasDeViagemPage() {
  const tips = await getTravelTips();

  return (
    <main className="flex-1 overflow-hidden">
      <section className="relative overflow-hidden border-b border-tinta/10 bg-oliva text-areia">
        <div className="mx-auto grid min-h-[580px] max-w-[1440px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative z-10 px-4 pb-4 pt-14 sm:px-6 sm:pb-0 sm:pt-20 lg:px-10 lg:py-24">
            <p className="flex items-center gap-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-areia/70">
              <span className="h-px w-8 bg-terracota" aria-hidden="true" />
              Caderno de bordo
            </p>
            <h1 className="mt-5 max-w-xl font-serif text-[3.4rem] leading-[0.94] tracking-[-0.04em] text-branco sm:text-6xl lg:text-7xl">
              Dicas de viagem
            </h1>
            <p className="mt-6 max-w-lg text-left text-base leading-relaxed text-areia/85 sm:text-lg">
              Pequenos detalhes que mudam uma viagem inteira. Achados,
              atalhos e cuidados reunidos por quem já esteve lá.
            </p>
          </div>

          <div className="relative flex min-h-[290px] items-end justify-center sm:min-h-[390px] lg:h-full lg:min-h-[580px]">
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-6 top-6 hidden w-px bg-areia/15 lg:block"
            />
            <Image
              src="/dicas-viagem-caderno.png"
              alt=""
              width={1536}
              height={1024}
              preload
              sizes="(min-width: 1024px) 42vw, (min-width: 640px) 68vw, 82vw"
              className="relative mb-3 h-auto max-h-[34svh] w-[82%] object-contain sm:max-h-[360px] sm:w-[68%] lg:absolute lg:bottom-24 lg:left-[43%] lg:max-h-[500px] lg:w-[82%] lg:-translate-x-1/2"
            />
          </div>
        </div>
      </section>

      <section className="relative px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 grid gap-6 border-b border-tinta/15 pb-8 sm:mb-16 sm:pb-10 lg:grid-cols-[0.55fr_1fr] lg:items-end">
            <div>
              <p className="text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota">
                Para consultar antes de ir
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-tinta sm:text-4xl">
                Anotações de viagem
              </h2>
            </div>
            <p className="max-w-xl text-left text-sm leading-relaxed text-oliva sm:text-base lg:justify-self-end">
              Clique nas anotações para saber mais
            </p>
          </div>

          {tips.length === 0 ? (
            <div className="border-y border-tinta/15 py-16 text-center">
              <p className="font-serif text-2xl text-tinta">
                Novas anotações em breve.
              </p>
              <p className="mt-2 text-center text-sm text-oliva">
                Este caderno continua ganhando páginas.
              </p>
            </div>
          ) : (
            <TravelTipsGrid tips={tips} />
          )}
        </div>
      </section>
    </main>
  );
}
