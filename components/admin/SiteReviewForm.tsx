"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import FormField, { inputClass } from "@/components/admin/FormField";
import type { Database } from "@/types/database";

type SiteReview = Database["public"]["Tables"]["site_reviews"]["Row"];

export default function SiteReviewForm({ review }: { review?: SiteReview }) {
  const router = useRouter();

  const [reviewerName, setReviewerName] = useState(
    review?.reviewer_name ?? "",
  );
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [comment, setComment] = useState(review?.comment ?? "");
  const [order, setOrder] = useState(review?.order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const supabase = createClient();
    const payload = {
      reviewer_name: reviewerName,
      rating,
      comment,
      order,
    };

    const { error } = review
      ? await supabase
          .from("site_reviews")
          .update(payload)
          .eq("id", review.id)
      : await supabase.from("site_reviews").insert(payload);

    setSaving(false);

    if (error) {
      setError("Não foi possível salvar. Tente novamente.");
      return;
    }

    router.push("/admin/avaliacoes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <FormField
        label="Nome de quem avaliou"
        htmlFor="reviewerName"
        helpText="Como vai aparecer no depoimento. Ex: Ana e família."
      >
        <input
          id="reviewerName"
          className={inputClass}
          value={reviewerName}
          onChange={(event) => setReviewerName(event.target.value)}
          required
        />
      </FormField>

      <FormField label="Avaliação" htmlFor="rating">
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 text-sm text-tinta"
            >
              <input
                type="radio"
                name="rating"
                checked={rating === value}
                onChange={() => setRating(value)}
              />
              <span className="text-terracota">
                {"★".repeat(value)}
                <span className="text-tinta/20">{"★".repeat(5 - value)}</span>
              </span>
            </label>
          ))}
        </div>
      </FormField>

      <FormField
        label="Comentário"
        htmlFor="comment"
        helpText="O depoimento real da pessoa, transcrito como recebido (WhatsApp, Instagram, etc)."
      >
        <textarea
          id="comment"
          className={inputClass}
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Ordem de exibição"
        htmlFor="order"
        helpText="Menor número aparece primeiro. Depoimentos com a mesma ordem são ordenados pelos mais recentes."
      >
        <input
          id="order"
          type="number"
          className={inputClass}
          value={order}
          onChange={(event) => setOrder(Number(event.target.value))}
        />
      </FormField>

      {error && <p className="text-sm text-terracota">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
