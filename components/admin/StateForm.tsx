"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { slugify } from "@/lib/slugify";
import FormField, { inputClass } from "@/components/admin/FormField";
import CoverImageUploader from "@/components/admin/CoverImageUploader";
import PreviewModal from "@/components/admin/PreviewModal";
import StatePreview from "@/components/admin/previews/StatePreview";
import type { Database } from "@/types/database";

type State = Database["public"]["Tables"]["states"]["Row"];
type Country = Database["public"]["Tables"]["countries"]["Row"];

export default function StateForm({
  state,
  countries,
}: {
  state?: State;
  countries: Country[];
}) {
  const router = useRouter();
  const [countryId, setCountryId] = useState(state?.country_id ?? "");
  const [name, setName] = useState(state?.name ?? "");
  const [description, setDescription] = useState(state?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    state?.cover_image_url ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const slug = slugify(name);
  const selectedCountryName =
    countries.find((country) => country.id === countryId)?.name ?? "";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!countryId) {
      setError("Escolha o país desse estado.");
      return;
    }

    setSaving(true);

    const supabase = createClient();
    const payload = {
      country_id: countryId,
      name,
      slug,
      description: description || null,
      cover_image_url: coverImageUrl,
    };

    const { error } = state
      ? await supabase.from("states").update(payload).eq("id", state.id)
      : await supabase.from("states").insert(payload);

    setSaving(false);

    if (error) {
      setError(
        error.code === "23505"
          ? "Já existe um estado com esse nome."
          : "Não foi possível salvar. Tente novamente.",
      );
      return;
    }

    router.push("/admin/estados");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <FormField
        label="País"
        htmlFor="country"
        helpText="A que país esse estado pertence."
      >
        <select
          id="country"
          className={inputClass}
          value={countryId}
          onChange={(event) => setCountryId(event.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Nome do estado"
        htmlFor="name"
        helpText="Como vai aparecer para os visitantes. Ex: Santa Catarina, Rio de Janeiro."
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
        helpText="Um resumo curto sobre o estado (opcional)."
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
        helpText="Aparece nos cards da página do país."
      >
        <CoverImageUploader
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          folder="states"
        />
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
          <StatePreview
            countryName={selectedCountryName}
            name={name}
            description={description || null}
            coverImageUrl={coverImageUrl}
          />
        </PreviewModal>
      )}
    </form>
  );
}
