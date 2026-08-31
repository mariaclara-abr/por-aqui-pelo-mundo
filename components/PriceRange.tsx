export const PRICE_RANGE_LABELS: Record<number, string> = {
  1: "Econômico",
  2: "Moderado",
  3: "Caro",
  4: "Muito caro",
};

export default function PriceRange({
  value,
  showLabel = true,
}: {
  value: number | null;
  showLabel?: boolean;
}) {
  if (value == null) return null;

  const label = PRICE_RANGE_LABELS[value] ?? "";

  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={`Faixa de preço: ${label}`}
    >
      <span aria-hidden="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={index < value ? "text-terracota" : "text-tinta/15"}
          >
            $
          </span>
        ))}
      </span>
      {showLabel && <span>{label}</span>}
    </span>
  );
}
