import Image from "next/image";
import Link from "next/link";
import { thumbUrl } from "@/lib/thumb";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";
import type { getCitiesBySlugs } from "@/lib/queries";

type City = Awaited<ReturnType<typeof getCitiesBySlugs>>[number];

// Layout editorial: texto à esquerda e cards numerados com divisórias finas à direita.
// Fundo claro com a paisagem em aquarela (a mesma do antigo "Explorar destinos"), suavizada por um véu branco. No celular, os cards viram carrossel.
export default function TrendingDestinations({ cities }: { cities: City[] }) {
  if (cities.length === 0) return null;

  return (
    <section
      aria-labelledby="destinos-em-alta-title"
      className="relative isolate overflow-hidden bg-branco px-4 py-14 text-tinta sm:px-6 sm:py-20 lg:px-10 lg:py-24"
    >
      <Image
        src="/destinos-background.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center opacity-70"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white/45" />
      <div className="relative mx-auto max-w-[1440px] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-6">
        <div className="lg:pr-4 lg:pt-1">
          <p className="text-[11px] font-light uppercase tracking-[0.28em] text-oliva">
            Para onde ir agora
          </p>
          <h2
            id="destinos-em-alta-title"
            className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl"
          >
            Destinos
            <br />
            em alta
          </h2>
          <div className="mt-6 h-px w-10 bg-terracota" aria-hidden="true" />
          <p className="mt-6 max-w-xs !text-left text-sm leading-relaxed text-tinta/80">
            Os destinos que mais famílias estão pesquisando agora. Descubra por que todo mundo quer ir.
          </p>
          <Link href="/paises" className="btn btn-terracota btn-cheio btn-sm mt-7 hidden lg:inline-flex">
            Ver todos os destinos
          </Link>
        </div>

        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-0 [&::-webkit-scrollbar]:hidden">
          {cities.map((city, i) => {
            const place = [city.states?.name, city.countries?.name]
              .filter(Boolean)
              .join(", ");
            const isPublished = city.status === "published";
            const content = (
              <>
                <div className="relative aspect-[4/3] overflow-hidden bg-areia">
                  <div className="foto-contorno" />
                  {city.cover_image_url && (
                    <Image
                      src={thumbUrl(city.cover_image_url)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 340px, (min-width: 640px) 33vw, 78vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      style={imagePositionStyle(parseImagePosition(city.cover_image_position))}
                    />
                  )}
                </div>
                <p className="mt-5 text-xs font-light tracking-[0.2em] text-oliva">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-xl sm:text-2xl">{city.name}</h3>
                  {isPublished && (
                    <span
                      aria-hidden="true"
                      className="text-lg text-terracota transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  )}
                </div>
                <p className="mt-1 !text-left text-sm text-tinta/70">{place}</p>
                {!isPublished && (
                  <p className="mt-2 !text-left text-[11px] uppercase tracking-[0.2em] text-oliva">
                    Em breve
                  </p>
                )}
              </>
            );

            return (
              <li
                key={city.slug}
                className="w-[78%] shrink-0 snap-start sm:w-auto lg:border-l lg:border-tinta/15 lg:pl-6"
              >
                {isPublished && city.countries ? (
                  <Link href={`/${city.countries.slug}/${city.slug}`} className="group block">
                    {content}
                  </Link>
                ) : (
                  <div className="group">{content}</div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 lg:hidden">
          <Link href="/paises" className="btn btn-terracota btn-cheio btn-sm">
            Ver todos os destinos
          </Link>
        </div>
      </div>
    </section>
  );
}
