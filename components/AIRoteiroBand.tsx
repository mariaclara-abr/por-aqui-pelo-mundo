"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PremiumDialog from "@/components/PremiumDialog";

const ITINERARY_STEPS = [
  "Dia 1 · Torre Eiffel ao entardecer",
  "Dia 2 · Louvre + Jardim das Tulherias",
  "Dia 3 · Passeio de barco no Sena",
  "Dia 4 · Versalhes em família",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.22, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, bounce: 0.5, visualDuration: 0.35 },
  },
};

function PlaneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21 12.5l-6.2-2.2L11.6 3l-1.9.7 1.9 6.8-5.1 1.8-2-1.5-1.5.5 1.7 3 3 1.7.5-1.5-1.5-2 5.1-1.8 1.9 6.8 1.9-.7-1.9-6.8L21 12.5z" />
    </svg>
  );
}

// Símbolo oficial do Por Aqui Pelo Mundo (o mesmo do favicon e da imagem de
// compartilhamento de link), usado aqui em vez do PlaneGlyph genérico.
function BrandPlaneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path
        d="M21,16V14L13,9V3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5V9L2,14V16L10,13.5V19L7.5,20.5V22L11.5,21L15.5,22V20.5L13,19V13.5L21,16Z"
        transform="rotate(20 11.5 12)"
      />
    </svg>
  );
}

function ItineraryCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm -rotate-2 rounded-2xl border border-tinta/10 bg-areia p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-3 border-b border-tinta/10 pb-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracota text-areia">
          <BrandPlaneGlyph className="h-4 w-4" />
        </span>
        <div>
          <p className="font-serif text-base text-tinta">Roteiro em Paris</p>
          <p className="text-xs text-oliva">
            com base na curadoria real da Rejane
          </p>
        </div>
      </div>

      <motion.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
        className="relative mt-5 flex flex-col gap-4"
      >
        <motion.div
          aria-hidden="true"
          className="absolute left-[11px] top-1 w-px bg-terracota/40"
          style={{ height: "calc(100% - 8px)", transformOrigin: "top" }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: "easeInOut", delay: 0.2 }}
        />
        {ITINERARY_STEPS.map((step) => (
          <motion.li
            key={step}
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <motion.span
              variants={dotVariants}
              className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-terracota text-branco"
            >
              <svg
                viewBox="0 0 20 20"
                className="h-3 w-3 fill-none stroke-current"
                strokeWidth={3}
              >
                <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
            <span className="text-sm text-tinta">{step}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

export default function AIRoteiroBand() {
  const prefersReducedMotion = useReducedMotion();
  const [showPremium, setShowPremium] = useState(false);

  return (
    <section className="relative overflow-hidden bg-terracota px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-6 text-branco/15 sm:right-8 sm:top-10"
        animate={
          prefersReducedMotion
            ? undefined
            : { y: [0, -10, 0], rotate: [-8, -2, -8] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <PlaneGlyph className="h-20 w-20 sm:h-28 sm:w-28" />
      </motion.div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
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
              onClick={() => setShowPremium(true)}
              className="relative inline-flex items-center gap-2 rounded-lg bg-branco px-7 py-3.5 text-sm font-medium text-terracota transition-transform hover:scale-105 active:scale-95"
            >
              Montar meu roteiro com IA
            </button>
          </div>
        </motion.div>

        <ItineraryCard />
      </div>

      {showPremium && (
        <PremiumDialog
          itineraryId={null}
          countryCount={0}
          onClose={() => setShowPremium(false)}
        />
      )}
    </section>
  );
}
