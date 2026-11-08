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
      className={`btn btn-sm ${
        active ? "border-terracota bg-terracota text-white" : "btn-terracota"
      }`}
    >
      {children}
    </button>
  );
}
