"use client";

import { useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function AvatarUploader({
  userId,
  value,
  initial,
  onChange,
}: {
  userId: string;
  value: string | null;
  initial: string;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file);

    setUploading(false);
    event.target.value = "";

    if (uploadError) {
      setError("Não foi possível enviar a foto. Tente novamente.");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-oliva text-xl font-medium text-white">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </div>
      <div className="flex flex-col items-start gap-1.5">
        <label
          htmlFor="avatar-file-input"
          className={`rounded-full bg-areia px-3 py-1.5 text-sm text-tinta transition-colors hover:underline ${
            uploading ? "pointer-events-none opacity-60" : "cursor-pointer"
          }`}
        >
          Escolher foto
        </label>
        <input
          id="avatar-file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
        />
        {uploading && <p className="text-xs text-oliva">Enviando...</p>}
        {error && <p className="text-xs text-terracota">{error}</p>}
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-terracota hover:underline"
          >
            Remover foto
          </button>
        )}
      </div>
    </div>
  );
}
