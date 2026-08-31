"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PillButton from "@/components/PillButton";
import PremiumDialog from "@/components/PremiumDialog";
import { addAccountItem } from "@/lib/itinerary-queries";
import {
  estimateWalkMinutes,
  formatDistanceKm,
  haversineDistanceKm,
} from "@/lib/recommendations";
import type { DestinationPickerCity } from "@/lib/queries";
import {
  ATTRACTION_CATEGORIES,
  BUDGET_RANGES,
  categoryLabels,
  CHILDREN_AGE_RANGES,
  TRAVEL_PACES,
  TRAVEL_PROFILES,
  type AttractionCategory,
  type BudgetRange,
  type TravelPace,
  type TravelProfile,
  type UserPreferences,
} from "@/types/database";
import type { AIAttraction, ItineraryForAI } from "@/lib/itinerary-ai";
import { exportItineraryToPDF, exportToGoogleCalendar } from "@/lib/export";

interface OrganizedItem {
  attractionId: string;
  name: string;
  slug: string;
  citySlug: string;
  countrySlug: string;
  cityName: string;
  categories: string[];
  curationRating: number | null;
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

interface GenerateErrorResponse {
  error?: string;
  countryCount?: number;
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
  destinationCities,
}: {
  itinerary: ItineraryForAI | null;
  preferences: UserPreferences;
  destinationCities: DestinationPickerCity[];
}) {
  const attractions = itinerary?.attractions ?? [];
  const cityCount = new Set(attractions.map((a) => a.citySlug)).size;
  const isFromScratch = attractions.length === 0;

  const [numDays, setNumDays] = useState(() =>
    attractions.length > 0 ? defaultNumDays(attractions) : 3,
  );
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
  const [interestCategories, setInterestCategories] = useState<AttractionCategory[]>(
    preferences.interestCategories,
  );
  const [notes, setNotes] = useState("");
  const [selectedCitySlugs, setSelectedCitySlugs] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrganizeResponse | null>(null);
  const [excludedSuggestionIds, setExcludedSuggestionIds] = useState<Set<string>>(
    new Set(),
  );
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallCountryCount, setPaywallCountryCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const citiesByCountry = useMemo(() => {
    const map = new Map<
      string,
      { countryName: string; cities: DestinationPickerCity[] }
    >();
    for (const city of destinationCities) {
      const entry = map.get(city.countrySlug) ?? {
        countryName: city.countryName,
        cities: [],
      };
      entry.cities.push(city);
      map.set(city.countrySlug, entry);
    }
    return [...map.entries()].sort((a, b) =>
      a[1].countryName.localeCompare(b[1].countryName),
    );
  }, [destinationCities]);

  function toggleCity(slug: string) {
    setSelectedCitySlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleCountry(citySlugs: string[]) {
    setSelectedCitySlugs((prev) => {
      const allSelected = citySlugs.every((slug) => prev.has(slug));
      const next = new Set(prev);
      for (const slug of citySlugs) {
        if (allSelected) next.delete(slug);
        else next.add(slug);
      }
      return next;
    });
  }

  function excludeSuggestion(attractionId: string) {
    setExcludedSuggestionIds((prev) => new Set(prev).add(attractionId));
  }

  function toggleAgeRange(value: string) {
    setChildrenAgeRanges((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function toggleInterestCategory(value: AttractionCategory) {
    setInterestCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  async function handleGenerate() {
    if (!itinerary) return;

    if (isFromScratch && selectedCitySlugs.size === 0) {
      setError("Escolha pelo menos um destino para a IA montar o roteiro.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setExcludedSuggestionIds(new Set());
    setSaved(false);
    setSaveError(null);

    try {
      const response = await fetch("/api/generate-itinerary-ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          itinerary_id: itinerary.itineraryId,
          num_days: numDays,
          start_date: startDate || null,
          city_slugs: isFromScratch ? Array.from(selectedCitySlugs) : undefined,
          preferences: {
            budget,
            travel_pace: pace,
            travel_profile: travelProfile,
            traveling_with_kids: travelingWithKids,
            children_age_ranges: childrenAgeRanges,
            interest_categories: interestCategories,
            notes: notes.trim() || null,
          },
        }),
      });

      const data = (await response.json()) as OrganizeResponse | GenerateErrorResponse;

      if (response.status === 403) {
        const errorData = data as GenerateErrorResponse;
        setPaywallCountryCount(
          typeof errorData.countryCount === "number" ? errorData.countryCount : 0,
        );
        setShowPaywall(true);
        return;
      }

      if (!response.ok) {
        throw new Error(
          (data as GenerateErrorResponse)?.error ?? "Não foi possível gerar o roteiro.",
        );
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
            categories: item.categories,
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

  async function handleSaveToRoteiro() {
    if (!result || !itinerary) return;

    const orderedIds = result.days
      .flatMap((day) => day.items)
      .filter((item) => !excludedSuggestionIds.has(item.attractionId))
      .map((item) => item.attractionId);
    if (orderedIds.length === 0) return;

    setSaving(true);
    setSaveError(null);

    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await addAccountItem(itinerary.itineraryId, orderedIds[i], i);
      }
      setSaved(true);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Não foi possível salvar o roteiro.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!itinerary) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-branco p-8 text-center">
        <p className="font-serif text-lg text-tinta">
          Não foi possível carregar seu roteiro
        </p>
        <p className="text-sm text-oliva">Tente novamente em instantes.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {showPaywall && (
        <PremiumDialog
          itineraryId={itinerary.itineraryId}
          countryCount={paywallCountryCount}
          onClose={() => setShowPaywall(false)}
          onAccessGranted={() => setShowPaywall(false)}
        />
      )}

      <div className="overflow-hidden rounded-[28px] border border-tinta/10 bg-branco shadow-[0_18px_45px_-34px_rgba(43,38,32,0.55)]">
        <div className="flex flex-col gap-5 border-b border-tinta/10 bg-[linear-gradient(110deg,#fff_5%,#f7efe1_100%)] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          {isFromScratch ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-terracota">Roteiro do zero</p>
              <h2 className="mt-1 font-serif text-2xl text-tinta">Para onde a IA vai te levar?</h2>
              <p className="mt-1 text-sm text-oliva">Escolha os destinos e as preferências, e a IA monta o roteiro inteiro com a curadoria do site.</p>
            </div>
          ) : (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-terracota">Seu ponto de partida</p>
              <h2 className="mt-1 font-serif text-2xl text-tinta">{itinerary.title}</h2>
              <p className="mt-1 text-sm text-oliva">Conte para a IA como você quer viver essa viagem.</p>
            </div>
          )}
          {!isFromScratch && (
            <div className="flex shrink-0 divide-x divide-oliva/20 rounded-2xl border border-oliva/15 bg-branco/80 px-1 py-2 shadow-sm">
              <div className="px-4 text-center"><p className="font-serif text-xl text-tinta">{attractions.length}</p><p className="text-[10px] uppercase tracking-wider text-oliva">{attractions.length === 1 ? "lugar" : "lugares"}</p></div>
              <div className="px-4 text-center"><p className="font-serif text-xl text-tinta">{cityCount}</p><p className="text-[10px] uppercase tracking-wider text-oliva">{cityCount === 1 ? "cidade" : "cidades"}</p></div>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-8">
        {isFromScratch && (
          <div className="rounded-2xl bg-areia/45 p-4">
            <p className="text-sm font-medium text-tinta">Para onde você quer ir?</p>
            <p className="mt-1 text-xs text-oliva">
              Escolha um ou mais países ou cidades. A IA sugere atrações só dentro da curadoria desses destinos.
            </p>
            <div className="mt-3 flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
              {citiesByCountry.length === 0 && (
                <p className="text-sm text-oliva">Ainda não temos destinos cadastrados.</p>
              )}
              {citiesByCountry.map(([countrySlug, { countryName, cities }]) => {
                const citySlugs = cities.map((c) => c.slug);
                const allSelected = citySlugs.every((slug) => selectedCitySlugs.has(slug));
                const someSelected = citySlugs.some((slug) => selectedCitySlugs.has(slug));
                return (
                  <div
                    key={countrySlug}
                    className="rounded-xl border border-oliva/15 bg-branco/60 p-3"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-tinta">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={() => toggleCountry(citySlugs)}
                        className="h-4 w-4 rounded border-oliva/40 text-terracota focus:ring-terracota"
                      />
                      {countryName}
                    </label>
                    <div className="mt-2 ml-6 flex flex-wrap gap-x-4 gap-y-1.5">
                      {cities.map((city) => (
                        <label
                          key={city.slug}
                          className="flex items-center gap-1.5 text-xs text-oliva"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCitySlugs.has(city.slug)}
                            onChange={() => toggleCity(city.slug)}
                            className="h-3.5 w-3.5 rounded border-oliva/40 text-terracota focus:ring-terracota"
                          />
                          {city.name}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${isFromScratch ? "mt-6" : ""}`}>
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
              className="mt-1 w-full rounded-xl border border-oliva/25 bg-areia/25 px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
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
              className="mt-1 w-full rounded-xl border border-oliva/25 bg-areia/25 px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8 border-t border-tinta/10 pt-7">
          <div className="flex items-end justify-between gap-4"><div><p className="font-serif text-xl text-tinta">Personalize a experiência</p><p className="mt-1 text-sm text-oliva">Você pode usar as preferências salvas ou ajustar para esta viagem.</p></div><span className="hidden text-2xl text-terracota sm:block">✦</span></div>
        <div className="mt-6 flex flex-col gap-5">
          <div className="rounded-2xl bg-areia/45 p-4">
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

          <div className="rounded-2xl bg-areia/45 p-4">
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

          <div className="rounded-2xl bg-areia/45 p-4">
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

          <div className="rounded-2xl bg-areia/45 p-4">
            <p className="text-sm font-medium text-tinta">Interesses</p>
            <p className="mt-0.5 text-xs text-oliva">O que não pode faltar no seu roteiro?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ATTRACTION_CATEGORIES.map((option) => (
                <PillButton
                  key={option.value}
                  active={interestCategories.includes(option.value)}
                  onClick={() => toggleInterestCategory(option.value)}
                >
                  {option.label}
                </PillButton>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-areia/45 p-4">
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
            <div className="rounded-2xl border border-oliva/15 bg-oliva/5 p-4">
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

          <div className="rounded-2xl bg-areia/45 p-4">
            <label htmlFor="ai-notes" className="text-sm font-medium text-tinta">
              Mais observações
            </label>
            <p className="mt-0.5 text-xs text-oliva">
              Conte pra IA qualquer detalhe extra: ocasião especial, restrição alimentar, o que não pode faltar...
            </p>
            <textarea
              id="ai-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Ex.: estamos comemorando aniversário de casamento, preferimos evitar filas longas..."
              className="mt-2 w-full resize-none rounded-xl border border-oliva/25 bg-branco px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
            />
          </div>
        </div>

        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-tinta/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-xs leading-5 text-oliva">A IA trabalha somente com a curadoria real do site e identifica novas sugestões sempre marcadas para sua revisão.</p>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-full bg-terracota px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_-10px_rgba(193,101,58,0.9)] transition-all hover:-translate-y-0.5 hover:bg-terracota/90 disabled:transform-none disabled:opacity-60"
        >
          {loading && <Spinner />}
          {loading
            ? "Organizando seu roteiro..."
            : isFromScratch
              ? "Gerar roteiro com IA"
              : "Gerar roteiro organizado"}
        </button>

        </div>
        {error && <p className="mt-3 text-sm text-terracota">{error}</p>}
        </div>
      </div>

      {result && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-tinta/10 bg-branco p-5 shadow-[0_14px_35px_-28px_rgba(43,38,32,0.55)]">
            <div>
              <p className="font-serif text-lg text-tinta">Roteiro organizado</p>
              <p className="text-sm text-oliva">
                {isFromScratch
                  ? "Revise as sugestões, exclua o que não combinar e salve no seu roteiro."
                  : "Baixe um PDF, adicione à sua agenda ou compartilhe."}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {isFromScratch && (
                <button
                  type="button"
                  onClick={handleSaveToRoteiro}
                  disabled={saving || saved}
                  className="flex items-center gap-2 rounded-full bg-terracota px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
                >
                  {saving && <Spinner />}
                  {saved ? "Salvo no roteiro" : saving ? "Salvando..." : "Salvar no meu roteiro"}
                </button>
              )}
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
          {saved && (
            <p className="-mt-3 text-sm text-oliva">
              Roteiro salvo! Você já pode ver e ajustar tudo em{" "}
              <Link href="/meu-roteiro" className="text-terracota hover:underline">
                Meu Roteiro
              </Link>
              .
            </p>
          )}
          {saveError && <p className="-mt-3 text-sm text-terracota">{saveError}</p>}
          {exportError && (
            <p className="-mt-3 text-sm text-terracota">{exportError}</p>
          )}
          {calendarError && (
            <p className="-mt-3 text-sm text-terracota">{calendarError}</p>
          )}

          {result.days.map((day) => (
            <div key={day.dayNumber} className="rounded-[22px] border border-tinta/10 bg-branco p-5 shadow-[0_14px_35px_-28px_rgba(43,38,32,0.55)]">
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
                              {categoryLabels(item.categories)} · {item.cityName}
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
                            {travelToNext.walkMinutes < 30
                              ? `${formatDistanceKm(travelToNext.distanceKm)} até a próxima · ≈ ${travelToNext.walkMinutes} min a pé`
                              : `${formatDistanceKm(travelToNext.distanceKm)} até a próxima`}
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
