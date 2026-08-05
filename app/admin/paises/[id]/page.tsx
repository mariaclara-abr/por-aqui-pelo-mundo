import { notFound } from "next/navigation";
import { getCountryById } from "@/lib/queries";
import CountryForm from "@/components/admin/CountryForm";

export default async function EditarPaisPage(
  props: PageProps<"/admin/paises/[id]">,
) {
  const { id } = await props.params;
  const country = await getCountryById(id).catch(() => null);

  if (!country) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">
        Editar {country.name}
      </h1>
      <div className="mt-6">
        <CountryForm country={country} />
      </div>
    </div>
  );
}
