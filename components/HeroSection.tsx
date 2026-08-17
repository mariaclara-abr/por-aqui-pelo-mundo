import Link from "next/link";
import HeroPhotoStack from "@/components/HeroPhotoStack";
import PlaneLaunchIcon from "@/components/PlaneLaunchIcon";
import type { HeroPhoto } from "@/lib/queries";

interface HeroCounts {
  countries: number;
  cities: number;
  attractions: number;
}

export default function HeroSection({
  photos,
  counts,
}: {
  photos: HeroPhoto[];
  counts: HeroCounts;
}) {
  const showCounter =
    counts.countries > 0 && counts.cities > 0 && counts.attractions > 0;

  return (
    <section className="bg-areia lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
      <div className="mx-auto flex max-w-[1440px] flex-col-reverse lg:flex-row lg:items-center lg:gap-10 lg:px-10 lg:py-14">
        <div className="flex flex-col px-4 pb-10 pt-8 text-center sm:px-6 lg:w-[58%] lg:px-0 lg:pb-0 lg:pt-0 lg:text-left">
          <h1 className="font-serif text-4xl leading-tight tracking-tight text-terracota sm:text-5xl lg:text-[3.4rem] lg:whitespace-nowrap">
            Por Aqui Pelo Mundo
          </h1>
          <p className="mt-5 text-center font-serif text-xl text-tinta sm:text-2xl lg:text-left">
            Monte seu roteiro de viagens com base na experiência real de quem
            já esteve lá.
          </p>
          <p className="mt-3 text-center text-sm text-oliva/80 sm:text-base lg:text-left">
            Atrações diversas, recomendadas e avaliadas pela viajante{" "}
            <Link
              href="/sobre"
              className="text-terracota decoration-1 underline-offset-2 hover:underline"
            >
              Rejane Abrantes
            </Link>
            , que compartilha dicas reais e exclusivas.
          </p>
          <div className="relative mt-8 self-center lg:self-start">
            <a
              href="#destinos"
              className="inline-block rounded-lg bg-terracota px-9 py-3.5 text-base font-medium text-white transition-colors hover:bg-terracota/90"
            >
              Explorar destinos
            </a>
            <span className="absolute left-full top-1/2 ml-6 h-[22px] w-[22px] -translate-y-1/2">
              <PlaneLaunchIcon />
            </span>
          </div>

          {showCounter && (
            <p className="mt-6 text-center text-sm text-oliva lg:text-left">
              <span className="font-serif text-base text-tinta">
                {counts.countries}
              </span>{" "}
              países ·{" "}
              <span className="font-serif text-base text-tinta">
                {counts.cities}
              </span>{" "}
              cidades ·{" "}
              <span className="font-serif text-base text-tinta">
                {counts.attractions}
              </span>{" "}
              atrações visitadas e avaliadas
            </p>
          )}
        </div>

        <div className="lg:w-[42%]">
          <HeroPhotoStack photos={photos} />
        </div>
      </div>
    </section>
  );
}
