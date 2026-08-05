import { notFound } from "next/navigation";
import { getAttractionById, getCitiesWithCountry, getTags } from "@/lib/queries";
import AttractionForm from "@/components/admin/AttractionForm";

export default async function EditarAtracaoPage(
  props: PageProps<"/admin/atracoes/[id]">,
) {
  const { id } = await props.params;
  const attraction = await getAttractionById(id).catch(() => null);

  if (!attraction) {
    notFound();
  }

  const [cities, tags] = await Promise.all([getCitiesWithCountry(), getTags()]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">
        Editar {attraction.name}
      </h1>
      <div className="mt-6">
        <AttractionForm attraction={attraction} cities={cities} tags={tags} />
      </div>
    </div>
  );
}
