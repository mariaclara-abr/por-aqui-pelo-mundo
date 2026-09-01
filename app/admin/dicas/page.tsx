import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminDicasPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("travel_tips")
    .select("*")
    .order("category")
    .order("order");

  if (error) throw error;

  const tips = data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-tinta">Dicas de viagem</h1>
        <Link
          href="/admin/dicas/novo"
          className="rounded-full bg-terracota px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
        >
          + Nova dica
        </Link>
      </div>
      <p className="mt-1 text-sm text-oliva">
        Cards exibidos em /dicas-de-viagem, agrupados pela categoria.
      </p>

      {tips.length === 0 ? (
        <p className="mt-6 text-oliva">Nenhuma dica cadastrada ainda.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {tips.map((tip) => (
            <li
              key={tip.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-oliva/15 bg-branco p-3"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-oliva">
                  {tip.category}
                </span>
                <span className="text-tinta">{tip.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/dicas/${tip.id}`}
                  className="text-sm text-terracota hover:underline"
                >
                  Editar
                </Link>
                <DeleteButton
                  table="travel_tips"
                  id={tip.id}
                  confirmMessage={`Excluir a dica "${tip.title}"?`}
                  redirectTo="/admin/dicas"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
