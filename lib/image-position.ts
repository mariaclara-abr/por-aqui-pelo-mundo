import type { CSSProperties } from "react";
import type { Json } from "@/types/database";

export interface ImagePosition {
  x: number;
  y: number;
  zoom: number;
}

export const DEFAULT_IMAGE_POSITION: ImagePosition = { x: 50, y: 50, zoom: 1 };

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

// As colunas de posição vêm como jsonb (Json) do banco; aqui validamos o
// formato esperado em vez de confiar cegamente no cast, já que Json aceita
// qualquer estrutura.
export function parseImagePosition(value: Json | null | undefined): ImagePosition | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const { x, y, zoom } = value as Record<string, unknown>;
  if (typeof x !== "number" || typeof y !== "number" || typeof zoom !== "number") {
    return null;
  }
  return { x: clampPercent(x), y: clampPercent(y), zoom };
}

export function imagePositionToJson(position: ImagePosition): Json {
  return { x: position.x, y: position.y, zoom: position.zoom };
}

// Aplicado no elemento de imagem (next/image ou <img>): object-position
// posiciona o "foco" da foto, e o scale a partir da mesma origem cria o
// efeito de zoom mantendo esse foco parado no lugar.
export function imagePositionStyle(
  position: ImagePosition | null | undefined,
): CSSProperties {
  const p = position ?? DEFAULT_IMAGE_POSITION;
  return {
    objectPosition: `${p.x}% ${p.y}%`,
    transform: p.zoom !== 1 ? `scale(${p.zoom})` : undefined,
    transformOrigin: `${p.x}% ${p.y}%`,
  };
}
