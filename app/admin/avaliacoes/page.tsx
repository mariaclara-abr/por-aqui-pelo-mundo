import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import DeleteButton from "@/components/admin/DeleteButton";
import PendingSiteReviewsList from "@/components/admin/PendingSiteReviewsList";

export default async function AdminAvaliacoesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_reviews")
    .select("*")
    .order("order")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const reviews = data ?? [];
  const pending = reviews.filter((review) => review.status === "pendente");
  const resolved = reviews.filter((review) => review.status !== "pendente");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-tinta">Avaliações do site</h1>
        <Link
          href="/admin/avaliacoes/novo"
          className="rounded-full bg-terracota px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
        >
          + Nova avaliação
        </Link>
      </div>
      <p className="mt-1 text-sm text-oliva">
        Depoimentos exibidos na página inicial. Visitantes logados também podem
        enviar a própria avaliação pela home. Elas caem aqui como pendentes
        até você aprovar.
      </p>

      <h2 className="mt-8 font-serif text-lg text-tinta">
        Pendentes de aprovação{pending.length > 0 ? ` (${pending.length})` : ""}
      </h2>
      <div className="mt-3">
        <PendingSiteReviewsList initialReviews={pending} />
      </div>

      <h2 className="mt-10 font-serif text-lg text-tinta">Todas as avaliações</h2>
      {resolved.length === 0 ? (
        <p className="mt-4 text-oliva">Nenhuma avaliação cadastrada ainda.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {resolved.map((review) => (
            <li
              key={review.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-oliva/15 bg-branco p-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-terracota">
                    {"★".repeat(review.rating)}
                    <span className="text-tinta/20">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </span>
                  <span className="text-tinta">{review.reviewer_name}</span>
                  {review.status === "oculta" && (
                    <span className="rounded-full bg-oliva/10 px-2 py-0.5 text-xs text-oliva">
                      Oculta
                    </span>
                  )}
                </div>
                <p className="max-w-md truncate text-sm text-oliva">
                  {review.comment}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/avaliacoes/${review.id}`}
                  className="text-sm text-terracota hover:underline"
                >
                  Editar
                </Link>
                <DeleteButton
                  table="site_reviews"
                  id={review.id}
                  confirmMessage={`Excluir avaliação de "${review.reviewer_name}"?`}
                  redirectTo="/admin/avaliacoes"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
