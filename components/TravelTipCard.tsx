import { renderBold } from "@/lib/text-formatting";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

export default function TravelTipCard({
  title,
  isPremium = false,
  chapter = 1,
  position = 1,
  tone = "olive",
  onClick,
}: {
  title: string;
  isPremium?: boolean;
  chapter?: number;
  position?: number;
  tone?: "olive" | "terracotta";
  onClick?: () => void;
}) {
  const border = tone === "olive" ? "border-oliva/20" : "border-terracota/25";
  const accent = tone === "olive" ? "bg-oliva" : "bg-terracota";
  const linkColor = tone === "olive" ? "text-oliva" : "text-terracota";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${isPremium ? "Dica Premium: " : "Abrir dica: "}${title}`}
      className={`group relative flex h-full min-h-44 flex-col items-start overflow-hidden rounded-card border ${border} bg-branco p-5 text-left text-tinta transition-transform duration-200 hover:scale-[1.02] sm:min-h-48 sm:p-6`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/dicas-card-background.jpg')] bg-cover bg-center opacity-60 transition-opacity duration-200 group-hover:opacity-75"
      />

      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 z-10 h-1 ${accent}`}
      />

      {isPremium && (
        <span
          title="Conteúdo Premium"
          className="absolute right-4 top-4 z-10 text-terracota"
        >
          <SparkleIcon className="h-6 w-6" />
        </span>
      )}

      <span className="relative z-10 text-[10px] font-semibold tracking-[0.18em] text-oliva/65">
        {String(chapter).padStart(2, "0")}.{String(position).padStart(2, "0")}
      </span>
      <h3
        className={`relative z-10 mt-2 font-serif text-xl leading-snug sm:text-[1.35rem] ${
          isPremium ? "pr-8" : ""
        }`}
      >
        {renderBold(title)}
      </h3>
      <span
        className={`relative z-10 mt-auto pt-6 text-xs font-semibold uppercase tracking-[0.13em] ${linkColor}`}
      >
        Abrir anotação
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
