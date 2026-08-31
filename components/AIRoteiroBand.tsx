"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

export default function AIRoteiroBand() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-terracota px-4 py-12 sm:px-6 sm:py-20 lg:px-10">
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs uppercase tracking-widest text-areia/80">
            Novidade
          </p>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-branco sm:text-4xl lg:text-5xl">
            Nossa IA monta o roteiro ideal para você!
          </h2>
          <p className="mt-5 text-areia/90">
            A junção da curadoria real da Rejane com inteligência artificial:
            em poucos minutos você recebe um roteiro detalhado sob medida
            para sua viagem.
          </p>

          <div className="relative mt-8 inline-flex w-fit">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-lg bg-branco"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { opacity: [0.35, 0, 0.35], scale: [1, 1.12, 1] }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <button
              type="button"
              onClick={() => router.push("/meu-roteiro/organizar-com-ia")}
              className="relative inline-flex items-center gap-2 rounded-lg bg-branco px-7 py-3.5 text-sm font-medium text-terracota transition-transform hover:scale-105 active:scale-95"
            >
              Montar meu roteiro com IA
            </button>
          </div>
        </motion.div>

        <Image
          src="/ia-roteiro-ilustracao.png"
          alt="Mapa ilustrado com uma rota de viagem, pinos de localização, bússola e avião"
          width={620}
          height={628}
          className="mx-auto w-full max-w-[390px] drop-shadow-xl sm:max-w-[470px] lg:mx-0 lg:max-w-[520px] lg:-translate-x-12 xl:-translate-x-20"
        />
      </div>
    </section>
  );
}
