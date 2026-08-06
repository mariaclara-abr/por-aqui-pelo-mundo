export const RATING_LABELS: Record<number, string> = {
  5: "Imperdível",
  4: "Vale muito a pena",
  3: "Boa opção",
  2: "Só se sobrar tempo",
  1: "Pode pular",
};

const STAR_SIZES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

export default function CurationRating({
  rating,
  showLabel = true,
  size = "md",
  alignEnd = false,
}: {
  rating: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  alignEnd?: boolean;
}) {
  const label = RATING_LABELS[rating] ?? "";

  return (
    <div
      className={`flex flex-col items-start gap-1 ${alignEnd ? "sm:items-end" : ""}`}
      aria-label={`Avaliação da curadoria: ${rating} de 5, ${label}`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <svg
            key={index}
            viewBox="0 0 20 20"
            className={`${STAR_SIZES[size]} ${
              index < rating ? "fill-terracota" : "fill-tinta/15"
            }`}
          >
            <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
          </svg>
        ))}
      </div>
      {showLabel && (
        <span className="font-serif text-lg text-tinta">{label}</span>
      )}
    </div>
  );
}
