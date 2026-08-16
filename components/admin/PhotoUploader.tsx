"use client";

import { useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase-browser";

export interface AdminPhoto {
  id: string;
  url: string;
  caption?: string | null;
}

function sanitizeFileName(name: string) {
  const lastDot = name.lastIndexOf(".");
  const base = lastDot > 0 ? name.slice(0, lastDot) : name;
  const ext = lastDot > 0 ? name.slice(lastDot + 1) : "";

  const cleanBase = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  return cleanExt ? `${cleanBase || "foto"}.${cleanExt}` : cleanBase || "foto";
}

export default function PhotoUploader({
  photos,
  onChange,
}: {
  photos: AdminPhoto[];
  onChange: (photos: AdminPhoto[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const uploaded: AdminPhoto[] = [];
    let hadError = false;

    for (const file of files) {
      const path = `attractions/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file);

      if (uploadError) {
        console.error("Falha ao enviar foto:", file.name, uploadError);
        hadError = true;
        continue;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      uploaded.push({ id: crypto.randomUUID(), url: data.publicUrl });
    }

    setUploading(false);
    event.target.value = "";

    if (hadError) {
      setError("Algumas fotos não puderam ser enviadas. Tente novamente.");
    }

    if (uploaded.length > 0) {
      onChange([...photos, ...uploaded]);
    }
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...photos];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index === photos.length - 1) return;
    const next = [...photos];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  function setCaption(index: number, caption: string) {
    const next = [...photos];
    next[index] = { ...next[index], caption: caption || null };
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        disabled={uploading}
        className="text-sm text-tinta file:mr-3 file:rounded-full file:border-0 file:bg-areia file:px-3 file:py-1.5 file:text-sm file:text-tinta"
      />
      {uploading && <p className="text-xs text-oliva">Enviando fotos...</p>}
      {error && <p className="text-xs text-terracota">{error}</p>}

      {photos.length > 0 && (
        <ul className="flex flex-col gap-2">
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className="flex flex-col gap-2 rounded-lg border border-oliva/20 p-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={photo.url}
                  alt=""
                  className="h-16 w-24 rounded object-cover"
                />
                <span className="text-xs text-oliva">
                  {index === 0 ? "Foto principal" : `Foto ${index + 1}`}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    aria-label="Mover para cima"
                    className="text-tinta disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === photos.length - 1}
                    aria-label="Mover para baixo"
                    className="text-tinta disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs text-terracota hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={photo.caption ?? ""}
                onChange={(event) => setCaption(index, event.target.value)}
                placeholder="Legenda (opcional)"
                className="rounded-md border border-oliva/25 bg-branco px-2.5 py-1.5 text-xs text-tinta placeholder:text-oliva/50 focus:border-terracota focus:outline-none"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
