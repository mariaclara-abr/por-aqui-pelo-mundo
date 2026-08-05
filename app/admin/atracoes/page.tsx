import Link from "next/link";
import { getAllAttractions } from "@/lib/queries";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminAtracoesPage() {
  const attractions = await getAllAttractions();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-tinta">Atrações</h1>
        <Link
          href="/admin/atracoes/novo"
          className="rounded-full bg-terracota px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
        >
          + Nova atração
        </Link>
      </div>

      {attractions.length === 0 ? (
        <p className="mt-8 text-oliva">Nenhuma atração cadastrada ainda.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {attractions.map((attraction) => {
            const cover = [...attraction.attraction_photos].sort(
              (a, b) => a.order - b.order,
            )[0];
            const categoryLabel =
              ATTRACTION_CATEGORIES.find((c) => c.value === attraction.category)
                ?.label ?? attraction.category;

            return (
              <li
                key={attraction.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-oliva/15 bg-branco p-3"
              >
                <div className="flex items-center gap-3">
                  {cover ? (
                    <img
                      src={cover.url}
                      alt=""
                      className="h-10 w-14 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-14 rounded bg-areia" />
                  )}
                  <div>
                    <p className="text-tinta">{attraction.name}</p>
                    <p className="text-xs text-oliva">
                      {categoryLabel} · {attraction.cities.name},{" "}
                      {attraction.cities.countries.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/atracoes/${attraction.id}`}
                    className="text-sm text-terracota hover:underline"
                  >
                    Editar
                  </Link>
                  <DeleteButton
                    table="attractions"
                    id={attraction.id}
                    confirmMessage={`Excluir "${attraction.name}"?`}
                    redirectTo="/admin/atracoes"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
