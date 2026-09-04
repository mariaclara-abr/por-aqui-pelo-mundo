import { getCountries, getStates } from "@/lib/queries";
import CityForm from "@/components/admin/CityForm";

export default async function NovaCidadePage() {
  const [countries, states] = await Promise.all([
    getCountries(),
    getStates(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Nova cidade</h1>
      <div className="mt-6">
        <CityForm countries={countries} states={states} />
      </div>
    </div>
  );
}
