"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function DeleteButton({
  table,
  id,
  confirmMessage,
  redirectTo,
}: {
  table: "countries" | "cities" | "attractions" | "site_reviews" | "travel_tips";
  id: string;
  confirmMessage: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq("id", id);

    setDeleting(false);

    if (error) {
      setError("Não foi possível excluir. Tente novamente.");
      return;
    }

    setConfirming(false);
    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-tinta">{confirmMessage}</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="font-medium text-terracota hover:underline disabled:opacity-60"
        >
          {deleting ? "Excluindo..." : "Sim, excluir"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-oliva hover:underline"
        >
          Cancelar
        </button>
        {error && <span className="text-terracota">{error}</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-sm text-terracota hover:underline"
    >
      Excluir
    </button>
  );
}
