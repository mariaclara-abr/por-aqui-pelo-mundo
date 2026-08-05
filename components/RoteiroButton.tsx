"use client";

import { useState } from "react";
import { attractionToRoteiroSummary, useRoteiro } from "@/lib/roteiro";
import type { AttractionCategory } from "@/types/database";

interface AttractionInput {
  id: string;
  name: string;
  slug: string;
  category: AttractionCategory;
  curation_rating: number;
  latitude: number | null;
  longitude: number | null;
  attraction_photos: { url: string; order: number }[];
}

export default function RoteiroButton({
  attraction,
  countrySlug,
  citySlug,
  variant = "button",
}: {
  attraction: AttractionInput;
  countrySlug: string;
  citySlug: string;
  variant?: "button" | "icon";
}) {
  const { isInRoteiro, addItem, removeItem } = useRoteiro();
  const [pending, setPending] = useState(false);
  const inRoteiro = isInRoteiro(attraction.id);

  async function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (pending) return;
    setPending(true);
    try {
      if (inRoteiro) {
        await removeItem(attraction.id);
      } else {
        await addItem(
          attractionToRoteiroSummary(attraction, countrySlug, citySlug),
        );
      }
    } catch (error) {
      console.error("Não foi possível atualizar o roteiro:", error);
    } finally {
      setPending(false);
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={inRoteiro ? "Remover do roteiro" : "Adicionar ao roteiro"}
        aria-pressed={inRoteiro}
        title={inRoteiro ? "Adicionado ao roteiro" : "Adicionar ao roteiro"}
        className={`group/roteiro-icon relative flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-colors disabled:opacity-60 ${
          inRoteiro
            ? "bg-terracota text-white"
            : "bg-branco text-terracota hover:bg-areia"
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4 fill-none stroke-current"
          strokeWidth={2}
        >
          {inRoteiro ? (
            <path
              d="M4 10l4 4 8-8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path d="M10 4v12M4 10h12" strokeLinecap="round" />
          )}
        </svg>
        <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-tinta px-2 py-1 text-xs text-branco opacity-0 transition-opacity duration-150 group-hover/roteiro-icon:opacity-100">
          {inRoteiro ? "Adicionado ao roteiro" : "Adicionar ao roteiro"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={inRoteiro}
      className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
        inRoteiro
          ? "border border-terracota text-terracota hover:bg-terracota/10"
          : "bg-terracota text-white hover:bg-terracota/90"
      }`}
    >
      {inRoteiro ? "Remover do roteiro" : "Adicionar ao roteiro"}
    </button>
  );
}
