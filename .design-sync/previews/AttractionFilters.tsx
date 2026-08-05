import AttractionFilters from "@/components/AttractionFilters";

const tags = [
  { id: "1", name: "Ideal para famílias", slug: "ideal-para-familias" },
  { id: "2", name: "Crianças pequenas", slug: "criancas-pequenas" },
  { id: "3", name: "Gratuito", slug: "gratuito" },
  { id: "4", name: "Reserva necessária", slug: "reserva-necessaria" },
] as any;

export function Default() {
  return (
    <div className="bg-branco p-6">
      <AttractionFilters tags={tags} />
    </div>
  );
}
