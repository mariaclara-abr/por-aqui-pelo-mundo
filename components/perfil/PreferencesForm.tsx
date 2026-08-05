"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import PillButton from "@/components/PillButton";
import {
  BUDGET_RANGES,
  CHILDREN_AGE_RANGES,
  parseUserPreferences,
  TRAVEL_PACES,
  TRAVEL_PROFILES,
  type BudgetRange,
  type TravelPace,
  type TravelProfile,
  type UserPreferences,
} from "@/types/database";
import type { Database } from "@/types/database";

export default function PreferencesForm({
  userId,
  initialPreferences,
}: {
  userId: string;
  initialPreferences: unknown;
}) {
  const [preferences, setPreferences] = useState<UserPreferences>(
    parseUserPreferences(initialPreferences),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function toggleInList<T>(list: T[], value: T): T[] {
    return list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ preferences: preferences as unknown as Database["public"]["Tables"]["profiles"]["Update"]["preferences"] })
      .eq("id", userId);

    setSaving(false);

    if (updateError) {
      setError("Não foi possível salvar suas preferências. Tente novamente.");
      return;
    }

    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-oliva">
        Usamos essas preferências para personalizar as recomendações que você
        vê pelo site e, no futuro, para ajudar a organizar seu roteiro
        automaticamente.
      </p>

      <div>
        <p className="text-sm font-medium text-tinta">Viaja com crianças?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <PillButton
            active={preferences.travelsWithChildren === true}
            onClick={() => update("travelsWithChildren", true)}
          >
            Sim
          </PillButton>
          <PillButton
            active={preferences.travelsWithChildren === false}
            onClick={() => {
              update("travelsWithChildren", false);
              update("childrenAgeRanges", []);
            }}
          >
            Não
          </PillButton>
        </div>
      </div>

      {preferences.travelsWithChildren && (
        <div>
          <p className="text-sm font-medium text-tinta">Faixas etárias</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CHILDREN_AGE_RANGES.map((range) => (
              <PillButton
                key={range.value}
                active={preferences.childrenAgeRanges.includes(range.value)}
                onClick={() =>
                  update(
                    "childrenAgeRanges",
                    toggleInList(preferences.childrenAgeRanges, range.value),
                  )
                }
              >
                {range.label}
              </PillButton>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-tinta">Perfil de viagem</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRAVEL_PROFILES.map((option) => (
            <PillButton
              key={option.value}
              active={preferences.travelProfile === option.value}
              onClick={() =>
                update(
                  "travelProfile",
                  preferences.travelProfile === option.value
                    ? null
                    : (option.value as TravelProfile),
                )
              }
            >
              {option.label}
            </PillButton>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-tinta">Ritmo preferido</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRAVEL_PACES.map((option) => (
            <PillButton
              key={option.value}
              active={preferences.pace === option.value}
              onClick={() =>
                update(
                  "pace",
                  preferences.pace === option.value
                    ? null
                    : (option.value as TravelPace),
                )
              }
            >
              {option.label}
            </PillButton>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-tinta">Faixa de orçamento</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BUDGET_RANGES.map((option) => (
            <PillButton
              key={option.value}
              active={preferences.budget === option.value}
              onClick={() =>
                update(
                  "budget",
                  preferences.budget === option.value
                    ? null
                    : (option.value as BudgetRange),
                )
              }
            >
              {option.label}
            </PillButton>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-terracota">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-oliva">Preferências salvas.</p>
      )}

      <div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar preferências"}
        </button>
      </div>
    </div>
  );
}
