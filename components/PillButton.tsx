"use client";

export default function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active
          ? "border-terracota bg-terracota text-white"
          : "border-terracota/30 text-terracota hover:border-terracota"
      }`}
    >
      {children}
    </button>
  );
}
