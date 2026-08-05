import { notFound } from "next/navigation";
import { getCityById, getCountries } from "@/lib/queries";
import CityForm from "@/components/admin/CityForm";

export default async function EditarCidadePage(
  props: PageProps<"/admin/cidades/[id]">,
) {
  const { id } = await props.params;
  const city = await getCityById(id).catch(() => null);

  if (!city) {
    notFound();
  }

  const countries = await getCountries();

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Editar {city.name}</h1>
      <div className="mt-6">
        <CityForm city={city} countries={countries} />
      </div>
    </div>
  );
}
