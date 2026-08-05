"use client";

import { useId, useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function CoverImageUploader({
  value,
  onChange,
  folder,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const path = `${folder}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file);

    setUploading(false);
    event.target.value = "";

    if (uploadError) {
      setError("Não foi possível enviar a imagem. Tente novamente.");
      return;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div className="flex items-center gap-4">
      <div>
        {value ? (
          <img
            src={value}
            alt=""
            className="h-20 w-28 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-20 w-28 items-center justify-center rounded-lg bg-areia text-center text-xs text-oliva">
            Sem foto
          </div>
        )}
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="mt-1 text-xs text-terracota hover:underline"
          >
            Remover foto
          </button>
        )}
      </div>
      <div>
        <label
          htmlFor={inputId}
          className="inline-block cursor-pointer rounded-full bg-areia px-3 py-1.5 text-sm text-tinta hover:underline"
        >
          {value ? "Trocar foto" : "Escolher foto"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
        />
        {uploading && <p className="mt-1 text-xs text-oliva">Enviando...</p>}
        {error && <p className="mt-1 text-xs text-terracota">{error}</p>}
      </div>
    </div>
  );
}
