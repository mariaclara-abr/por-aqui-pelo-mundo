"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { animateBeach } from "@/lib/animate-beach";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const prefersReducedMotion = () => window.matchMedia(MOTION_QUERY).matches;
const serverReducedMotion = () => true;

export default function PraiaAnimada({ className = "" }: { className?: string }) {
  const paintingRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, serverReducedMotion);

  useEffect(() => {
    const painting = paintingRef.current;
    const canvas = canvasRef.current;
    if (!painting || !canvas || reducedMotion) return;
    let cancelled = false;
    let visible = false;
    let animation: ReturnType<typeof animateBeach> | undefined;
    const refresh = () => animation?.setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", refresh);
    const fallback = () => {
      if (cancelled) return;
      animation?.dispose();
      animation = undefined;
      canvas.style.opacity = "0";
    };
    canvas.addEventListener("webglcontextlost", fallback);
    painting.decode().then(() => {
      if (cancelled) return;
      animation = animateBeach(canvas, painting);
      canvas.style.opacity = "1";
      refresh();
    }).catch(fallback);

    return () => {
      cancelled = true;
      animation?.dispose();
      observer.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      canvas.removeEventListener("webglcontextlost", fallback);
      canvas.style.opacity = "0";
    };
  }, [reducedMotion]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Image
        ref={paintingRef}
        src="/login-praia-aquarela.webp"
        alt="Aquarela de uma praia de mar turquesa, areia clara e coqueiros inclinados sobre a água."
        fill
        loading="eager"
        sizes="(max-aspect-ratio: 3/2) 150svh, 100vw"
        className="object-cover object-[63%_50%] sm:object-center"
      />
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-0" />
    </div>
  );
}
