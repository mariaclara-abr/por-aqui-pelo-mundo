"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { slugify } from "@/lib/slugify";
import FormField, { inputClass } from "@/components/admin/FormField";
import CoverImageUploader from "@/components/admin/CoverImageUploader";
import type { Database } from "@/types/database";

type Country = Database["public"]["Tables"]["countries"]["Row"];

export default function CountryForm({ country }: { country?: Country }) {
  const router = useRouter();
  const [name, setName] = useState(country?.name ?? "");
  const [description, setDescription] = useState(country?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    country?.cover_image_url ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const slug = slugify(name);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const supabase = createClient();
    const payload = {
      name,
      slug,
      description: description || null,
      cover_image_url: coverImageUrl,
    };

    const { error } = country
      ? await supabase.from("countries").update(payload).eq("id", country.id)
      : await supabase.from("countries").insert(payload);

    setSaving(false);

    if (error) {
      setError(
        error.code === "23505"
          ? "Já existe um país com esse nome."
          : "Não foi possível salvar. Tente novamente.",
      );
      return;
    }

    router.push("/admin/paises");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <FormField
        label="Nome do país"
        htmlFor="name"
        helpText="Como vai aparecer para os visitantes. Ex: Itália, Portugal, Japão."
      >
        <input
          id="name"
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </FormField>

      {name && <p className="-mt-3 text-xs text-oliva">Endereço: /{slug}</p>}

      <FormField
        label="Descrição"
        htmlFor="description"
        helpText="Um resumo curto sobre o país (opcional)."
      >
        <textarea
          id="description"
          className={inputClass}
          rows={3}
          value={description ?? ""}
          onChange={(event) => setDescription(event.target.value)}
        />
      </FormField>

      <FormField
        label="Foto de capa"
        htmlFor="cover"
        helpText="Aparece nos cards da página inicial."
      >
        <CoverImageUploader
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          folder="countries"
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
