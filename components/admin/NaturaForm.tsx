"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import FormField, { inputClass } from "@/components/admin/FormField";
import type { Database } from "@/types/database";

type Settings = Database["public"]["Tables"]["natura_settings"]["Row"];

export default function NaturaForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [code, setCode] = useState(settings.coupon_code);
  const [expires, setExpires] = useState(settings.coupon_expires_on ?? "");
  const [url, setUrl] = useState(settings.store_url);
  const [conditions, setConditions] = useState(settings.conditions);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    const { error } = await createClient()
      .from("natura_settings")
      .update({
        coupon_code: code.trim(),
        coupon_expires_on: expires || null,
        store_url: url.trim(),
        conditions: conditions.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    setStatus(error ? "error" : "saved");
    if (!error) router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <FormField
        label="Código do cupom vigente"
        htmlFor="code"
        helpText="Deixe vazio para esconder o cupom. A descrição e o botão continuam aparecendo."
      >
        <input id="code" className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} />
      </FormField>
      <FormField
        label="Válido até"
        htmlFor="expires"
        helpText="Só aparece aqui, nunca para o visitante. Depois desse dia o cupom some sozinho."
      >
        <input id="expires" type="date" className={inputClass} value={expires} onChange={(e) => setExpires(e.target.value)} />
      </FormField>
      <FormField label="Link da loja Natura" htmlFor="url" helpText="Abre em nova aba em todos os cards da Natura.">
        <input id="url" type="url" className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} required />
      </FormField>
      <FormField label="Condições do benefício" htmlFor="conditions" helpText="Opcional. Aparece em letra pequena abaixo do cupom.">
        <textarea id="conditions" rows={2} className={inputClass} value={conditions} onChange={(e) => setConditions(e.target.value)} />
      </FormField>

      {status === "error" && <p className="text-sm text-terracota">Não foi possível salvar. Tente novamente.</p>}
      {status === "saved" && <p className="text-sm text-oliva">Alterações salvas.</p>}

      <div>
        <button type="submit" disabled={status === "saving"} className="btn btn-terracota btn-cheio">
          {status === "saving" ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
