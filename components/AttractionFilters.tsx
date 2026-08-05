"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import type { Database } from "@/types/database";

type Tag = Database["public"]["Tables"]["tags"]["Row"];

export default function AttractionFilters({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const selectedCategories =
    searchParams.get("categorias")?.split(",").filter(Boolean) ?? [];
  const selectedTags =
    searchParams.get("tags")?.split(",").filter(Boolean) ?? [];

  function navigate(params: URLSearchParams) {
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function toggleCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const next = selectedCategories.includes(value)
      ? selectedCategories.filter((category) => category !== value)
      : [...selectedCategories, value];

    if (next.length > 0) {
      params.set("categorias", next.join(","));
    } else {
      params.delete("categorias");
    }
    navigate(params);
  }

  function clearCategories() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categorias");
    navigate(params);
  }

  function toggleTag(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    const next = selectedTags.includes(slug)
      ? selectedTags.filter((tag) => tag !== slug)
      : [...selectedTags, slug];

    if (next.length > 0) {
      params.set("tags", next.join(","));
    } else {
      params.delete("tags");
    }
    navigate(params);
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowCategories((prev) => !prev)}
          aria-pressed={showCategories}
          aria-expanded={showCategories}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            showCategories || selectedCategories.length > 0
              ? "border-terracota bg-terracota text-white"
              : "border-terracota/30 text-terracota hover:border-terracota"
          }`}
        >
          Selecionar categorias
          {selectedCategories.length > 0 ? ` (${selectedCategories.length})` : ""}
        </button>

        {tags.length > 0 && (
          <button
            type="button"
            onClick={() => setShowTags((prev) => !prev)}
            aria-pressed={showTags}
            aria-expanded={showTags}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              showTags || selectedTags.length > 0
                ? "border-oliva bg-oliva text-white"
                : "border-oliva/30 text-oliva hover:border-oliva"
            }`}
          >
            Selecionar preferências
            {selectedTags.length > 0 ? ` (${selectedTags.length})` : ""}
          </button>
        )}
      </div>

      {showCategories && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={clearCategories}
            aria-pressed={selectedCategories.length === 0}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              selectedCategories.length === 0
                ? "border-terracota bg-terracota text-white"
                : "border-terracota/30 text-terracota hover:border-terracota"
            }`}
          >
            Todas
          </button>
          {ATTRACTION_CATEGORIES.map((category) => {
            const active = selectedCategories.includes(category.value);
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => toggleCategory(category.value)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-terracota bg-terracota text-white"
                    : "border-terracota/30 text-terracota hover:border-terracota"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      )}

      {showTags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = selectedTags.includes(tag.slug);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.slug)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  active
                    ? "border-oliva bg-oliva text-white"
                    : "border-oliva/30 text-oliva hover:border-oliva"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
