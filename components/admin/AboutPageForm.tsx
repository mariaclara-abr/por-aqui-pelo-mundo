"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import FormField, { inputClass } from "@/components/admin/FormField";
import CoverImageUploader from "@/components/admin/CoverImageUploader";
import PreviewModal from "@/components/admin/PreviewModal";
import AboutPreview from "@/components/admin/previews/AboutPreview";
import type { Database } from "@/types/database";

type AboutPageContent = Database["public"]["Tables"]["about_page_content"]["Row"];

export default function AboutPageForm({ about }: { about: AboutPageContent }) {
  const router = useRouter();
  const [authorName, setAuthorName] = useState(about.author_name);
  const [authorPhotoUrl, setAuthorPhotoUrl] = useState<string | null>(
    about.author_photo_url,
  );
  const [bio, setBio] = useState(about.bio);
  const [whySiteText, setWhySiteText] = useState(about.why_site_text);
  const [quoteText, setQuoteText] = useState(about.quote_text);
  const [travelPhoto1Url, setTravelPhoto1Url] = useState<string | null>(
    about.travel_photo_1_url,
  );
  const [travelPhoto2Url, setTravelPhoto2Url] = useState<string | null>(
    about.travel_photo_2_url,
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("about_page_content")
      .update({
        author_name: authorName,
        author_photo_url: authorPhotoUrl,
        bio,
        why_site_text: whySiteText,
        quote_text: quoteText,
        travel_photo_1_url: travelPhoto1Url,
        travel_photo_2_url: travelPhoto2Url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setSaving(false);

    if (error) {
      setError("Não foi possível salvar. Tente novamente.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <FormField
        label="Nome da autora"
        htmlFor="authorName"
        helpText="Aparece como título da página."
      >
        <input
          id="authorName"
          className={inputClass}
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Foto da autora"
        htmlFor="authorPhoto"
        helpText="Foto grande no topo da página."
      >
        <CoverImageUploader
          value={authorPhotoUrl}
          onChange={setAuthorPhotoUrl}
          folder="about"
        />
      </FormField>

      <FormField
        label="Texto sobre a autora"
        htmlFor="bio"
        helpText="Deixe uma linha em branco entre parágrafos."
      >
        <textarea
          id="bio"
          className={inputClass}
          rows={8}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Primeira foto de viagem"
        htmlFor="travelPhoto1"
        helpText="Aparece logo abaixo do texto sobre a autora."
      >
        <CoverImageUploader
          value={travelPhoto1Url}
          onChange={setTravelPhoto1Url}
          folder="about"
        />
      </FormField>

      <FormField
        label="Por que esse site existe"
        htmlFor="whySiteText"
      >
        <textarea
          id="whySiteText"
          className={inputClass}
          rows={4}
          value={whySiteText}
          onChange={(event) => setWhySiteText(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Frase de destaque"
        htmlFor="quoteText"
        helpText="Aparece em destaque, entre aspas."
      >
        <textarea
          id="quoteText"
          className={inputClass}
          rows={2}
          value={quoteText}
          onChange={(event) => setQuoteText(event.target.value)}
          required
        />
      </FormField>

      <FormField
        label="Segunda foto de viagem"
        htmlFor="travelPhoto2"
        helpText="Aparece perto do fim da página."
      >
        <CoverImageUploader
          value={travelPhoto2Url}
          onChange={setTravelPhoto2Url}
          folder="about"
        />
      </FormField>

      {error && <p className="text-sm text-terracota">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-oliva">Alterações salvas.</p>
      )}

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
          <AboutPreview
            authorName={authorName}
            authorPhotoUrl={authorPhotoUrl}
            bio={bio}
            whySiteText={whySiteText}
            quoteText={quoteText}
            travelPhoto1Url={travelPhoto1Url}
            travelPhoto2Url={travelPhoto2Url}
          />
        </PreviewModal>
      )}
    </form>
  );
}
