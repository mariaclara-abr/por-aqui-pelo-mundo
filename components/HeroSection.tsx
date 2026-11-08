import Image from "next/image";

interface HeroCounts {
  countries: number;
  cities: number;
  attractions: number;
}

export default function HeroSection({ counts }: { counts: HeroCounts }) {
  const showCounter =
    counts.countries > 0 && counts.cities > 0 && counts.attractions > 0;

  return (
    // Sobe por baixo do cabeçalho (transparente na home) para a foto ocupar a tela inteira.
    <section className="relative -mt-[var(--header-height,64px)] flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
      <Image
        src="/hero-por-do-sol.jpeg"
        alt="Pôr do sol visto pela janela do avião, com nuvens douradas acima da asa"
        fill
        preload
        sizes="100vw"
        className="object-cover object-[60%_center] sm:object-[center_42%]"
      />
      {/* Véu leve só para o texto claro ler bem sobre as nuvens. */}
      <div className="absolute inset-0 bg-tinta/25" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-tinta/40 to-transparent" />

      <div className="relative flex max-w-[760px] flex-col items-center px-4 pt-[var(--header-height,64px)] text-center text-white [text-shadow:0_1px_14px_rgba(43,38,32,0.35)] sm:px-6">
        {showCounter && (
          <p className="!text-center text-[11px] uppercase tracking-[0.28em] text-white/90 sm:text-xs">
            {counts.countries} países · {counts.cities} cidades ·{" "}
            {counts.attractions} atrações
          </p>
        )}
        <h1 className="mt-4 text-balance font-lora text-[2rem] uppercase leading-[1.12] tracking-[0.06em] sm:mt-5 sm:text-5xl lg:text-[3.6rem]">
          Monte seu roteiro de viagem
        </h1>
        <p className="mt-4 !text-center text-balance font-lora text-base text-areia sm:mt-5 sm:text-xl">
          Com base na experiência real de quem já esteve lá.
        </p>
        <a
          href="#destinos"
          className="mt-9 inline-flex min-h-11 items-center rounded-lg border border-white/70 px-6 text-[11px] font-light uppercase tracking-[0.28em] text-white backdrop-blur-[2px] [text-shadow:none] transition-colors duration-300 hover:border-terracota hover:bg-terracota sm:mt-11 sm:px-8"
        >
          Comece agora
        </a>
      </div>
    </section>
  );
}
