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

  const chip = (active: boolean, color: "terracota" | "oliva") =>
    `rounded-lg border px-3.5 py-1.5 text-sm transition-colors ${
      active
        ? color === "terracota"
          ? "border-terracota bg-terracota text-white"
          : "border-oliva bg-oliva text-white"
        : color === "terracota"
          ? "border-tinta/15 text-tinta hover:border-terracota hover:text-terracota"
          : "border-tinta/15 text-tinta hover:border-oliva hover:text-oliva"
    }`;

  const tab = (open: boolean, count: number, color: "terracota" | "oliva") =>
    `group flex items-center gap-2 border-b-2 pb-2 font-serif text-lg transition-colors ${
      open || count > 0
        ? color === "terracota"
          ? "border-terracota text-terracota"
          : "border-oliva text-oliva"
        : "border-tinta/15 text-tinta hover:border-tinta/40"
    }`;

  const chevron = (open: boolean) => (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4.5l4 4 4-4" />
    </svg>
  );

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <button
          type="button"
          onClick={() => setShowCategories((prev) => !prev)}
          aria-expanded={showCategories}
          className={tab(showCategories, selectedCategories.length, "terracota")}
        >
          Categorias
          {selectedCategories.length > 0 && (
            <span className="font-sans text-sm">({selectedCategories.length})</span>
          )}
          {chevron(showCategories)}
        </button>

        {tags.length > 0 && (
          <button
            type="button"
            onClick={() => setShowTags((prev) => !prev)}
            aria-expanded={showTags}
            className={tab(showTags, selectedTags.length, "oliva")}
          >
            Preferências
            {selectedTags.length > 0 && (
              <span className="font-sans text-sm">({selectedTags.length})</span>
            )}
            {chevron(showTags)}
          </button>
        )}
      </div>

      {showCategories && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={clearCategories}
            aria-pressed={selectedCategories.length === 0}
            className={chip(selectedCategories.length === 0, "terracota")}
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
                className={chip(active, "terracota")}
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
                className={chip(active, "oliva")}
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
