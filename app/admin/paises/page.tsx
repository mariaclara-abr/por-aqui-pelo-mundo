import Link from "next/link";
import { getCountries } from "@/lib/queries";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPaisesPage() {
  const countries = await getCountries();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-tinta">Países</h1>
        <Link
          href="/admin/paises/novo"
          className="rounded-full bg-terracota px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
        >
          + Novo país
        </Link>
      </div>

      {countries.length === 0 ? (
        <p className="mt-8 text-oliva">Nenhum país cadastrado ainda.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {countries.map((country) => (
            <li
              key={country.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-oliva/15 bg-branco p-3"
            >
              <div className="flex items-center gap-3">
                {country.cover_image_url ? (
                  <img
                    src={country.cover_image_url}
                    alt=""
                    className="h-10 w-14 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-14 rounded bg-areia" />
                )}
                <span className="text-tinta">{country.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/paises/${country.id}`}
                  className="text-sm text-terracota hover:underline"
                >
                  Editar
                </Link>
                <DeleteButton
                  table="countries"
                  id={country.id}
                  confirmMessage={`Excluir "${country.name}"? Isso também apaga todas as cidades e atrações desse país.`}
                  redirectTo="/admin/paises"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
