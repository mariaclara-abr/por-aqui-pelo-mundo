import { notFound } from "next/navigation";
import { getStateById, getCountries } from "@/lib/queries";
import StateForm from "@/components/admin/StateForm";

export default async function EditarEstadoPage(
  props: PageProps<"/admin/estados/[id]">,
) {
  const { id } = await props.params;
  const state = await getStateById(id).catch(() => null);

  if (!state) {
    notFound();
  }

  const countries = await getCountries();

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Editar {state.name}</h1>
      <div className="mt-6">
        <StateForm state={state} countries={countries} />
      </div>
    </div>
  );
}
