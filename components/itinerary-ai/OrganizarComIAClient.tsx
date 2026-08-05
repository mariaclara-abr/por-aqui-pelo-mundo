"use client";

import { useState } from "react";
import Link from "next/link";
import PillButton from "@/components/PillButton";
import PaywallCard from "@/components/itinerary-ai/PaywallCard";
import {
  estimateWalkMinutes,
  formatDistanceKm,
  haversineDistanceKm,
} from "@/lib/recommendations";
import {
  ATTRACTION_CATEGORIES,
  BUDGET_RANGES,
  CHILDREN_AGE_RANGES,
  TRAVEL_PACES,
  TRAVEL_PROFILES,
  type BudgetRange,
  type TravelPace,
  type TravelProfile,
  type UserPreferences,
} from "@/types/database";
import type { AIAttraction, ItineraryForAI } from "@/lib/itinerary-ai";
import type { AIAccessResult } from "@/lib/subscription";
import { exportItineraryToPDF, exportToGoogleCalendar } from "@/lib/export";

interface OrganizedItem {
  attractionId: string;
  name: string;
  slug: string;
  citySlug: string;
  countrySlug: string;
  cityName: string;
  category: string;
  curationRating: number;
  description: string | null;
  coverPhotoUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  suggestedStartTime: string | null;
  suggestedDurationMinutes: number | null;
  isSuggestion: boolean;
}

function travelBetween(a: OrganizedItem, b: OrganizedItem) {
  if (a.latitude === null || a.longitude === null || b.latitude === null || b.longitude === null) {
    return null;
  }
  const distanceKm = haversineDistanceKm(
    { latitude: a.latitude, longitude: a.longitude },
    { latitude: b.latitude, longitude: b.longitude },
  );
  return { distanceKm, walkMinutes: estimateWalkMinutes(distanceKm) };
}

interface OrganizedDayResult {
  dayNumber: number;
  date: string | null;
  items: OrganizedItem[];
}

interface OrganizeResponse {
  itineraryTitle: string;
  days: OrganizedDayResult[];
}

function categoryLabel(category: string) {
  return ATTRACTION_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

function formatDayDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 animate-spin text-terracota"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-90"
      />
    </svg>
  );
}

function defaultNumDays(attractions: AIAttraction[]) {
  return Math.max(1, Math.ceil(attractions.length / 4));
}

export default function OrganizarComIAClient({
  itinerary,
  preferences,
  access,
}: {
  itinerary: ItineraryForAI | null;
  preferences: UserPreferences;
  access: AIAccessResult | null;
}) {
  const attractions = itinerary?.attractions ?? [];
  const cityCount = new Set(attractions.map((a) => a.citySlug)).size;

  const [numDays, setNumDays] = useState(() => defaultNumDays(attractions));
  const [startDate, setStartDate] = useState("");
  const [budget, setBudget] = useState<BudgetRange | null>(preferences.budget);
  const [pace, setPace] = useState<TravelPace | null>(preferences.pace);
  const [travelProfile, setTravelProfile] = useState<TravelProfile | null>(
    preferences.travelProfile,
  );
  const [travelingWithKids, setTravelingWithKids] = useState(
    preferences.travelsWithChildren,
  );
  const [childrenAgeRanges, setChildrenAgeRanges] = useState(
    preferences.childrenAgeRanges,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrganizeResponse | null>(null);
  const [excludedSuggestionIds, setExcludedSuggestionIds] = useState<Set<string>>(
    new Set(),
  );
  const [unlocked, setUnlocked] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  function excludeSuggestion(attractionId: string) {
    setExcludedSuggestionIds((prev) => new Set(prev).add(attractionId));
  }

  function toggleAgeRange(value: string) {
    setChildrenAgeRanges((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  async function handleGenerate() {
    if (!itinerary) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setExcludedSuggestionIds(new Set());

    try {
      const response = await fetch("/api/generate-itinerary-ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          itinerary_id: itinerary.itineraryId,
          num_days: numDays,
          start_date: startDate || null,
          preferences: {
            budget,
            travel_pace: pace,
            travel_profile: travelProfile,
            traveling_with_kids: travelingWithKids,
            children_age_ranges: childrenAgeRanges,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Não foi possível gerar o roteiro.");
      }

      setResult(data as OrganizeResponse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível gerar o roteiro.",
      );
    } finally {
      setLoading(false);
    }
  }

  function buildExportItinerary() {
    if (!result) return null;

    return {
      title: result.itineraryTitle,
      days: result.days.map((day) => ({
        dayNumber: day.dayNumber,
        date: day.date,
        items: day.items
          .filter((item) => !excludedSuggestionIds.has(item.attractionId))
          .map((item) => ({
            name: item.name,
            category: item.category,
            cityName: item.cityName,
            curationRating: item.curationRating,
            description: item.description,
            coverPhotoUrl: item.coverPhotoUrl,
            suggestedStartTime: item.suggestedStartTime,
            suggestedDurationMinutes: item.suggestedDurationMinutes,
            isSuggestion: item.isSuggestion,
          })),
      })),
    };
  }

  async function handleExportPDF() {
    const exportItinerary = buildExportItinerary();
    if (!exportItinerary) return;

    setExporting(true);
    setExportError(null);

    try {
      await exportItineraryToPDF(exportItinerary);
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : "Não foi possível gerar o PDF.",
      );
    } finally {
      setExporting(false);
    }
  }

  function handleAddToCalendar() {
    const exportItinerary = buildExportItinerary();
    if (!exportItinerary) return;

    setCalendarError(null);
    try {
      exportToGoogleCalendar(exportItinerary);
    } catch (err) {
      setCalendarError(
        err instanceof Error
          ? err.message
          : "Não foi possível gerar o arquivo da agenda.",
      );
    }
  }

  if (!itinerary || attractions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-branco p-8 text-center">
        <p className="font-serif text-lg text-tinta">
          Seu roteiro ainda está vazio
        </p>
        <p className="text-sm text-oliva">
          Adicione atrações ao seu roteiro antes de organizá-lo com a IA.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
        >
          Explorar destinos
        </Link>
      </div>
    );
  }

  if (access && !access.allowed && !unlocked) {
    return (
      <PaywallCard
        itineraryId={itinerary.itineraryId}
        countryCount={access.countryCount}
        onAccessGranted={() => setUnlocked(true)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl bg-branco p-5">
        <p className="text-tinta">
          Você tem <span className="font-medium">{attractions.length}</span>{" "}
          {attractions.length === 1 ? "atração" : "atrações"} em{" "}
          <span className="font-medium">{cityCount}</span>{" "}
          {cityCount === 1 ? "cidade" : "cidades"} no roteiro{" "}
          <span className="font-medium">&quot;{itinerary.title}&quot;</span>.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="num-days" className="text-sm font-medium text-tinta">
              Em quantos dias?
            </label>
            <input
              id="num-days"
              type="number"
              min={1}
              max={30}
              value={numDays}
              onChange={(event) => setNumDays(Number(event.target.value) || 1)}
              className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 text-sm text-tinta focus:border-terracota focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="start-date" className="text-sm font-medium text-tinta">
              Data de início (opcional)
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mt-1 w-full rounded-lg border border-oliva/30 bg-branco px-3 py-2 text-sm text-tinta focus:border-terracota focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-tinta">Perfil de viagem</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TRAVEL_PROFILES.map((option) => (
                <PillButton
                  key={option.value}
                  active={travelProfile === option.value}
                  onClick={() =>
                    setTravelProfile(travelProfile === option.value ? null : option.value)
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
                  active={pace === option.value}
                  onClick={() => setPace(pace === option.value ? null : option.value)}
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
                  active={budget === option.value}
                  onClick={() => setBudget(budget === option.value ? null : option.value)}
                >
                  {option.label}
                </PillButton>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-tinta">Viaja com crianças?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <PillButton
                active={travelingWithKids === true}
                onClick={() => setTravelingWithKids(true)}
              >
                Sim
              </PillButton>
              <PillButton
                active={travelingWithKids === false}
                onClick={() => {
                  setTravelingWithKids(false);
                  setChildrenAgeRanges([]);
                }}
              >
                Não
              </PillButton>
            </div>
          </div>

          {travelingWithKids && (
            <div>
              <p className="text-sm font-medium text-tinta">Faixas etárias</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {CHILDREN_AGE_RANGES.map((range) => (
                  <PillButton
                    key={range.value}
                    active={childrenAgeRanges.includes(range.value)}
                    onClick={() => toggleAgeRange(range.value)}
                  >
                    {range.label}
                  </PillButton>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 flex items-center gap-2 rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          {loading && <Spinner />}
          {loading ? "Organizando seu roteiro..." : "Gerar roteiro organizado"}
        </button>

        {error && <p className="mt-3 text-sm text-terracota">{error}</p>}
      </div>

      {result && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-branco p-5">
            <div>
              <p className="font-serif text-lg text-tinta">Roteiro organizado</p>
              <p className="text-sm text-oliva">
                Baixe um PDF, adicione à sua agenda ou compartilhe.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddToCalendar}
                className="flex items-center gap-2 rounded-full border-2 border-terracota px-5 py-2 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10"
              >
                Adicionar ao Google Agenda
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={exporting}
                className="flex items-center gap-2 rounded-full border-2 border-terracota px-5 py-2 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10 disabled:opacity-60"
              >
                {exporting && <Spinner />}
                {exporting ? "Gerando PDF..." : "Baixar PDF"}
              </button>
            </div>
          </div>
          {exportError && (
            <p className="-mt-3 text-sm text-terracota">{exportError}</p>
          )}
          {calendarError && (
            <p className="-mt-3 text-sm text-terracota">{calendarError}</p>
          )}

          {result.days.map((day) => (
            <div key={day.dayNumber} className="rounded-xl bg-branco p-5">
              <h3 className="font-serif text-lg text-tinta">Dia {day.dayNumber}</h3>
              {day.date && (
                <p className="text-sm capitalize text-oliva">{formatDayDate(day.date)}</p>
              )}

              <div className="mt-4 flex flex-col gap-3">
                {(() => {
                  const visibleItems = day.items.filter(
                    (item) => !excludedSuggestionIds.has(item.attractionId),
                  );

                  return visibleItems.map((item, index) => {
                    const next = visibleItems[index + 1];
                    const travelToNext = next ? travelBetween(item, next) : null;

                    return (
                      <div key={item.attractionId}>
                        <div
                          className={`flex items-center gap-3 rounded-lg p-3 ${
                            item.isSuggestion
                              ? "border-2 border-dashed border-oliva/40 bg-oliva/5"
                              : "border border-oliva/15"
                          }`}
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-areia">
                            {item.coverPhotoUrl && (
                              <img
                                src={item.coverPhotoUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            {item.isSuggestion && (
                              <span className="mb-1 inline-block rounded-full border border-oliva/30 bg-branco px-2 py-0.5 text-[11px] text-oliva">
                                Sugestão da IA
                              </span>
                            )}
                            <Link
                              href={`/${item.countrySlug}/${item.citySlug}/${item.slug}`}
                              className="block truncate font-serif text-base text-tinta transition-colors hover:text-terracota"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs uppercase tracking-wide text-oliva">
                              {categoryLabel(item.category)} · {item.cityName}
                            </p>
                          </div>
                          <div className="shrink-0 text-right text-xs text-oliva">
                            {item.suggestedStartTime && (
                              <p className="font-medium text-tinta">
                                {item.suggestedStartTime}
                              </p>
                            )}
                            {item.suggestedDurationMinutes && (
                              <p>≈ {item.suggestedDurationMinutes} min</p>
                            )}
                            {item.isSuggestion && (
                              <button
                                type="button"
                                onClick={() => excludeSuggestion(item.attractionId)}
                                className="mt-1 text-terracota hover:underline"
                              >
                                Excluir sugestão
                              </button>
                            )}
                          </div>
                        </div>

                        {travelToNext && (
                          <p className="ml-3 mt-1 border-l-2 border-oliva/20 py-1 pl-4 text-xs text-oliva">
                            {formatDistanceKm(travelToNext.distanceKm)} até a
                            próxima · ≈ {travelToNext.walkMinutes} min a pé
                          </p>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
