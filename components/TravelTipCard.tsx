import { renderBold } from "@/lib/text-formatting";
import PremiumStamp from "@/components/premium/PremiumStamp";

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
          className="absolute bottom-2 right-3 z-10 h-14 w-14 sm:h-16 sm:w-16"
        >
          <PremiumStamp decorative delay={0.1} className="h-full w-full" />
        </span>
      )}

      <span className="relative z-10 text-[10px] font-semibold tracking-[0.18em] text-oliva/65">
        {String(chapter).padStart(2, "0")}.{String(position).padStart(2, "0")}
      </span>
      <h3 className="relative z-10 mt-2 font-serif text-xl leading-snug sm:text-[1.35rem]">
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
