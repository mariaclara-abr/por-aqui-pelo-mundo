"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type SearchResults = {
  countries: { id: string; name: string; slug: string }[];
  cities: {
    id: string;
    name: string;
    slug: string;
    countries: { name: string; slug: string } | null;
  }[];
};

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
  const [results, setResults] = useState<SearchResults | null>(null);
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

    const timeout = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        .then((response) => response.json())
        .then((data: SearchResults) => setResults(data))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  function close() {
    if (!inDrawer) setIsOpen(false);
    setQuery("");
    setResults(null);
    onNavigate?.();
  }

  const hasResults =
    !!results && (results.countries.length > 0 || results.cities.length > 0);

  return (
    <div ref={containerRef} className="relative">
      {isOpen ? (
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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
              {results!.countries.map((country) => (
                <Link
                  key={country.id}
                  href={`/${country.slug}`}
                  onClick={close}
                  className="rounded-lg px-3 py-2 text-sm text-tinta hover:bg-areia"
                >
                  <span className="block text-xs uppercase tracking-wide text-oliva">
                    País
                  </span>
                  {country.name}
                </Link>
              ))}
              {results!.cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${city.countries?.slug}/${city.slug}`}
                  onClick={close}
                  className="rounded-lg px-3 py-2 text-sm text-tinta hover:bg-areia"
                >
                  <span className="block text-xs uppercase tracking-wide text-oliva">
                    Cidade
                  </span>
                  {city.name}
                  {city.countries ? `, ${city.countries.name}` : ""}
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
