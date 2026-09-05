"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";
import type { Database } from "@/types/database";

type City = Database["public"]["Tables"]["cities"]["Row"];

export default function ComingSoonCityCard({
  city,
  countrySlug,
}: {
  city: City;
  countrySlug: string;
}) {
  const { isAuthor } = useAuth();

  const content = (
    <>
      {city.cover_image_url ? (
        <Image
          src={city.cover_image_url}
          alt={city.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale transition-transform duration-300 group-hover:scale-105"
          style={imagePositionStyle(parseImagePosition(city.cover_image_position))}
        />
      ) : (
        <div className="h-full w-full bg-areia" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <span className="absolute left-4 top-4 rounded-full bg-terracota px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
        Em breve
      </span>

      <h2 className="absolute bottom-4 left-4 font-serif text-xl text-white">
        {city.name}
      </h2>
    </>
  );

  const className =
    "group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-branco shadow-sm";

  // Só a autora pode entrar na página da cidade em breve, para conferir a
  // prévia de como ela vai ficar quando publicada.
  if (isAuthor) {
    return (
      <Link href={`/${countrySlug}/${city.slug}`} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
