"use client";

import Link from "next/link";
import Image from "next/image";
import PlaneLaunchIcon from "@/components/PlaneLaunchIcon";

interface HeroCounts {
  countries: number;
  cities: number;
  attractions: number;
}

export default function HeroSection({ counts }: { counts: HeroCounts }) {
  const showCounter =
    counts.countries > 0 && counts.cities > 0 && counts.attractions > 0;

  return (
    <section className="relative flex min-h-[70svh] flex-col justify-center overflow-hidden sm:min-h-[82svh] lg:min-h-[88svh]">
      <Image
        src="/hero-por-do-sol.jpeg"
        alt="Pôr do sol visto pela janela do avião, com nuvens douradas acima da asa"
        fill
        preload
        sizes="100vw"
        className="object-cover object-[60%_center] brightness-[0.72] sm:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tinta/65 via-tinta/15 to-tinta/35 lg:bg-gradient-to-r lg:from-tinta/85 lg:via-tinta/45 lg:to-transparent" />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 sm:py-24 lg:px-10">
        <div className="mx-auto flex max-w-[680px] flex-col text-center lg:mx-0 lg:text-left">
          <h1 className="font-serif text-[2.65rem] leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
            Por Aqui Pelo Mundo
          </h1>
          <p className="mt-4 text-center font-serif text-lg leading-snug text-areia sm:mt-6 sm:text-2xl lg:text-left lg:text-[1.7rem]">
            Monte seus roteiros de viagem com base na experiência real de quem já
            esteve lá.
          </p>
          <p className="mt-3 max-w-[620px] text-center text-[13px] leading-relaxed text-areia/85 sm:mt-4 sm:text-base lg:text-left">
            Atrações diversas, recomendadas e avaliadas pela viajante{" "}
            <Link
              href="/sobre"
              className="text-white decoration-1 underline-offset-2 hover:underline"
            >
              Rejane Abrantes
            </Link>
            , que compartilha dicas reais e exclusivas.
          </p>
          <div className="relative mt-6 w-fit self-center sm:mt-8 lg:self-start">
            <div className="relative inline-flex w-fit">
              <a
                href="#destinos"
                className="relative inline-block min-h-12 w-auto rounded-lg bg-terracota px-7 py-3.5 text-center text-base font-medium text-white transition hover:scale-105 hover:bg-terracota/90 active:scale-95 sm:px-9"
              >
                Monte seu roteiro
              </a>
            </div>
            <span className="absolute left-full top-1/2 ml-6 hidden h-[22px] w-[22px] -translate-y-1/2 sm:block">
              <PlaneLaunchIcon />
            </span>
          </div>

          {showCounter && (
            <p className="mt-5 text-center text-xs text-areia/90 sm:mt-6 sm:text-sm lg:text-left">
              <span className="font-serif text-base text-white">
                {counts.countries}
              </span>{" "}
              países ·{" "}
              <span className="font-serif text-base text-white">
                {counts.cities}
              </span>{" "}
              cidades ·{" "}
              <span className="font-serif text-base text-white">
                {counts.attractions}
              </span>{" "}
              atrações visitadas e avaliadas
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
