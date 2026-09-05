"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { slugify } from "@/lib/slugify";
import FormField, { inputClass } from "@/components/admin/FormField";
import CoverImageUploader from "@/components/admin/CoverImageUploader";
import PreviewModal from "@/components/admin/PreviewModal";
import CityPreview from "@/components/admin/previews/CityPreview";
import { imagePositionToJson, parseImagePosition, type ImagePosition } from "@/lib/image-position";
import type { Database } from "@/types/database";

type City = Database["public"]["Tables"]["cities"]["Row"];
type Country = Database["public"]["Tables"]["countries"]["Row"];
type State = Database["public"]["Tables"]["states"]["Row"];

export default function CityForm({
  city,
  countries,
  states,
}: {
  city?: City;
  countries: Country[];
  states: State[];
}) {
  const router = useRouter();
  const [countryId, setCountryId] = useState(city?.country_id ?? "");
  const [stateId, setStateId] = useState(city?.state_id ?? "");
  const [name, setName] = useState(city?.name ?? "");
  const [description, setDescription] = useState(city?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    city?.cover_image_url ?? null,
  );
  const [coverImagePosition, setCoverImagePosition] =
    useState<ImagePosition | null>(
      parseImagePosition(city?.cover_image_position ?? null),
    );
  const [isDraft, setIsDraft] = useState(city?.status === "draft");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const slug = slugify(name);
  const selectedCountryName =
    countries.find((country) => country.id === countryId)?.name ?? "";
  const statesForCountry = states.filter(
    (state) => state.country_id === countryId,
  );

  function handleCountryChange(newCountryId: string) {
    setCountryId(newCountryId);
    // Troca de país invalida o estado escolhido, se o novo país nem tem
    // estados cadastrados ou se o estado atual pertence a outro país.
    if (!states.some((state) => state.id === stateId && state.country_id === newCountryId)) {
      setStateId("");
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!countryId) {
      setError("Escolha o país dessa cidade.");
      return;
    }

    setSaving(true);

    const supabase = createClient();
    const payload = {
      country_id: countryId,
      state_id: stateId || null,
      name,
      slug,
      description: description || null,
      cover_image_url: coverImageUrl,
      cover_image_position: coverImagePosition
        ? imagePositionToJson(coverImagePosition)
        : null,
      status: isDraft ? ("draft" as const) : ("published" as const),
    };

    const { error } = city
      ? await supabase.from("cities").update(payload).eq("id", city.id)
      : await supabase.from("cities").insert(payload);

    setSaving(false);

    if (error) {
      setError(
        error.code === "23505"
          ? "Já existe uma cidade com esse nome."
          : "Não foi possível salvar. Tente novamente.",
      );
      return;
    }

    router.push("/admin/cidades");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <FormField
        label="País"
        htmlFor="country"
        helpText="A que país essa cidade pertence."
      >
        <select
          id="country"
          className={inputClass}
          value={countryId}
          onChange={(event) => handleCountryChange(event.target.value)}
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

      {statesForCountry.length > 0 && (
        <FormField
          label="Estado"
          htmlFor="state"
          helpText="A que estado essa cidade pertence."
        >
          <select
            id="state"
            className={inputClass}
            value={stateId}
            onChange={(event) => setStateId(event.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {statesForCountry.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <FormField
        label="Nome da cidade"
        htmlFor="name"
        helpText="Como vai aparecer para os visitantes. Ex: Paris, Roma."
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
        helpText="Um resumo curto sobre a cidade (opcional)."
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
          folder="cities"
          position={coverImagePosition}
          onPositionChange={setCoverImagePosition}
        />
      </FormField>

      <FormField
        label="Publicação"
        htmlFor="isDraft"
        helpText="Enquanto marcado, a cidade aparece na página do país em preto e branco, com o selo 'Em breve'. Ninguém acessa a página da cidade até você desmarcar, mesmo que o país já esteja publicado."
      >
        <label className="flex items-center gap-2 text-sm text-tinta">
          <input
            id="isDraft"
            type="checkbox"
            checked={isDraft}
            onChange={(event) => setIsDraft(event.target.checked)}
          />
          Marcar como &quot;Em breve&quot; (rascunho, ainda não publicada)
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
          <CityPreview
            countryName={selectedCountryName}
            name={name}
            description={description || null}
            coverImageUrl={coverImageUrl}
            coverImagePosition={coverImagePosition}
            isDraft={isDraft}
          />
        </PreviewModal>
      )}
    </form>
  );
}
