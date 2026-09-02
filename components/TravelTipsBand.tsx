"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export default function TravelTipsBand({ tipCount }: { tipCount: number }) {
  const prefersReducedMotion = useReducedMotion();

  if (tipCount === 0) return null;

  return (
    <section className="relative overflow-hidden bg-areia px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
      <div className="relative mx-auto flex max-w-[1440px] flex-col-reverse items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-oliva/75">
            <span className="h-px w-8 bg-terracota" aria-hidden="true" />
            Caderno de bordo
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-tinta sm:text-4xl lg:text-5xl">
            As dicas que nenhum guia te conta
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-oliva sm:text-base">
            Antes de fechar as malas, veja o que só quem já viveu a viagem
            sabe: truques práticos, avisos importantes reunidos e pequenos
            achados anotados no caminho.
          </p>

          <div className="mt-8">
            <Link
              href="/dicas-de-viagem"
              className="inline-flex items-center gap-2 rounded-lg bg-terracota px-7 py-3.5 text-sm font-medium text-branco transition-transform hover:scale-105 active:scale-95"
            >
              Abrir o caderno de bordo
              <span aria-hidden="true" className="text-base leading-none">
                →
              </span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="w-full max-w-[380px] sm:max-w-[460px] lg:max-w-[520px] lg:-translate-x-8"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <Image
            src="/dicas-viagem-caderno.png"
            alt="Caderno de viagem aberto com anotações, mapa e objetos de viagem"
            width={1536}
            height={1024}
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 88vw"
            className="h-auto w-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
