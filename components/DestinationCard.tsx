import Link from "next/link";

export default function DestinationCard({
  href,
  name,
  imageUrl,
}: {
  href: string;
  name: string;
  imageUrl: string | null;
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-branco shadow-sm"
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
