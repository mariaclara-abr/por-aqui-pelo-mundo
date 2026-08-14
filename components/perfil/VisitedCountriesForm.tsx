"use client";

import { useEffect, useState } from "react";
import { getCountries } from "@/lib/queries";
import {
  addVisitedCountry,
  removeVisitedCountry,
  type VisitedCountry,
} from "@/lib/profile-queries";

export default function VisitedCountriesForm({
  userId,
  initialVisited,
}: {
  userId: string;
  initialVisited: VisitedCountry[];
}) {
  const [visited, setVisited] = useState(initialVisited);
  const [allCountries, setAllCountries] = useState<VisitedCountry[] | null>(
    null,
  );
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCountries()
      .then((data) => setAllCountries(data))
      .catch(() => setAllCountries([]));
  }, []);

  const visitedIds = new Set(visited.map((country) => country.id));
  const available = (allCountries ?? []).filter(
    (country) => !visitedIds.has(country.id),
  );

  async function handleAdd() {
    if (!selectedCountryId) return;
    const country = allCountries?.find((c) => c.id === selectedCountryId);
    if (!country) return;

    setSaving(true);
    setError(null);
    try {
      await addVisitedCountry(userId, country.id);
      setVisited((prev) =>
        [
          ...prev,
          { id: country.id, name: country.name, slug: country.slug },
        ].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
      );
      setSelectedCountryId("");
    } catch {
      setError("Não foi possível adicionar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(countryId: string) {
    setSaving(true);
    setError(null);
    try {
      await removeVisitedCountry(userId, countryId);
      setVisited((prev) => prev.filter((country) => country.id !== countryId));
    } catch {
      setError("Não foi possível remover. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-oliva">
        Países que aparecem publicamente no seu perfil. Se você não adicionar
        nenhum, essa seção simplesmente não aparece.
      </p>

      {visited.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visited.map((country) => (
            <span
              key={country.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-oliva/10 py-1 pl-3 pr-2 text-xs text-oliva"
            >
              {country.name}
              <button
                type="button"
                onClick={() => handleRemove(country.id)}
                disabled={saving}
                aria-label={`Remover ${country.name}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-oliva/70 transition-colors hover:text-terracota disabled:opacity-60"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-3 w-3 fill-none stroke-current"
                  strokeWidth={2}
                >
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <select
          value={selectedCountryId}
          onChange={(event) => setSelectedCountryId(event.target.value)}
          disabled={saving || allCountries === null}
          className="min-w-0 flex-1 rounded-full border border-oliva/30 bg-branco px-3 py-1.5 text-sm text-tinta focus:border-terracota focus:outline-none disabled:opacity-60"
        >
          <option value="">
            {allCountries === null ? "Carregando países..." : "Selecione um país"}
          </option>
          {available.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving || !selectedCountryId}
          className="shrink-0 rounded-full bg-terracota px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          Adicionar
        </button>
      </div>

      {error && <p className="text-xs text-terracota">{error}</p>}
    </div>
  );
}
