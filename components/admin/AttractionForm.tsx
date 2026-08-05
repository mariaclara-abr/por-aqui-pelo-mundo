"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { slugify } from "@/lib/slugify";
import FormField, { inputClass } from "@/components/admin/FormField";
import PhotoUploader, { type AdminPhoto } from "@/components/admin/PhotoUploader";
import { RATING_LABELS } from "@/components/CurationRating";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import type { Database } from "@/types/database";

type Attraction = Database["public"]["Tables"]["attractions"]["Row"] & {
  attraction_photos: Database["public"]["Tables"]["attraction_photos"]["Row"][];
  attraction_tags: {
    tags: Database["public"]["Tables"]["tags"]["Row"];
  }[];
};
type City = Database["public"]["Tables"]["cities"]["Row"] & {
  countries: Database["public"]["Tables"]["countries"]["Row"];
};
type Tag = Database["public"]["Tables"]["tags"]["Row"];

export default function AttractionForm({
  attraction,
  cities,
  tags,
}: {
  attraction?: Attraction;
  cities: City[];
  tags: Tag[];
}) {
  const router = useRouter();

  const [cityId, setCityId] = useState(attraction?.city_id ?? "");
  const [name, setName] = useState(attraction?.name ?? "");
  const [category, setCategory] = useState(
    attraction?.category ?? "ponto_turistico",
  );
  const [description, setDescription] = useState(
    attraction?.description ?? "",
  );
  const [personalExperience, setPersonalExperience] = useState(
    attraction?.personal_experience ?? "",
  );
  const [importantTips, setImportantTips] = useState(
    attraction?.important_tips ?? "",
  );
  const [averageVisitTime, setAverageVisitTime] = useState(
    attraction?.average_visit_time ?? "",
  );
  const [bestTimeOfDay, setBestTimeOfDay] = useState(
    attraction?.best_time_of_day ?? "",
  );
  const [bestSeason, setBestSeason] = useState(attraction?.best_season ?? "");
  const [recommendedAudience, setRecommendedAudience] = useState(
    attraction?.recommended_audience ?? "",
  );
  const [importantNotes, setImportantNotes] = useState(
    attraction?.important_notes ?? "",
  );
  const [curationRating, setCurationRating] = useState(
    attraction?.curation_rating ?? 5,
  );
  const [latitude, setLatitude] = useState(
    attraction?.latitude != null ? String(attraction.latitude) : "",
  );
  const [longitude, setLongitude] = useState(
    attraction?.longitude != null ? String(attraction.longitude) : "",
  );
  const [exclusivePerkDescription, setExclusivePerkDescription] = useState(
    attraction?.exclusive_perk_description ?? "",
  );
  const [exclusivePerkUrl, setExclusivePerkUrl] = useState(
    attraction?.exclusive_perk_url ?? "",
  );
  const [exclusivePerkCtaLabel, setExclusivePerkCtaLabel] = useState(
    attraction?.exclusive_perk_cta_label ?? "",
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    attraction?.attraction_tags.map((entry) => entry.tags.id) ?? [],
  );
  const [photos, setPhotos] = useState<AdminPhoto[]>(
    [...(attraction?.attraction_photos ?? [])]
      .sort((a, b) => a.order - b.order)
      .map((photo) => ({ id: photo.id, url: photo.url })),
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const slug = slugify(name);

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!cityId) {
      setError("Escolha a cidade dessa atração.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const payload = {
      city_id: cityId,
      name,
      slug,
      category,
      description: description || null,
      personal_experience: personalExperience || null,
      important_tips: importantTips || null,
      average_visit_time: averageVisitTime || null,
      best_time_of_day: bestTimeOfDay || null,
      best_season: bestSeason || null,
      recommended_audience: recommendedAudience || null,
      important_notes: importantNotes || null,
      curation_rating: curationRating,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      exclusive_perk_description: exclusivePerkDescription || null,
      exclusive_perk_url: exclusivePerkUrl || null,
      exclusive_perk_cta_label: exclusivePerkCtaLabel || null,
    };

    try {
      let attractionId: string;

      if (attraction) {
        const { error: updateError } = await supabase
          .from("attractions")
          .update(payload)
          .eq("id", attraction.id);
        if (updateError) throw updateError;
        attractionId = attraction.id;
      } else {
        const { data, error: insertError } = await supabase
          .from("attractions")
          .insert(payload)
          .select("id")
          .single();
        if (insertError) throw insertError;
        attractionId = data.id;
      }

      // Etiquetas: substitui os vínculos existentes pelos selecionados agora.
      const { error: deleteTagsError } = await supabase
        .from("attraction_tags")
        .delete()
        .eq("attraction_id", attractionId);
      if (deleteTagsError) throw deleteTagsError;

      if (selectedTagIds.length > 0) {
        const { error: insertTagsError } = await supabase
          .from("attraction_tags")
          .insert(
            selectedTagIds.map((tagId) => ({
              attraction_id: attractionId,
              tag_id: tagId,
            })),
          );
        if (insertTagsError) throw insertTagsError;
      }

      // Fotos: substitui as existentes pela lista atual, já na ordem certa.
      const { error: deletePhotosError } = await supabase
        .from("attraction_photos")
        .delete()
        .eq("attraction_id", attractionId);
      if (deletePhotosError) throw deletePhotosError;

      if (photos.length > 0) {
        const { error: insertPhotosError } = await supabase
          .from("attraction_photos")
          .insert(
            photos.map((photo, index) => ({
              attraction_id: attractionId,
              url: photo.url,
              order: index,
            })),
          );
        if (insertPhotosError) throw insertPhotosError;
      }

      router.push("/admin/atracoes");
      router.refresh();
    } catch (err) {
      setSaving(false);
      const code = (err as { code?: string }).code;
      setError(
        code === "23505"
          ? "Já existe uma atração com esse nome nessa cidade."
          : "Não foi possível salvar. Tente novamente.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <FormField
        label="Cidade"
        htmlFor="city"
        helpText="Onde essa atração fica."
      >
        <select
          id="city"
          className={inputClass}
          value={cityId}
          onChange={(event) => setCityId(event.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name} — {city.countries.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Nome da atração"
        htmlFor="name"
        helpText="Como vai aparecer para os visitantes."
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
        label="Categoria"
        htmlFor="category"
        helpText="Escolha o tipo que melhor descreve o lugar."
      >
        <select
          id="category"
          className={inputClass}
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as typeof category)
          }
        >
          {ATTRACTION_CATEGORIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Descrição"
        htmlFor="description"
        helpText="Um resumo objetivo sobre o que é o lugar."
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
        label="Experiência pessoal"
        htmlFor="personalExperience"
        helpText="Conte como foi a visita — isso é o coração da curadoria, o que diferencia o site de um guia genérico."
      >
        <textarea
          id="personalExperience"
          className={inputClass}
          rows={4}
          value={personalExperience ?? ""}
          onChange={(event) => setPersonalExperience(event.target.value)}
        />
      </FormField>

      <FormField
        label="Dicas importantes"
        htmlFor="importantTips"
        helpText="Dicas práticas pra quem for visitar. Ex: melhor horário pra evitar fila, o que levar."
      >
        <textarea
          id="importantTips"
          className={inputClass}
          rows={3}
          value={importantTips ?? ""}
          onChange={(event) => setImportantTips(event.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="Tempo médio de visita"
          htmlFor="averageVisitTime"
          helpText="Ex: 1 hora, 30-45 minutos."
        >
          <input
            id="averageVisitTime"
            className={inputClass}
            value={averageVisitTime ?? ""}
            onChange={(event) => setAverageVisitTime(event.target.value)}
          />
        </FormField>

        <FormField
          label="Melhor horário"
          htmlFor="bestTimeOfDay"
          helpText="Ex: Manhã, Fim de tarde."
        >
          <input
            id="bestTimeOfDay"
            className={inputClass}
            value={bestTimeOfDay ?? ""}
            onChange={(event) => setBestTimeOfDay(event.target.value)}
          />
        </FormField>

        <FormField
          label="Melhor época"
          htmlFor="bestSeason"
          helpText="Ex: Verão, Ano todo."
        >
          <input
            id="bestSeason"
            className={inputClass}
            value={bestSeason ?? ""}
            onChange={(event) => setBestSeason(event.target.value)}
          />
        </FormField>

        <FormField
          label="Público recomendado"
          htmlFor="recommendedAudience"
          helpText="Ex: Famílias com crianças pequenas, Casais."
        >
          <input
            id="recommendedAudience"
            className={inputClass}
            value={recommendedAudience ?? ""}
            onChange={(event) => setRecommendedAudience(event.target.value)}
          />
        </FormField>
      </div>

      <FormField
        label="Observações importantes"
        htmlFor="importantNotes"
        helpText="Avisos que merecem destaque. Ex: fechado às segundas."
      >
        <textarea
          id="importantNotes"
          className={inputClass}
          rows={2}
          value={importantNotes ?? ""}
          onChange={(event) => setImportantNotes(event.target.value)}
        />
      </FormField>

      <div className="flex flex-col gap-5 rounded-xl border border-terracota/30 bg-terracota/5 p-4">
        <p className="text-sm font-medium text-terracota">
          Parceria exclusiva (opcional)
        </p>

        <FormField
          label="Descrição da vantagem"
          htmlFor="exclusivePerkDescription"
          helpText="Só aparece na página se for preenchido. Ex: Reserve com 10% de desconto exclusivo para leitores do Por Aqui Pelo Mundo."
        >
          <textarea
            id="exclusivePerkDescription"
            className={inputClass}
            rows={2}
            value={exclusivePerkDescription}
            onChange={(event) => setExclusivePerkDescription(event.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Link da parceria"
            htmlFor="exclusivePerkUrl"
            helpText="URL de reserva, cupom ou página do parceiro."
          >
            <input
              id="exclusivePerkUrl"
              type="url"
              className={inputClass}
              value={exclusivePerkUrl}
              onChange={(event) => setExclusivePerkUrl(event.target.value)}
            />
          </FormField>

          <FormField
            label="Texto do botão"
            htmlFor="exclusivePerkCtaLabel"
            helpText='Ex: "Reservar com desconto". Padrão: "Aproveitar parceria".'
          >
            <input
              id="exclusivePerkCtaLabel"
              className={inputClass}
              value={exclusivePerkCtaLabel}
              onChange={(event) => setExclusivePerkCtaLabel(event.target.value)}
            />
          </FormField>
        </div>
      </div>

      <FormField
        label="Nota da curadoria"
        htmlFor="curationRating"
        helpText="Sua avaliação pessoal do lugar — não é média de avaliações de usuários."
      >
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 text-sm text-tinta"
            >
              <input
                type="radio"
                name="curationRating"
                checked={curationRating === value}
                onChange={() => setCurationRating(value)}
              />
              <span className="text-terracota">
                {"★".repeat(value)}
                <span className="text-tinta/20">
                  {"★".repeat(5 - value)}
                </span>
              </span>
              {RATING_LABELS[value]}
            </label>
          ))}
        </div>
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="Latitude"
          htmlFor="latitude"
          helpText="Coordenada do local (opcional, usada futuramente no mapa)."
        >
          <input
            id="latitude"
            type="number"
            step="any"
            className={inputClass}
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
          />
        </FormField>

        <FormField
          label="Longitude"
          htmlFor="longitude"
          helpText="Coordenada do local (opcional, usada futuramente no mapa)."
        >
          <input
            id="longitude"
            type="number"
            step="any"
            className={inputClass}
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
          />
        </FormField>
      </div>

      <FormField
        label="Etiquetas"
        htmlFor="tags"
        helpText="Marque todas as que se aplicam a essa atração."
      >
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const checked = selectedTagIds.includes(tag.id);
            return (
              <label
                key={tag.id}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${
                  checked
                    ? "border-oliva bg-oliva text-white"
                    : "border-oliva/30 text-oliva hover:border-oliva"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleTag(tag.id)}
                />
                {tag.name}
              </label>
            );
          })}
        </div>
      </FormField>

      <FormField
        label="Fotos"
        htmlFor="photos"
        helpText="Envie uma ou mais fotos. A primeira da lista é a foto principal — use as setas para reordenar."
      >
        <PhotoUploader photos={photos} onChange={setPhotos} />
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
