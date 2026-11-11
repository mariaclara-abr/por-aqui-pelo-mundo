"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export default function TravelTipsBand({ tipCount }: { tipCount: number }) {
  const prefersReducedMotion = useReducedMotion();

  if (tipCount === 0) return null;

  return (
    <section className="bg-areia p-3 sm:p-4 lg:p-6">
      <div className="relative mx-auto flex aspect-[4/5] max-w-[1440px] items-center justify-center overflow-hidden sm:aspect-[16/9] lg:aspect-[13/5]">
        <Image
          src="/dicas-por-do-sol-serra.jpg"
          alt="Pôr do sol visto de uma varanda de madeira com duas cadeiras, sobre vales e um mar de nuvens na serra"
          fill
          sizes="100vw"
          className="object-cover object-[50%_55%] lg:object-[50%_50%]"
        />
        <div className="absolute inset-0 bg-tinta/35" aria-hidden="true" />

        <motion.div
          className="relative max-w-3xl px-6 text-center text-white"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-balance font-serif text-2xl uppercase leading-tight tracking-[0.04em] sm:text-3xl lg:text-4xl">
            As dicas que nenhum guia <span className="whitespace-nowrap">te conta</span>
          </h2>
          <p className="mx-auto mt-4 !text-center text-balance font-lora text-base text-areia sm:mt-5 sm:text-xl">
            Truques práticos, avisos importantes e exclusivos,
            <br className="hidden sm:block" />
            anotados por quem já viveu a viagem.
          </p>
          <div className="mt-7">
            <Link href="/dicas-de-viagem" className="btn btn-claro">
              Abrir o caderno de bordo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
