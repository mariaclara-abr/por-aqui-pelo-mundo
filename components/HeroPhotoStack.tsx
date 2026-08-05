import type { HeroPhoto } from "@/lib/queries";

function CompassIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-14 w-14 fill-none stroke-oliva/40"
      strokeWidth={1.25}
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M15.2 8.8l-2 4.4-4.4 2 2-4.4z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Placeholder({ className }: { className: string }) {
  return (
    <div className={`flex items-center justify-center bg-areia ${className}`}>
      <CompassIcon />
    </div>
  );
}

export default function HeroPhotoStack({ photos }: { photos: HeroPhoto[] }) {
  return (
    <>
      {/* Mobile: uma única foto de destaque no topo */}
      <div className="relative h-[40vh] w-full overflow-hidden lg:hidden">
        {photos[0] ? (
          <img
            src={photos[0].url}
            alt={photos[0].alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <Placeholder className="h-full w-full" />
        )}
      </div>

      {/* Desktop: composição de fotos sobrepostas */}
      <div className="relative hidden h-[420px] w-full lg:block">
        {photos[0] ? (
          <img
            src={photos[0].url}
            alt={photos[0].alt}
            className="absolute left-0 top-0 h-[75%] w-[62%] rounded-xl object-cover shadow-sm"
          />
        ) : (
          <Placeholder className="absolute left-0 top-0 h-[75%] w-[62%] rounded-xl" />
        )}

        {photos[1] ? (
          <img
            src={photos[1].url}
            alt={photos[1].alt}
            className="absolute bottom-0 right-0 h-[58%] w-[52%] rounded-xl object-cover shadow-sm"
          />
        ) : (
          <Placeholder className="absolute bottom-0 right-0 h-[58%] w-[52%] rounded-xl" />
        )}

        {photos[2] && (
          <img
            src={photos[2].url}
            alt={photos[2].alt}
            className="absolute right-2 top-4 hidden h-[38%] w-[36%] rounded-xl object-cover shadow-sm xl:block"
          />
        )}
      </div>
    </>
  );
}
