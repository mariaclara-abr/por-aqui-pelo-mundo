"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import FormField, { inputClass } from "@/components/admin/FormField";
import PreviewModal from "@/components/admin/PreviewModal";
import TravelTipCard from "@/components/TravelTipCard";
import type { Database } from "@/types/database";

type TravelTip = Database["public"]["Tables"]["travel_tips"]["Row"];

export default function TravelTipForm({ tip }: { tip?: TravelTip }) {
  const router = useRouter();

  const [category, setCategory] = useState(tip?.category ?? "");
  const [title, setTitle] = useState(tip?.title ?? "");
  const [content, setContent] = useState(tip?.content ?? "");
  const [order, setOrder] = useState(tip?.order ?? 0);
  const [isPremium, setIsPremium] = useState(tip?.is_premium ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const supabase = createClient();
    const payload = { category, title, content, order, is_premium: isPremium };

    const { error } = tip
      ? await supabase.from("travel_tips").update(payload).eq("id", tip.id)
      : await supabase.from("travel_tips").insert(payload);

    setSaving(false);

    if (error) {
      setError("Não foi possível salvar. Tente novamente.");
      return;
    }

    router.push("/admin/dicas");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <FormField
        label="Categoria"
        htmlFor="category"
        helpText="Agrupa os cards na página de dicas, com esse texto como título da seção. Ex: Disney, Aeroportos, Documentação."
      >
        <input
          id="category"
          className={inputClass}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Título do card"
        htmlFor="title"
        helpText="É só isso que aparece antes do clique: capriche para despertar curiosidade. Envolva 1 ou 2 palavras-chave com ** para destacar em negrito, ex: 'O item **grátis** que ninguém te conta na Disney'."
      >
        <input
          id="title"
          className={inputClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Conteúdo"
        htmlFor="content"
        helpText="Revelado quando a pessoa clica no card. Pode ter várias linhas e links."
      >
        <textarea
          id="content"
          className={inputClass}
          rows={8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Ordem de exibição"
        htmlFor="order"
        helpText="Controla a ordem dos cards e das seções (menor número aparece primeiro)."
      >
        <input
          id="order"
          type="number"
          className={inputClass}
          value={order}
          onChange={(event) => setOrder(Number(event.target.value))}
        />
      </FormField>

      <FormField
        label="Card Premium"
        htmlFor="isPremium"
        helpText="Enquanto marcado, o card exibe o selo de coroa e, ao clicar, quem não é assinante Premium vê o pop-up de upgrade em vez do conteúdo."
      >
        <label className="flex items-center gap-2 text-sm text-tinta">
          <input
            id="isPremium"
            type="checkbox"
            checked={isPremium}
            onChange={(event) => setIsPremium(event.target.checked)}
          />
          Marcar como conteúdo Premium
        </label>
      </FormField>

      {error && <p className="text-sm text-terracota">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="rounded-full border border-oliva/30 px-6 py-2.5 text-sm font-medium text-oliva transition-colors hover:bg-areia"
        >
          Visualizar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>

      {showPreview && (
        <PreviewModal onClose={() => setShowPreview(false)}>
          <div className="mx-auto max-w-xs p-6">
            <TravelTipCard
              title={title || "Título do card"}
              isPremium={isPremium}
            />
          </div>
        </PreviewModal>
      )}
    </form>
  );
}
