import { renderBold } from "@/lib/text-formatting";

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 7.5l3 2 4-4.5 4 4.5 3-2-1.2 7.5H4.2L3 7.5z" />
      <rect x="4" y="15.5" width="12" height="1.8" rx="0.9" />
    </svg>
  );
}

export default function TravelTipCard({
  title,
  isPremium = false,
  chapter = 1,
  position = 1,
  tone = "olive",
  featured = false,
  onClick,
}: {
  title: string;
  isPremium?: boolean;
  chapter?: number;
  position?: number;
  tone?: "olive" | "terracotta";
  featured?: boolean;
  onClick?: () => void;
}) {
  const solidSurface =
    tone === "olive"
      ? "border-oliva bg-oliva text-areia"
      : "border-terracota bg-terracota text-white";
  const paperSurface =
    tone === "olive"
      ? "border-oliva/20 bg-branco/60 text-tinta hover:border-oliva/45"
      : "border-terracota/25 bg-branco/60 text-tinta hover:border-terracota/50";
  const metaColor = featured ? "text-current opacity-65" : "text-oliva/65";
  const linkColor = featured
    ? "text-current"
    : tone === "olive"
      ? "text-oliva"
      : "text-terracota";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${isPremium ? "Dica Premium: " : "Abrir dica: "}${title}`}
      className={`group relative flex h-full min-h-44 flex-col items-start overflow-hidden rounded-card border p-5 text-left transition-[transform,border-color] duration-200 hover:-translate-y-0.5 sm:min-h-48 sm:p-6 ${
        featured ? solidSurface : paperSurface
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${
          featured
            ? "bg-branco/25"
            : tone === "olive"
              ? "bg-oliva"
              : "bg-terracota"
        }`}
      />

      {isPremium && (
        <span
          title="Conteúdo Premium"
          className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border ${
            featured
              ? "border-branco/30 bg-branco/15 text-branco"
              : "border-terracota/15 bg-terracota text-white"
          }`}
        >
          <CrownIcon className="h-3.5 w-3.5" />
        </span>
      )}

      <span
        className={`text-[10px] font-semibold tracking-[0.18em] ${metaColor}`}
      >
        {String(chapter).padStart(2, "0")}.{String(position).padStart(2, "0")}
      </span>
      <h3
        className={`mt-2 font-serif text-xl leading-snug sm:text-[1.35rem] ${
          isPremium ? "pr-8" : ""
        }`}
      >
        {renderBold(title)}
      </h3>
      <span
        className={`mt-auto pt-6 text-xs font-semibold uppercase tracking-[0.13em] ${linkColor}`}
      >
        {isPremium ? "Acessar dica" : "Abrir anotação"}
        <span
          aria-hidden="true"
          className="ml-2 inline-block text-base leading-none transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </button>
  );
}
