"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type SearchResult = {
  result_type: "country" | "city" | "attraction";
  id: string;
  name: string;
  slug: string;
  city_name: string | null;
  city_slug: string | null;
  country_name: string | null;
  country_slug: string | null;
};

type SearchResponse = { results: SearchResult[] };

function resultHref(result: SearchResult): string {
  switch (result.result_type) {
    case "country":
      return `/${result.slug}`;
    case "city":
      return `/${result.country_slug}/${result.slug}`;
    case "attraction":
      return `/${result.country_slug}/${result.city_slug}/${result.slug}`;
  }
}

function resultLabel(result: SearchResult): string {
  switch (result.result_type) {
    case "country":
      return "País";
    case "city":
      return "Cidade";
    case "attraction":
      return "Atração";
  }
}

function resultSubtitle(result: SearchResult): string {
  switch (result.result_type) {
    case "country":
      return "";
    case "city":
      return result.country_name ? `, ${result.country_name}` : "";
    case "attraction":
      return result.city_name ? `, ${result.city_name}` : "";
  }
}

export default function SearchBox({
  variant = "header",
  onNavigate,
}: {
  variant?: "header" | "drawer";
  onNavigate?: () => void;
}) {
  const inDrawer = variant === "drawer";
  const [isOpen, setIsOpen] = useState(inDrawer);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inDrawer) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [inDrawer]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error("Falha na busca");
          return response.json();
        })
        .then((data: SearchResponse) => setResults(data.results))
        .catch((error: unknown) => {
          if (error instanceof Error && error.name !== "AbortError") {
            setResults([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function close() {
    if (!inDrawer) setIsOpen(false);
    setQuery("");
    setResults(null);
    onNavigate?.();
  }

  const hasResults = !!results && results.length > 0;

  return (
    <div ref={containerRef} className="relative">
      {isOpen ? (
        <input
          ref={inputRef}
          type="search"
          value={query}
          maxLength={100}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            if (!value.trim()) {
              setResults(null);
              setLoading(false);
            }
          }}
          onKeyDown={(event) => event.key === "Escape" && close()}
          placeholder="Buscar destinos..."
          aria-label="Buscar destinos"
          className={
            inDrawer
              ? "w-full rounded-lg border border-branco/20 bg-branco/10 px-3 py-2.5 text-sm text-branco placeholder:text-areia/70 focus:border-terracota focus:outline-none"
              : "w-32 rounded-full border border-oliva/30 bg-branco px-3 py-1.5 text-sm text-tinta placeholder:text-oliva/50 focus:border-terracota focus:outline-none sm:w-64"
          }
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Buscar"
          className="flex h-9 w-9 items-center justify-center rounded-full text-tinta transition-colors hover:text-terracota"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5 fill-none stroke-current"
            strokeWidth={2}
          >
            <circle cx="9" cy="9" r="6.5" />
            <path d="M18 18l-4.5-4.5" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {isOpen && query.trim() && (
        <div
          className={
            inDrawer
              ? "mt-2 w-full rounded-xl border border-branco/15 bg-branco p-2 shadow-md"
              : "absolute right-0 z-50 mt-2 w-72 rounded-xl border border-oliva/15 bg-branco p-2 shadow-md"
          }
        >
          {loading ? (
            <p className="px-3 py-2 text-sm text-oliva">Buscando...</p>
          ) : hasResults ? (
            <div className="flex flex-col gap-1">
              {results!.map((result) => (
                <Link
                  key={`${result.result_type}-${result.id}`}
                  href={resultHref(result)}
                  onClick={close}
                  className="rounded-lg px-3 py-2 text-sm text-tinta hover:bg-areia"
                >
                  <span className="block text-xs uppercase tracking-wide text-oliva">
                    {resultLabel(result)}
                  </span>
                  {result.name}
                  {resultSubtitle(result)}
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-3 py-2 text-sm text-oliva">Nada encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
