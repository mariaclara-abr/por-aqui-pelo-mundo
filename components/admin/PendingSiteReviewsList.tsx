"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { Database } from "@/types/database";

type SiteReview = Database["public"]["Tables"]["site_reviews"]["Row"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PendingReviewCard({
  review,
  onResolved,
}: {
  review: SiteReview;
  onResolved: (id: string) => void;
}) {
  const [pending, setPending] = useState<"aprovada" | "oculta" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resolve(status: "aprovada" | "oculta") {
    setPending(status);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("site_reviews")
      .update({ status })
      .eq("id", review.id);

    if (error) {
      setError("Não foi possível salvar. Tente novamente.");
      setPending(null);
      return;
    }

    onResolved(review.id);
  }

  return (
    <div className="rounded-xl border border-oliva/15 bg-branco p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-terracota">
          {"★".repeat(review.rating)}
          <span className="text-tinta/20">{"★".repeat(5 - review.rating)}</span>
        </span>
        <span className="text-xs text-oliva">{formatDate(review.created_at)}</span>
      </div>
      <p className="mt-2 leading-relaxed text-tinta">{review.comment}</p>
      <p className="mt-1 text-sm font-medium text-tinta">{review.reviewer_name}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => resolve("aprovada")}
          disabled={pending !== null}
          className="rounded-full bg-terracota px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {pending === "aprovada" ? "Aprovando..." : "Aprovar"}
        </button>
        <button
          type="button"
          onClick={() => resolve("oculta")}
          disabled={pending !== null}
          className="rounded-full border border-oliva/30 px-4 py-1.5 text-xs text-oliva transition-colors hover:bg-areia disabled:opacity-60"
        >
          {pending === "oculta" ? "Ocultando..." : "Ocultar"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-terracota">{error}</p>}
    </div>
  );
}

export default function PendingSiteReviewsList({
  initialReviews,
}: {
  initialReviews: SiteReview[];
}) {
  const [reviews, setReviews] = useState(initialReviews);

  if (reviews.length === 0) {
    return (
      <p className="text-oliva">Nenhuma avaliação pendente no momento. Tudo em dia!</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <PendingReviewCard
          key={review.id}
          review={review}
          onResolved={(id) =>
            setReviews((current) => current.filter((r) => r.id !== id))
          }
        />
      ))}
    </div>
  );
}
