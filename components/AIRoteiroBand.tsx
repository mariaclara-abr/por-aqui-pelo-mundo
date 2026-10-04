"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import AIRoteiroFlourishes from "./AIRoteiroFlourishes";

const differentials = [
  {
    title: "A experiência da Rejane",
    description:
      "Uma IA especializada que aplica o método construído em anos de viagens: escolher prioridades, equilibrar os dias e aproveitar melhor cada destino.",
  },
  {
    title: "Personalizado de verdade",
    description:
      "Seu ritmo, seus interesses, seu orçamento e quem viaja com você orientam o roteiro. Viajar com crianças pede escolhas diferentes de uma viagem a dois.",
  },
  {
    title: "Lugares com curadoria real",
    description:
      "As atrações vêm de lugares que a Rejane visitou e avaliou pessoalmente. Cada indicação parte da experiência de quem esteve lá.",
  },
  {
    title: "Cada dia bem pensado",
    description:
      "A IA organiza atrações próximas, sugere horários e considera tempo de visita e pausas. Você recebe um roteiro dia a dia e pode levá-lo em PDF.",
  },
];

export default function AIRoteiroBand() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="roteiro-com-ia"
      aria-labelledby="roteiro-ia-title"
      className="relative isolate overflow-hidden bg-terracota px-4 py-14 text-branco sm:px-6 sm:py-20 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/destinos-background.png')] bg-[length:auto_700px] bg-left-top bg-repeat-y opacity-90 mix-blend-multiply [mask-image:linear-gradient(to_bottom,transparent,#000_8%,#000_85%,transparent)] [mask-size:100%_700px] [mask-repeat:repeat-y] lg:bg-cover lg:bg-center lg:bg-no-repeat lg:[mask-image:none]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-tinta/25"
      />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 xl:gap-16">
          <motion.div
            className="relative pt-16 lg:pt-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" }}
          >
            <AIRoteiroFlourishes />
            <p className="text-left text-xs font-medium tracking-wide text-areia sm:text-sm">
              Seu planejador de viagens com IA
            </p>
            <h2
              id="roteiro-ia-title"
              className="mt-4 font-serif text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.12] tracking-[-0.03em]"
            >
              Seu roteiro ideal,
              <br />
              <span className="text-areia">pronto em minutos.</span>
            </h2>
            <p className="mt-6 max-w-lg text-left text-base font-medium leading-7 text-branco sm:text-lg">
              Uma IA especializada em viagens, com o método da Rejane.
            </p>
            <p className="mt-3 max-w-lg text-left text-sm leading-7 text-areia sm:text-base">
              Anos de experiência, técnicas de planejamento e lugares que ela
              visitou e avaliou, combinados para criar uma viagem sob medida
              para você.
            </p>

            <div className="mt-7">
              <Link
                href="/meu-roteiro/organizar-com-ia"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-areia px-4 py-3.5 text-[13px] font-semibold text-tinta transition-colors duration-200 hover:bg-branco focus-visible:outline-areia motion-safe:transition-[background-color,transform] motion-safe:active:scale-[0.98] sm:w-auto sm:gap-5 sm:px-6 sm:text-sm"
              >
                Montar meu roteiro com IA
                <span
                  aria-hidden="true"
                  className="text-lg leading-none motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </motion.div>

          <figure className="relative overflow-hidden rounded-xl bg-tinta">
            <Image
              src="/ia-roteiro-roma.webp"
              alt="O Coliseu em Roma, iluminado pelo sol do fim da tarde"
              width={1400}
              height={933}
              sizes="(min-width: 1600px) 760px, (min-width: 1024px) 52vw, 100vw"
              className="h-auto w-full"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-tinta/95 via-tinta/60 to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 px-5 py-5 font-serif text-[clamp(1.25rem,2.1vw,2rem)] leading-snug tracking-[-0.02em] text-branco sm:px-8 sm:py-7">
              Sua viagem. Seu ritmo. Seu roteiro.
            </figcaption>
          </figure>
        </div>

        <div className="mt-12 border-t border-areia/25 pt-9 sm:mt-16 sm:pt-11">
          <h3 className="max-w-2xl text-balance font-serif text-2xl leading-snug text-areia sm:text-3xl">
            O que faz a diferença no seu roteiro
          </h3>
          <div
            aria-label="Diferenciais do roteiro personalizado com IA"
            className="mt-7 grid gap-x-14 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:mt-9 xl:gap-x-24"
          >
            {differentials.map((differential) => (
              <article key={differential.title}>
                <h4 className="font-serif text-xl leading-snug text-branco sm:text-2xl">
                  {differential.title}
                </h4>
                <p className="mt-2.5 max-w-xl text-left text-sm leading-7 text-areia sm:text-base">
                  {differential.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
