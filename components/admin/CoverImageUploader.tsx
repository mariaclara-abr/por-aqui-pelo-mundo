"use client";

import { useState, type ChangeEvent } from "react";
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
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="text-sm text-tinta file:mr-3 file:rounded-full file:border-0 file:bg-areia file:px-3 file:py-1.5 file:text-sm file:text-tinta hover:file:underline"
        />
        {uploading && <p className="mt-1 text-xs text-oliva">Enviando...</p>}
        {error && <p className="mt-1 text-xs text-terracota">{error}</p>}
      </div>
    </div>
  );
}
