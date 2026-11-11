import Image from "next/image";
import Link from "next/link";
import { thumbUrl } from "@/lib/thumb";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";
import type { getCitiesBySlugs } from "@/lib/queries";

type City = Awaited<ReturnType<typeof getCitiesBySlugs>>[number];

export default function TrendingDestinations({ cities }: { cities: City[] }) {
  if (cities.length === 0) return null;

  return (
    <section
      aria-labelledby="destinos-em-alta-title"
      className="bg-areia px-4 py-10 sm:px-6 sm:py-12 lg:px-10"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="destinos-em-alta-title"
          className="text-center font-lora text-3xl uppercase leading-[1.12] tracking-[0.06em] text-tinta sm:text-4xl lg:text-5xl"
        >
          Destinos em alta
        </h2>

        <ul className="mt-8 grid gap-x-5 gap-y-8 sm:mt-10 sm:grid-cols-3 sm:gap-x-6">
          {cities.map((city) => {
            const place = [city.states?.name, city.countries?.name]
              .filter(Boolean)
              .join(", ");
            const isPublished = city.status === "published";
            const content = (
              <>
                <div className="relative aspect-[4/3] overflow-hidden bg-branco">
                  <div className="foto-contorno" />
                  {city.cover_image_url && (
                    <Image
                      src={thumbUrl(city.cover_image_url)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 330px, (min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      style={imagePositionStyle(parseImagePosition(city.cover_image_position))}
                    />
                  )}
                </div>
                <h3 className="mt-4 font-serif text-xl text-tinta sm:text-2xl">
                  {city.name}
                </h3>
                <p className="mt-1 text-left text-sm text-oliva">{place}</p>
                {!isPublished && (
                  <p className="mt-2 text-left text-[11px] uppercase tracking-[0.2em] text-terracota">
                    Em breve
                  </p>
                )}
              </>
            );

            return (
              <li key={city.slug}>
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

        <div className="mt-8 text-center sm:mt-10">
          <a href="#destinos" className="btn btn-oliva">
            Ver todos os destinos
          </a>
        </div>
      </div>
    </section>
  );
}
