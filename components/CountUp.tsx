"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";

// Número que sobe de 0 até `to` quando entra na tela (uma vez só).
// O HTML do servidor já traz o valor final, então sem JS ou com movimento
// reduzido o número aparece pronto.
export default function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inView) {
      el.textContent = `0${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return (
    <>
      <span className="sr-only">{`${to}${suffix}`}</span>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {`${to}${suffix}`}
      </span>
    </>
  );
}
