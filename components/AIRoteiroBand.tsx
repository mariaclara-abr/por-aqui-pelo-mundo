"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

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
            className="relative"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" }}
          >
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
                className="btn btn-claro btn-cheio group w-full whitespace-nowrap focus-visible:outline-areia sm:w-auto"
              >
                Montar meu roteiro com IA
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

        <div className="mt-12 bg-areia px-5 py-12 text-tinta sm:mt-16 sm:px-10 sm:py-16 lg:py-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center lg:flex-row">
            <figure className="relative aspect-[3/4] w-full max-w-sm shrink-0 lg:w-[44%] lg:max-w-none">
              <Image
                src="/roteiro-toscana-vitaleta.jpg"
                alt="Capela de Vitaleta ao pôr do sol, entre ciprestes e um pinheiro, em San Quirico d'Orcia, na Toscana"
                fill
                sizes="(min-width: 1024px) 450px, (min-width: 640px) 384px, 100vw"
                className="object-cover"
              />
            </figure>

            <div className="relative -mt-16 w-[90%] border border-oliva/25 bg-branco px-6 py-8 sm:max-w-md sm:px-8 lg:-ml-20 lg:mt-0 lg:w-auto lg:max-w-none lg:flex-1 lg:px-10 lg:py-10">
              <h3 className="text-balance font-serif text-2xl leading-snug text-tinta sm:text-3xl">
                O que faz a diferença no seu roteiro
              </h3>
              <div
                aria-label="Diferenciais do roteiro personalizado com IA"
                className="mt-6 space-y-5"
              >
                {differentials.map((differential) => (
                  <article key={differential.title}>
                    <h4 className="font-serif text-lg leading-snug text-oliva">
                      {differential.title}
                    </h4>
                    <p className="mt-1 text-left text-sm leading-6 text-tinta/80">
                      {differential.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
