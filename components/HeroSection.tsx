"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import PlaneLaunchIcon from "@/components/PlaneLaunchIcon";

interface HeroCounts {
  countries: number;
  cities: number;
  attractions: number;
}

export default function HeroSection({ counts }: { counts: HeroCounts }) {
  const prefersReducedMotion = useReducedMotion();
  const showCounter =
    counts.countries > 0 && counts.cities > 0 && counts.attractions > 0;

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      <img
        src="/hero-por-do-sol.jpeg"
        alt="Pôr do sol visto pela janela do avião, com nuvens douradas acima da asa"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.55]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tinta/70 via-tinta/25 to-tinta/40" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-4 py-24 text-center sm:px-6 lg:px-10 lg:text-left">
        <h1 className="font-serif text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:whitespace-nowrap">
          Por Aqui Pelo Mundo
        </h1>
        <p className="mt-5 text-center font-serif text-xl text-areia sm:text-2xl lg:text-left">
          Monte seu roteiro de viagens com base na experiência real de quem já
          esteve lá.
        </p>
        <p className="mt-3 text-center text-sm text-areia/80 sm:text-base lg:text-left">
          Atrações diversas, recomendadas e avaliadas pela viajante{" "}
          <Link
            href="/sobre"
            className="text-white decoration-1 underline-offset-2 hover:underline"
          >
            Rejane Abrantes
          </Link>
          , que compartilha dicas reais e exclusivas.
        </p>
        <div className="relative mt-8 self-center lg:self-start">
          <div className="relative inline-flex w-fit">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-lg bg-terracota"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { opacity: [0.35, 0, 0.35], scale: [1, 1.12, 1] }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <a
              href="#destinos"
              className="relative inline-block rounded-lg bg-terracota px-9 py-3.5 text-base font-medium text-white transition hover:scale-105 hover:bg-terracota/90 active:scale-95"
            >
              Explorar destinos
            </a>
          </div>
          <span className="absolute left-full top-1/2 ml-6 h-[22px] w-[22px] -translate-y-1/2">
            <PlaneLaunchIcon />
          </span>
        </div>

        {showCounter && (
          <p className="mt-6 text-center text-sm text-areia/90 lg:text-left">
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
    </section>
  );
}
