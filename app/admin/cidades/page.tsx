import Link from "next/link";
import { getCitiesWithCountry } from "@/lib/queries";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminCidadesPage() {
  const cities = await getCitiesWithCountry();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-tinta">Cidades</h1>
        <Link
          href="/admin/cidades/novo"
          className="rounded-full bg-terracota px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
        >
          + Nova cidade
        </Link>
      </div>

      {cities.length === 0 ? (
        <p className="mt-8 text-oliva">Nenhuma cidade cadastrada ainda.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {cities.map((city) => (
            <li
              key={city.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-oliva/15 bg-branco p-3"
            >
              <div className="flex items-center gap-3">
                {city.cover_image_url ? (
                  <img
                    src={city.cover_image_url}
                    alt=""
                    className="h-10 w-14 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-14 rounded bg-areia" />
                )}
                <div>
                  <p className="flex items-center gap-2 text-tinta">
                    {city.name}
                    {city.status === "draft" && (
                      <span className="rounded-full bg-terracota/10 px-2.5 py-0.5 text-xs font-medium text-terracota">
                        Em breve
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-oliva">
                    {city.states ? `${city.states.name}, ` : ""}
                    {city.countries.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/cidades/${city.id}`}
                  className="text-sm text-terracota hover:underline"
                >
                  Editar
                </Link>
                <DeleteButton
                  table="cities"
                  id={city.id}
                  confirmMessage={`Excluir "${city.name}"? Isso também apaga todas as atrações dessa cidade.`}
                  redirectTo="/admin/cidades"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
