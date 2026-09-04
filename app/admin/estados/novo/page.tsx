import { getCountries } from "@/lib/queries";
import StateForm from "@/components/admin/StateForm";

export default async function NovoEstadoPage() {
  const countries = await getCountries();

  return (
    <div>
      <h1 className="font-serif text-2xl text-tinta">Novo estado</h1>
      <div className="mt-6">
        <StateForm countries={countries} />
      </div>
    </div>
  );
}
