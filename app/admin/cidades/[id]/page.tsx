import { notFound } from "next/navigation";
import { getCityById, getCountries, getStates } from "@/lib/queries";
import CityForm from "@/components/admin/CityForm";

export default async function EditarCidadePage(
  props: PageProps<"/admin/cidades/[id]">,
) {
  const { id } = await props.params;
  const city = await getCityById(id).catch(() => null);

  if (!city) {
    notFound();
  }

  const [countries, states] = await Promise.all([
    getCountries(),
    getStates(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Editar {city.name}</h1>
      <div className="mt-6">
        <CityForm city={city} countries={countries} states={states} />
      </div>
    </div>
  );
}
