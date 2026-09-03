import { getAllAttractions, getCitiesWithCountry, getTags } from "@/lib/queries";
import AttractionForm from "@/components/admin/AttractionForm";

export default async function NovaAtracaoPage() {
  const [cities, tags, allAttractions] = await Promise.all([
    getCitiesWithCountry(),
    getTags(),
    getAllAttractions(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Nova atração</h1>
      <div className="mt-6">
        <AttractionForm cities={cities} tags={tags} allAttractions={allAttractions} />
      </div>
    </div>
  );
}
