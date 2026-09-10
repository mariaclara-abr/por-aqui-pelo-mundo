"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type SearchResult = {
  result_type: "country" | "city" | "attraction";
  id: string;
  name: string;
  city_name: string | null;
  country_name: string | null;
};

type SearchResponse = { results: SearchResult[] };

function resultHref(result: SearchResult): string {
  switch (result.result_type) {
    case "country":
      return `/admin/paises/${result.id}`;
    case "city":
      return `/admin/cidades/${result.id}`;
    case "attraction":
      return `/admin/atracoes/${result.id}`;
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

export default function AdminSearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      setLoading(false);
      return;
    }

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
    setIsOpen(false);
    setQuery("");
    setResults(null);
  }

  const hasResults = !!results && results.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <input
        type="search"
        value={query}
        maxLength={100}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && close()}
        placeholder="Buscar país, cidade ou atração..."
        aria-label="Buscar no painel"
        className="w-full rounded-full border border-oliva/30 bg-branco px-4 py-2 text-sm text-tinta placeholder:text-oliva/50 focus:border-terracota focus:outline-none"
      />

      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-oliva/15 bg-branco p-2 shadow-md">
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
