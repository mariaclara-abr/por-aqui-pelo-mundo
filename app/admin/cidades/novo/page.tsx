import { getCountries } from "@/lib/queries";
import CityForm from "@/components/admin/CityForm";

export default async function NovaCidadePage() {
  const countries = await getCountries();

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Nova cidade</h1>
      <div className="mt-6">
        <CityForm countries={countries} />
      </div>
    </div>
  );
}
