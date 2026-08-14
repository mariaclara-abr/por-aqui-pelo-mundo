"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { inputClass } from "@/components/admin/FormField";
import type { Database } from "@/types/database";

type AboutVisitedCountry =
  Database["public"]["Tables"]["about_visited_countries"]["Row"];

export default function AboutVisitedCountriesForm({
  initialCountries,
}: {
  initialCountries: AboutVisitedCountry[];
}) {
  const router = useRouter();
  const [countries, setCountries] = useState(initialCountries);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    const alreadyAdded = countries.some(
      (country) => country.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadyAdded) {
      setError("Esse país já está na lista.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("about_visited_countries")
      .insert({ name: trimmed })
      .select()
      .single();

    setSaving(false);

    if (error || !data) {
      setError("Não foi possível adicionar. Tente novamente.");
      return;
    }

    setCountries((prev) =>
      [...prev, data].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    );
    setName("");
    router.refresh();
  }

  async function handleRemove(id: string) {
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("about_visited_countries")
      .delete()
      .eq("id", id);

    setSaving(false);

    if (error) {
      setError("Não foi possível remover. Tente novamente.");
      return;
    }

    setCountries((prev) => prev.filter((country) => country.id !== id));
    router.refresh();
  }

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <p className="text-xs text-oliva">
        Destinos exibidos na página &ldquo;Sobre a autora&rdquo;. Pode incluir
        países ainda não cobertos pela curadoria.
      </p>

      {countries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => (
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

      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nome do país"
          disabled={saving}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="shrink-0 rounded-full bg-terracota px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          Adicionar
        </button>
      </form>

      {error && <p className="text-xs text-terracota">{error}</p>}
    </div>
  );
}
