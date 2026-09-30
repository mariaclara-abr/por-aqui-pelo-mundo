import Image from "next/image";
import Link from "next/link";

export default function ItineraryPremiumBanner() {
  return (
    <section
      aria-labelledby="roteiro-ia-convite"
      className="relative grid overflow-hidden rounded-xl transition-colors hover:border-oliva/50 border border-oliva/20 bg-branco shadow-[0_8px_28px_-20px_rgba(43,38,32,0.2)] md:grid-cols-[1.2fr_1fr]"
    >
      <div className="px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-oliva sm:text-[11px]">
          <span aria-hidden="true" className="h-px w-7 bg-terracota" />
          Experiência premium
        </p>
        <h2
          id="roteiro-ia-convite"
          className="mt-4 font-serif text-[1.75rem] leading-[1.15] tracking-[-0.025em] text-tinta sm:text-4xl md:text-[2rem] lg:text-[2.625rem]"
        >
          Seus lugares viram{" "}
          <br />
          <span className="text-oliva">um roteiro completo.</span>
        </h2>
        <p className="mt-4 max-w-md text-left text-sm leading-6 text-oliva">
          A IA organiza dias, horários e trajetos com a curadoria da Rejane,
          respeitando seu jeito de viajar.
        </p>
        <Link
          href="/meu-roteiro/organizar-com-ia"
          className="group mt-6 inline-flex after:absolute after:inset-0 after:content-[''] min-h-12 items-center justify-center gap-5 rounded-lg bg-oliva px-6 py-3 text-sm font-semibold text-branco transition-colors duration-200 hover:bg-tinta active:bg-tinta focus-visible:outline-oliva"
        >
          Organizar com IA
          <span
            aria-hidden="true"
            className="text-lg leading-none motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none relative flex h-44 items-center justify-center overflow-hidden bg-oliva bg-[url('/itinerary-atlas.svg')] bg-[length:960px_640px] bg-top-right sm:h-56 md:h-auto"
      >
        <span className="absolute inset-3 rounded-lg border border-areia/25 sm:inset-4" />
        <Image
          src="/ia-caderno-premium.webp"
          alt=""
          width={1200}
          height={800}
          sizes="(min-width: 1280px) 520px, (min-width: 768px) 44vw, 320px"
          className="relative h-full w-auto max-w-[90%] select-none object-contain py-2 sm:py-3 md:h-auto md:w-full md:max-w-none md:px-2"
        />
      </div>
    </section>
  );
}
