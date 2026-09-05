"use client";

import { useId, useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase-browser";
import ImagePositionPicker from "@/components/admin/ImagePositionPicker";
import {
  DEFAULT_IMAGE_POSITION,
  imagePositionStyle,
  type ImagePosition,
} from "@/lib/image-position";

export default function CoverImageUploader({
  value,
  onChange,
  folder,
  position,
  onPositionChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  position?: ImagePosition | null;
  onPositionChange?: (position: ImagePosition) => void;
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
    // Foto nova: qualquer enquadramento salvo pra foto anterior não faz mais
    // sentido, volta pro padrão (centro, sem zoom).
    onPositionChange?.(DEFAULT_IMAGE_POSITION);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div>
          {value ? (
            <img
              src={value}
              alt="Prévia da imagem de capa selecionada"
              className="h-20 w-28 rounded-lg object-cover"
              style={imagePositionStyle(position)}
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

      {value && onPositionChange && (
        <ImagePositionPicker
          imageUrl={value}
          value={position ?? null}
          onChange={onPositionChange}
        />
      )}
    </div>
  );
}
