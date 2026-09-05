import Link from "next/link";
import Image from "next/image";
import { imagePositionStyle, type ImagePosition } from "@/lib/image-position";

export default function DestinationCard({
  href,
  name,
  imageUrl,
  imagePosition,
}: {
  href: string;
  name: string;
  imageUrl: string | null;
  imagePosition?: ImagePosition | null;
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-branco shadow-sm"
    >
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            style={imagePositionStyle(imagePosition)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-transparent" />
          <h2 className="absolute bottom-4 left-4 font-serif text-xl text-white transition-colors group-hover:text-terracota">
            {name}
          </h2>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-serif text-lg text-oliva">{name}</span>
        </div>
      )}
    </Link>
  );
}
