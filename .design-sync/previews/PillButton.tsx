import PillButton from "@/components/PillButton";

export function ActiveAndInactive() {
  return (
    <div className="flex gap-3 bg-branco p-6">
      <PillButton active onClick={() => {}}>
        Museus
      </PillButton>
      <PillButton active={false} onClick={() => {}}>
        Restaurantes
      </PillButton>
      <PillButton active={false} onClick={() => {}}>
        Natureza
      </PillButton>
    </div>
  );
}

export function FilterRow() {
  const categories = ["Todos", "Gratuito", "Imperdível", "Alta temporada"];
  return (
    <div className="flex flex-wrap gap-2 bg-areia p-6">
      {categories.map((label, i) => (
        <PillButton key={label} active={i === 0} onClick={() => {}}>
          {label}
        </PillButton>
      ))}
    </div>
  );
}
