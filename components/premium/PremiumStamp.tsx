"use client";

import { useId } from "react";
import { motion } from "motion/react";

// Carimbo de passaporte do Premium: "bate" na página quando entra na tela.
export default function PremiumStamp({
  date,
  className = "h-36 w-36",
  rotate = -12,
  delay = 0.7,
  decorative = false,
}: {
  // Sem data, o centro do carimbo mostra só o avião (usos pequenos, como nos cards).
  date?: string;
  // Tamanho e posição ficam por conta de quem usa.
  className?: string;
  rotate?: number;
  delay?: number;
  // Repetições do carimbo na mesma página não precisam ser lidas de novo.
  decorative?: boolean;
}) {
  // Cada carimbo precisa de ids próprios, senão as cópias se referenciam.
  const uid = useId().replace(/:/g, "");
  const ringId = `stamp-ring-${uid}`;
  const roughId = `stamp-rough-${uid}`;

  return (
    <motion.svg
      viewBox="0 0 160 160"
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": date ? `Carimbo Premium de ${date}` : "Selo Premium" })}
      className={`text-terracota mix-blend-multiply ${className}`}
      initial={{ opacity: 0, scale: 1.8, rotate: rotate - 22 }}
      whileInView={{ opacity: 0.92, scale: 1, rotate }}
      // Limite baixo: dentro de containers com overflow cortado (cards) o carimbo
      // começa ampliado e quase nunca chega a 60% visível.
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 280, damping: 15, delay }}
    >
      <defs>
        <path
          id={ringId}
          d="M 25,80 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0"
        />
        <filter id={roughId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            seed="4"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
        </filter>
      </defs>
      <g fill="none" stroke="currentColor" filter={`url(#${roughId})`}>
        <circle cx="80" cy="80" r="75" strokeWidth="3.5" />
        <circle cx="80" cy="80" r="68" strokeWidth="1" />
        <circle cx="80" cy="80" r="46" strokeWidth="1.5" />
        <text
          fill="currentColor"
          stroke="none"
          fontSize="12"
          fontWeight="700"
          fontFamily="var(--font-inter), sans-serif"
        >
          <textPath href={`#${ringId}`} textLength="340" lengthAdjust="spacing">
            POR AQUI PELO MUNDO • PREMIUM •
          </textPath>
        </text>
        {date ? (
          <>
            <image href="/assets/simbolo.svg" x="66" y="54" width="28" height="28" />
            <text
              x="80"
              y="98"
              textAnchor="middle"
              fill="currentColor"
              stroke="none"
              fontSize="9"
              fontWeight="700"
              letterSpacing="0.8"
            >
              {date}
            </text>
          </>
        ) : (
          <image href="/assets/simbolo.svg" x="58" y="58" width="44" height="44" />
        )}
      </g>
    </motion.svg>
  );
}
