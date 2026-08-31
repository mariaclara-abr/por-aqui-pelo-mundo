"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase-browser";
import EmojiPickerButton from "@/components/EmojiPickerButton";

export default function SiteReviewSubmitForm() {
  const { user, profile, loading: authLoading } = useAuth();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean | undefined>(
    undefined,
  );
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const checking = !authLoading && !!user && alreadyReviewed === undefined;

  useEffect(() => {
    if (authLoading || !user) return;

    const supabase = createClient();
    supabase
      .from("site_reviews")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAlreadyReviewed(!!data);
      });
  }, [authLoading, user]);

  async function handleSubmit() {
    if (!user) return;
    const trimmed = comment.trim();
    if (!trimmed) return;

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.from("site_reviews").insert({
      user_id: user.id,
      rating,
      comment: trimmed,
      reviewer_name: profile?.display_name || profile?.username || "Viajante",
    });

    setSaving(false);

    if (error) {
      setError(
        error.code === "23505"
          ? "Você já enviou uma avaliação."
          : "Não foi possível enviar. Tente novamente.",
      );
      return;
    }

    setJustSubmitted(true);
  }

  if (authLoading || checking) return null;

  if (justSubmitted || alreadyReviewed) {
    return (
      <p className="text-center text-sm text-oliva">
        Sua avaliação já está publicada aqui embaixo. Obrigada!
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-sm text-oliva">
        <Link href="/entrar" className="font-medium text-terracota hover:underline">
          Entre na sua conta
        </Link>{" "}
        para deixar sua avaliação sobre o site.
      </p>
    );
  }

  if (!open) {
    return (
      <div className="text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-terracota px-6 py-2.5 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10"
        >
          Deixar minha avaliação
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 rounded-xl bg-branco p-6 shadow-sm">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium text-tinta">Sua avaliação</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} de 5 estrelas`}
              className="p-0.5"
            >
              <svg
                viewBox="0 0 20 20"
                className={`h-6 w-6 ${
                  value <= rating ? "fill-terracota" : "fill-tinta/15"
                }`}
              >
                <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <EmojiPickerButton
          value={comment}
          onChange={setComment}
          textareaRef={commentRef}
        />
      </div>

      <textarea
        ref={commentRef}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        rows={3}
        placeholder="Conte como foi usar o site para planejar sua viagem..."
        className="w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 text-sm text-tinta focus:border-terracota focus:outline-none"
      />

      {error && <p className="text-center text-sm text-terracota">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving || !comment.trim()}
        className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
      >
        {saving ? "Enviando..." : "Enviar avaliação"}
      </button>
    </div>
  );
}
