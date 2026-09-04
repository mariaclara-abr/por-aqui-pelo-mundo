import Link from "next/link";
import { getStatesWithCountry } from "@/lib/queries";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminEstadosPage() {
  const states = await getStatesWithCountry();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-tinta">Estados</h1>
        <Link
          href="/admin/estados/novo"
          className="rounded-full bg-terracota px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
        >
          + Novo estado
        </Link>
      </div>

      {states.length === 0 ? (
        <p className="mt-8 text-oliva">Nenhum estado cadastrado ainda.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {states.map((state) => (
            <li
              key={state.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-oliva/15 bg-branco p-3"
            >
              <div className="flex items-center gap-3">
                {state.cover_image_url ? (
                  <img
                    src={state.cover_image_url}
                    alt=""
                    className="h-10 w-14 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-14 rounded bg-areia" />
                )}
                <div>
                  <p className="text-tinta">{state.name}</p>
                  <p className="text-xs text-oliva">{state.countries.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/estados/${state.id}`}
                  className="text-sm text-terracota hover:underline"
                >
                  Editar
                </Link>
                <DeleteButton
                  table="states"
                  id={state.id}
                  confirmMessage={`Excluir "${state.name}"? Isso também apaga todas as cidades desse estado.`}
                  redirectTo="/admin/estados"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
