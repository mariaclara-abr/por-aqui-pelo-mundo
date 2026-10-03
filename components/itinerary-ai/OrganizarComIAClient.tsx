"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PillButton from "@/components/PillButton";
import PremiumDialog from "@/components/PremiumDialog";
import ItinerarySwitcherDialog from "@/components/ItinerarySwitcherDialog";
import { useUserSubscription } from "@/lib/useUserSubscription";
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
import type { TipoRoteiro } from "@/lib/prompts/roteiro-scripts";
import {
  budgetHint,
  MAX_DAYS_WITH_BUDGET_RANGE,
  FIELDS_BY_TIPO,
  PACE_HINTS,
  SHOWS,
  TIPO_HELP,
  TIPO_TABS,
  type ExtraField,
} from "./tipo-roteiro-fields";
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

interface LodgingResult {
  hasHotel: boolean;
  hotelDetails: string | null;
  neighborhoods: { cityName: string; neighborhood: string; reason: string }[];
  siteHotels: {
    name: string;
    slug: string;
    citySlug: string;
    countrySlug: string;
    cityName: string;
  }[];
}

interface OrganizeResponse {
  orderNote?: string | null;
  addedCities?: string[];
  itineraryTitle: string;
  days: OrganizedDayResult[];
  lodging: LodgingResult | null;
}

interface QuestionsResponse {
  questions: string[];
}

const Obrigatorio = () => <span className="ml-1 text-terracota" aria-label="obrigatório">*</span>;

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
  userId,
}: {
  itinerary: ItineraryForAI | null;
  preferences: UserPreferences;
  destinationCities: DestinationPickerCity[];
  userId: string;
}) {
  const router = useRouter();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const attractions = itinerary?.attractions ?? [];
  const cityCount = new Set(attractions.map((a) => a.citySlug)).size;
  const hasCurrent = attractions.length > 0;
  // Com roteiro em andamento o padrão é partir dele; a pessoa pode preferir um roteiro do zero.
  const [startMode, setStartMode] = useState<"current" | "scratch">(
    hasCurrent ? "current" : "scratch",
  );

  const [numDays, setNumDays] = useState(() =>
    attractions.length > 0 ? defaultNumDays(attractions) : 3,
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Quem viaja (internacional): números e idade exata de cada menor, nunca deduzidos.
  const [adults, setAdults] = useState("");
  const [minorAges, setMinorAges] = useState<string[]>([]);
  const [aiQuestions, setAiQuestions] = useState<string[]>([]);
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
  const [interestOther, setInterestOther] = useState("");
  const [customBudget, setCustomBudget] = useState("");
  const [tipo, setTipo] = useState<TipoRoteiro>("internacional");
  // Respostas dos campos específicos de cada tipo, num objeto único: trocar de
  // aba não apaga nada. Texto livre de opções "Outra/Alergia" fica em "chave::opção".
  const [extra, setExtra] = useState<Record<string, string[]>>({});
  const extraFields = FIELDS_BY_TIPO[tipo];
  // Em "Viagem nacional", um roteiro com atrações fora do Brasil só pode ser refeito do zero.
  const currentHasForeign = attractions.some((a) => a.countrySlug !== "brasil");
  const canStartFromCurrent = hasCurrent && !(tipo === "nacional" && currentHasForeign);
  const isFromScratch = startMode === "scratch" || !canStartFromCurrent;
  const [selectedCitySlugs, setSelectedCitySlugs] = useState<Set<string>>(new Set());
  const [orderMode, setOrderMode] = useState<"ai" | "user">("ai");
  // Ordem manual dos destinos; slugs novos entram no fim (ver orderedCitySlugs).
  const [manualOrder, setManualOrder] = useState<string[]>([]);
  const [suggestCities, setSuggestCities] = useState(false);
  const [suggestCountries, setSuggestCountries] = useState(false);

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

  // Roteiro Único vale para 1 país só: bloqueia escolher destinos de outro país.
  const subscription = useUserSubscription();
  const limitOneCountry =
    !subscription.loading &&
    !subscription.isPremium &&
    !!itinerary &&
    subscription.hasRoteiroUnicoFor(itinerary.itineraryId);
  const selectedCountrySlugs = new Set(
    destinationCities.filter((c) => selectedCitySlugs.has(c.slug)).map((c) => c.countrySlug),
  );
  const isCountryLocked = (countrySlug: string) =>
    limitOneCountry && selectedCountrySlugs.size > 0 && !selectedCountrySlugs.has(countrySlug);

  const citiesByCountry = useMemo(() => {
    const map = new Map<
      string,
      { countryName: string; cities: DestinationPickerCity[] }
    >();
    for (const city of destinationCities) {
      // Brasil só aparece em "Viagem nacional", e ela só mostra o Brasil.
      if (tipo === "internacional" && city.countrySlug === "brasil") continue;
      if (tipo === "nacional" && city.countrySlug !== "brasil") continue;
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
  }, [destinationCities, tipo]);

  // Busca sem diferenciar maiúsculas nem acentos; bater no país mostra todas as cidades dele.
  const [destinationQuery, setDestinationQuery] = useState("");
  const visibleCountries = useMemo(() => {
    const normalize = (text: string) =>
      text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
    const query = normalize(destinationQuery.trim());
    if (!query) return citiesByCountry;
    return citiesByCountry.flatMap(([slug, entry]) => {
      if (normalize(entry.countryName).includes(query)) return [[slug, entry] as const];
      const cities = entry.cities.filter((c) => normalize(c.name).includes(query));
      return cities.length > 0 ? [[slug, { ...entry, cities }] as const] : [];
    });
  }, [citiesByCountry, destinationQuery]);

  const orderedCitySlugs = [
    ...manualOrder.filter((slug) => selectedCitySlugs.has(slug)),
    ...[...selectedCitySlugs].filter((slug) => !manualOrder.includes(slug)),
  ];

  function moveCity(slug: string, direction: -1 | 1) {
    const list = [...orderedCitySlugs];
    const from = list.indexOf(slug);
    const to = from + direction;
    if (to < 0 || to >= list.length) return;
    [list[from], list[to]] = [list[to], list[from]];
    setManualOrder(list);
  }

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

  function toggleExtra(field: ExtraField, option: string) {
    setExtra((prev) => {
      const current = prev[field.key] ?? [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : field.multi
          ? [...current, option]
          : [option];
      return { ...prev, [field.key]: next };
    });
  }

  function setDates(start: string, end: string) {
    setStartDate(start);
    setEndDate(end);
    if (start && end && end >= start) {
      const days = Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000) + 1;
      setNumDays(Math.min(90, days));
    }
  }

  function setMinorCount(count: number) {
    setMinorAges((prev) => Array.from({ length: count }, (_, i) => prev[i] ?? ""));
  }

  // Campos obrigatórios do fluxo internacional que ainda faltam.
  function missingRequired() {
    const missing: string[] = [];
    const filled = (key: string) => (extra[key] ?? []).some((v) => v.trim() !== "");
    if (!/^\d+$/.test(adults) || Number(adults) < 1) missing.push("número de adultos (18+)");
    if (minorAges.some((age) => !/^\d+$/.test(age) || Number(age) > 17)) {
      missing.push("idade exata de cada menor (0 a 17)");
    }
    if (!filled("saida")) missing.push("cidade de saída");
    if (!filled("volta")) missing.push("cidade de volta");
    if (!pace) missing.push("ritmo");
    if (!budget && !customBudget) missing.push("orçamento");
    if (!filled("deslocamento")) missing.push("deslocamento");
    return missing;
  }

  function extraLines() {
    const lines: { label: string; value: string }[] = [];
    if (tipo === "internacional") {
      const total = Number(adults || 0) + minorAges.length;
      lines.push({
        label: "Viajantes",
        value: `${total} no total: ${adults || 0} adulto(s) (18+) e ${minorAges.length} menor(es)${
          minorAges.length ? ` com idades exatas: ${minorAges.join(", ")} anos` : ""
        }`,
      });
      if (endDate) lines.push({ label: "Data final", value: endDate });
    }
    if (SHOWS.budget(tipo) && numDays > MAX_DAYS_WITH_BUDGET_RANGE && customBudget) {
      lines.push({
        label: "Orçamento médio por pessoa (sem passagens)",
        value: `R$ ${Number(customBudget).toLocaleString("pt-BR")}`,
      });
    }
    for (const field of extraFields) {
      // O hotel vai num campo próprio da requisição (lodging), não em extras.
      if (field.key === "tem_hotel") continue;
      const chosen = extra[field.key] ?? [];
      if (chosen.length === 0) continue;
      const value = chosen
        .map((option) => {
          const text = extra[`${field.key}::${option}`]?.[0]?.trim();
          return text ? `${option} (${text})` : option;
        })
        .join(", ");
      lines.push({ label: field.label, value });
    }
    if (tipo === "internacional" && extra.mirantes?.[0] === "sim") {
      lines.push({ label: "Interesse extra", value: "Mirantes" });
    }
    if (SHOWS.interests(tipo) && interestCategories.includes("outro") && interestOther.trim()) {
      lines.push({ label: "Outro interesse do viajante", value: interestOther.trim() });
    }
    const dias = extra.dias_parque?.[0];
    if (tipo === "parque_disney" && dias) {
      lines.push({ label: "Dias dedicados a parques", value: dias });
    }
    return lines;
  }

  // null quando a aba não pergunta de hotel ou a pessoa ainda não respondeu.
  function lodgingAnswer() {
    if (!extraFields.some((f) => f.key === "tem_hotel")) return null;
    const choice = extra.tem_hotel?.[0];
    if (!choice) return null;
    const hasHotel = choice === "Sim, já escolhi";
    return {
      has_hotel: hasHotel,
      hotel_details: hasHotel ? extra[`tem_hotel::${choice}`]?.[0]?.trim() || null : null,
    };
  }

  function renderExtraField(field: ExtraField) {
    const chosen = extra[field.key] ?? [];
    return (
      <div className="rounded-2xl bg-areia/45 p-4">
        <p className="text-sm font-medium text-tinta">
          {field.label}
          {field.required && <Obrigatorio />}
        </p>
        {field.hint && <p className="mt-0.5 text-xs text-oliva">{field.hint}</p>}
        {field.text && (
          <input
            type="text"
            maxLength={200}
            aria-label={field.label}
            placeholder={field.placeholder}
            value={chosen[0] ?? ""}
            onChange={(event) => setExtra((prev) => ({ ...prev, [field.key]: [event.target.value] }))}
            className="mt-2 w-full rounded-xl border border-oliva/25 bg-branco px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
          />
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {field.options.map((option) => (
            <PillButton
              key={option}
              active={chosen.includes(option)}
              onClick={() => toggleExtra(field, option)}
            >
              {option}
            </PillButton>
          ))}
        </div>
        {(field.textOn ?? [])
          .filter((option) => chosen.includes(option))
          .map((option) => (
            <input
              key={option}
              type="text"
              maxLength={200}
              aria-label={`${field.label}: detalhe de ${option}`}
              placeholder={field.placeholder ?? `Conte mais: ${option.toLowerCase()}`}
              value={extra[`${field.key}::${option}`]?.[0] ?? ""}
              onChange={(event) =>
                setExtra((prev) => ({
                  ...prev,
                  [`${field.key}::${option}`]: [event.target.value],
                }))
              }
              className="mt-2 w-full rounded-xl border border-oliva/25 bg-branco px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
            />
          ))}
      </div>
    );
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

    if (tipo === "internacional") {
      const missing = missingRequired();
      if (missing.length > 0) {
        setError(`Faltam campos obrigatórios: ${missing.join(", ")}.`);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setAiQuestions([]);
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
          tipo_roteiro: tipo,
          city_slugs: isFromScratch ? orderedCitySlugs : undefined,
          destination_order: orderMode,
          suggest_cities: isFromScratch && suggestCities,
          suggest_countries:
            isFromScratch && tipo === "internacional" && !limitOneCountry && suggestCountries,
          from_scratch: isFromScratch,
          preferences: {
            budget: SHOWS.budget(tipo) && numDays <= MAX_DAYS_WITH_BUDGET_RANGE ? budget : null,
            travel_pace: SHOWS.pace(tipo) ? pace : null,
            travel_profile: SHOWS.profile(tipo) ? travelProfile : null,
            traveling_with_kids: tipo === "internacional" ? minorAges.length > 0 : travelingWithKids,
            children_age_ranges: tipo === "internacional" ? [] : childrenAgeRanges,
            interest_categories: SHOWS.interests(tipo) ? interestCategories : [],
            notes: notes.trim() || null,
            extras: extraLines(),
          },
          lodging: lodgingAnswer(),
        }),
      });

      const data = (await response.json()) as
        | OrganizeResponse
        | GenerateErrorResponse
        | QuestionsResponse;

      if (response.ok && "questions" in data) {
        setAiQuestions(data.questions);
        return;
      }

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
      <section aria-labelledby="tipo-roteiro-titulo">
        <h2 id="tipo-roteiro-titulo" className="font-serif text-2xl text-branco">
          Que tipo de roteiro você quer?
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TIPO_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setTipo(tab.value);
                const hiddenByTab = (countrySlug: string) =>
                  (tab.value === "internacional" && countrySlug === "brasil") ||
                  (tab.value === "nacional" && countrySlug !== "brasil");
                const hidden = new Set(
                  destinationCities.filter((c) => hiddenByTab(c.countrySlug)).map((c) => c.slug),
                );
                setSelectedCitySlugs((prev) => new Set([...prev].filter((slug) => !hidden.has(slug))));
              }}
              aria-pressed={tipo === tab.value}
              className={`rounded-xl border-2 p-4 text-left transition-colors ${
                tipo === tab.value
                  ? "border-terracota bg-terracota text-white"
                  : "border-terracota/30 bg-branco text-tinta hover:border-terracota"
              }`}
            >
              <span className="block font-serif text-lg">{tab.label}</span>
              <span
                className={`mt-1 block text-sm ${tipo === tab.value ? "text-white/90" : "text-oliva"}`}
              >
                {tab.description}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-areia/90">{TIPO_HELP}</p>
      </section>

      {showPaywall && (
        <PremiumDialog
          itineraryId={itinerary.itineraryId}
          countryCount={paywallCountryCount}
          onClose={() => setShowPaywall(false)}
          onAccessGranted={() => setShowPaywall(false)}
          highlight="ia"
        />
      )}

      {switcherOpen && (
        <ItinerarySwitcherDialog
          userId={userId}
          currentItineraryId={itinerary.itineraryId}
          onClose={() => {
            setSwitcherOpen(false);
            router.refresh();
          }}
        />
      )}

      {hasCurrent && (
        <section aria-labelledby="ponto-partida-titulo">
          <h2 id="ponto-partida-titulo" className="font-serif text-2xl text-branco">
            Por onde começar?
          </h2>
          {canStartFromCurrent ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  value: "current" as const,
                  label: "Partir do meu roteiro",
                  description: `${attractions.length} ${attractions.length === 1 ? "lugar" : "lugares"} em ${cityCount} ${cityCount === 1 ? "cidade" : "cidades"}, organizados pela IA.`,
                },
                {
                  value: "scratch" as const,
                  label: "Gerar um roteiro do zero",
                  description: "A IA monta tudo a partir dos destinos que você escolher.",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStartMode(option.value)}
                  aria-pressed={startMode === option.value}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${
                    startMode === option.value
                      ? "border-terracota bg-terracota text-white"
                      : "border-terracota/30 bg-branco text-tinta hover:border-terracota"
                  }`}
                >
                  <span className="block font-serif text-lg">{option.label}</span>
                  <span
                    className={`mt-1 block text-sm ${startMode === option.value ? "text-white/90" : "text-oliva"}`}
                  >
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-areia/90">
              Seu roteiro atual tem destinos fora do Brasil, então na viagem nacional só dá para gerar um roteiro do zero.
            </p>
          )}
        </section>
      )}

      <div className="overflow-hidden rounded-2xl border border-areia/70 bg-branco shadow-[0_8px_30px_-20px_rgba(43,38,32,0.3)]">
        <div className="flex flex-col gap-5 border-b border-oliva/15 bg-areia/55 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
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
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {!isFromScratch && (
              <div className="flex divide-x divide-oliva/20 rounded-2xl border border-oliva/15 bg-branco/80 px-1 py-2 shadow-sm">
                <div className="px-4 text-center"><p className="font-serif text-xl text-tinta">{attractions.length}</p><p className="text-[10px] uppercase tracking-wider text-oliva">{attractions.length === 1 ? "lugar" : "lugares"}</p></div>
                <div className="px-4 text-center"><p className="font-serif text-xl text-tinta">{cityCount}</p><p className="text-[10px] uppercase tracking-wider text-oliva">{cityCount === 1 ? "cidade" : "cidades"}</p></div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSwitcherOpen(true)}
              className="flex min-h-11 items-center gap-2 rounded-full border-2 border-terracota px-5 py-2 text-sm font-semibold text-terracota transition-colors hover:bg-terracota hover:text-white"
            >
              Trocar de roteiro
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-8">
        {isFromScratch && (
          <div className="rounded-2xl bg-areia/45 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-medium text-tinta">Para onde você quer ir?</p>
              <Link
                href="/#destinos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-terracota underline-offset-2 hover:underline"
              >
                Conhecer melhor os destinos ↗
              </Link>
            </div>
            <p className="mt-1 text-xs text-oliva">
              {tipo === "nacional"
                ? "Escolha uma ou mais cidades do Brasil. A IA sugere atrações só dentro da curadoria desses destinos."
                : "Escolha um ou mais países ou cidades. A IA sugere atrações só dentro da curadoria desses destinos."}
            </p>
            {limitOneCountry && (
              <p className="mt-2 text-xs text-terracota">
                Seu Roteiro Único vale para 1 país. Para combinar países, assine o Premium.
              </p>
            )}
            <div className="relative mt-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-oliva"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={destinationQuery}
                onChange={(event) => setDestinationQuery(event.target.value)}
                aria-label="Pesquisar destino pelo nome"
                placeholder="Pesquisar país ou cidade"
                className="w-full rounded-xl border border-oliva/25 bg-branco py-2.5 pr-3.5 pl-10 text-sm text-tinta focus:border-terracota focus:outline-none"
              />
            </div>
            <div className="mt-3 flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
              {citiesByCountry.length === 0 && (
                <p className="text-sm text-oliva">Ainda não temos destinos cadastrados.</p>
              )}
              {citiesByCountry.length > 0 && visibleCountries.length === 0 && (
                <p className="text-sm text-oliva">Nenhum destino encontrado para essa busca.</p>
              )}
              {visibleCountries.map(([countrySlug, { countryName, cities }]) => {
                const citySlugs = cities.map((c) => c.slug);
                const allSelected = citySlugs.every((slug) => selectedCitySlugs.has(slug));
                const someSelected = citySlugs.some((slug) => selectedCitySlugs.has(slug));
                const locked = isCountryLocked(countrySlug);
                return (
                  <div
                    key={countrySlug}
                    className={`rounded-xl border border-oliva/15 bg-branco/60 p-3 ${locked ? "opacity-50" : ""}`}
                  >
                    {tipo === "nacional" ? (
                      <p className="text-sm font-medium text-tinta">{countryName}</p>
                    ) : (
                    <label className="flex items-center gap-2 text-sm font-medium text-tinta">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        disabled={locked}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={() => toggleCountry(citySlugs)}
                        className="h-4 w-4 rounded border-oliva/40 text-terracota focus:ring-terracota"
                      />
                      {countryName}
                    </label>
                    )}
                    <div className="mt-2 ml-6 flex flex-wrap gap-x-4 gap-y-1.5">
                      {cities.map((city) => (
                        <label
                          key={city.slug}
                          className="flex items-center gap-1.5 text-xs text-oliva"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCitySlugs.has(city.slug)}
                            disabled={locked}
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

        {isFromScratch && (
          <div className="mt-4 flex flex-col gap-4">
            {selectedCitySlugs.size > 1 && (
              <div className="rounded-2xl bg-areia/45 p-4">
                <p className="text-sm font-medium text-tinta">Em que ordem visitar os destinos?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <PillButton active={orderMode === "ai"} onClick={() => setOrderMode("ai")}>
                    A IA sugere a melhor ordem
                  </PillButton>
                  <PillButton active={orderMode === "user"} onClick={() => setOrderMode("user")}>
                    Já sei a ordem
                  </PillButton>
                </div>
                {orderMode === "user" && (
                  <ol className="mt-3 flex flex-col gap-1.5">
                    {orderedCitySlugs.map((slug, index) => {
                      const name = destinationCities.find((c) => c.slug === slug)?.name ?? slug;
                      return (
                        <li
                          key={slug}
                          className="flex items-center gap-2 rounded-xl bg-branco/70 px-3 py-1.5 text-sm text-tinta"
                        >
                          <span className="w-5 text-oliva">{index + 1}.</span>
                          <span className="flex-1">{name}</span>
                          <button
                            type="button"
                            onClick={() => moveCity(slug, -1)}
                            disabled={index === 0}
                            aria-label={`Subir ${name}`}
                            className="min-h-8 min-w-8 rounded-full text-terracota disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCity(slug, 1)}
                            disabled={index === orderedCitySlugs.length - 1}
                            aria-label={`Descer ${name}`}
                            className="min-h-8 min-w-8 rounded-full text-terracota disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            )}
            <div className="rounded-2xl bg-areia/45 p-4">
              <p className="text-sm font-medium text-tinta">
                A IA pode sugerir outras cidades que combinem?
              </p>
              <p className="mt-0.5 text-xs text-oliva">
                Ela escolhe só entre as cidades da nossa curadoria nos mesmos países, de acordo
                com o que você pediu para a viagem.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <PillButton active={suggestCities} onClick={() => setSuggestCities(true)}>
                  Sim, pode sugerir
                </PillButton>
                <PillButton active={!suggestCities} onClick={() => setSuggestCities(false)}>
                  Não, só as que escolhi
                </PillButton>
              </div>
            </div>
            {tipo === "internacional" && (
              <div className="rounded-2xl bg-areia/45 p-4">
                <p className="text-sm font-medium text-tinta">
                  A IA pode sugerir outro país que combine?
                </p>
                <p className="mt-0.5 text-xs text-oliva">
                  {limitOneCountry
                    ? "Seu Roteiro Único vale para 1 país. Para combinar países, assine o Premium."
                    : "Ela escolhe só entre os países da nossa curadoria, de acordo com o que você pediu para a viagem."}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <PillButton
                    active={suggestCountries && !limitOneCountry}
                    onClick={() => !limitOneCountry && setSuggestCountries(true)}
                  >
                    Sim, pode sugerir
                  </PillButton>
                  <PillButton
                    active={!suggestCountries || limitOneCountry}
                    onClick={() => setSuggestCountries(false)}
                  >
                    Não, só os que escolhi
                  </PillButton>
                </div>
              </div>
            )}
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
              max={90}
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
              onChange={(event) => setDates(event.target.value, endDate)}
              className="mt-1 w-full rounded-xl border border-oliva/25 bg-areia/25 px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
            />
          </div>
          {tipo === "internacional" && (
            <div>
              <label htmlFor="end-date" className="text-sm font-medium text-tinta">
                Data final (opcional, ajusta os dias)
              </label>
              <input
                id="end-date"
                type="date"
                min={startDate || undefined}
                value={endDate}
                onChange={(event) => setDates(startDate, event.target.value)}
                className="mt-1 w-full rounded-xl border border-oliva/25 bg-areia/25 px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
              />
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-tinta/10 pt-7">
          <div className="flex items-end justify-between gap-4"><div><p className="font-serif text-xl text-tinta">Personalize a experiência</p><p className="mt-1 text-sm text-oliva">Você pode usar as preferências salvas ou ajustar para esta viagem.</p></div><span className="hidden text-2xl text-terracota sm:block">✦</span></div>
        <div className="mt-6 flex flex-col gap-5">
          {SHOWS.profile(tipo) && (
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
          )}

          {SHOWS.pace(tipo) && (
          <div className="rounded-2xl bg-areia/45 p-4">
            <p className="text-sm font-medium text-tinta">Ritmo preferido{tipo === "internacional" && <Obrigatorio />}</p>
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
            {pace && (
              <p className="mt-2 text-xs text-oliva">{PACE_HINTS[pace]}</p>
            )}
          </div>
          )}

          {SHOWS.budget(tipo) && (
          <div className="rounded-2xl bg-areia/45 p-4">
            <p className="text-sm font-medium text-tinta">Faixa de orçamento{tipo === "internacional" && <Obrigatorio />}</p>
            {numDays > MAX_DAYS_WITH_BUDGET_RANGE ? (
              <>
                <p className="mt-0.5 text-xs text-oliva">
                  Para viagens longas, informe o valor médio por pessoa, em reais, sem contar passagens.
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label="Valor médio por pessoa, em reais"
                  placeholder="Ex.: 30000"
                  value={customBudget}
                  onChange={(event) => setCustomBudget(event.target.value.replace(/\D/g, "").slice(0, 9))}
                  className="mt-2 w-full max-w-xs rounded-xl border border-oliva/25 bg-branco px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
                />
              </>
            ) : (
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
            )}
            {numDays <= MAX_DAYS_WITH_BUDGET_RANGE && budget && (
              <p className="mt-2 text-xs text-oliva">{budgetHint(tipo, budget, numDays)}</p>
            )}
          </div>
          )}

          {SHOWS.interests(tipo) && (
          <div className="rounded-2xl bg-areia/45 p-4">
            <p className="text-sm font-medium text-tinta">Interesses</p>
            <p className="mt-0.5 text-xs text-oliva">O que não pode faltar no seu roteiro?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ATTRACTION_CATEGORIES.filter(
                (option) => !(tipo === "internacional" && option.value === "estacionamentos"),
              ).map((option) => (
                <PillButton
                  key={option.value}
                  active={interestCategories.includes(option.value)}
                  onClick={() => toggleInterestCategory(option.value)}
                >
                  {option.label}
                </PillButton>
              ))}
              {tipo === "internacional" && (
                <PillButton
                  active={extra.mirantes?.[0] === "sim"}
                  onClick={() =>
                    setExtra((prev) => ({ ...prev, mirantes: prev.mirantes?.[0] === "sim" ? [] : ["sim"] }))
                  }
                >
                  Mirantes
                </PillButton>
              )}
            </div>
            {interestCategories.includes("outro") && (
              <input
                type="text"
                maxLength={200}
                aria-label="Interesses: detalhe de Outro"
                placeholder="Escreva o que você quer no roteiro"
                value={interestOther}
                onChange={(event) => setInterestOther(event.target.value)}
                className="mt-2 w-full rounded-xl border border-oliva/25 bg-branco px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
              />
            )}
          </div>
          )}

          {extraFields.map((field) => (
            <Fragment key={field.key}>
              {renderExtraField(field)}
              {tipo === "parque_disney" && field.key === "parques" && (
                <div className="rounded-2xl bg-areia/45 p-4">
                  <label htmlFor="dias-parque" className="text-sm font-medium text-tinta">
                    Quantos dias dedicados a parque(s)?
                  </label>
                  <p className="mt-0.5 text-xs text-oliva">
                    Pode ser igual ou menor que o total de dias da viagem.
                  </p>
                  <input
                    id="dias-parque"
                    type="number"
                    min={1}
                    max={numDays}
                    value={extra.dias_parque?.[0] ?? ""}
                    onChange={(event) => {
                      const n = Math.min(numDays, Math.max(1, Number(event.target.value) || 0));
                      setExtra((prev) => ({
                        ...prev,
                        dias_parque: event.target.value === "" ? [] : [String(n)],
                      }));
                    }}
                    className="mt-2 w-32 rounded-xl border border-oliva/25 bg-branco px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
                  />
                </div>
              )}
            </Fragment>
          ))}

          {tipo === "internacional" && (
            <div className="rounded-2xl bg-areia/45 p-4">
              <p className="text-sm font-medium text-tinta">
                Quem viaja
                <Obrigatorio />
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:max-w-sm">
                <label className="text-xs text-oliva">
                  Adultos (18+)
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={adults}
                    onChange={(event) => setAdults(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-oliva/25 bg-branco px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
                  />
                </label>
                <label className="text-xs text-oliva">
                  Menores (0 a 17)
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={minorAges.length}
                    onChange={(event) => setMinorCount(Math.min(10, Math.max(0, Number(event.target.value) || 0)))}
                    className="mt-1 w-full rounded-xl border border-oliva/25 bg-branco px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
                  />
                </label>
              </div>
              {minorAges.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {minorAges.map((age, index) => (
                    <label key={index} className="text-xs text-oliva">
                      Idade do menor {index + 1}
                      <input
                        type="number"
                        min={0}
                        max={17}
                        value={age}
                        onChange={(event) =>
                          setMinorAges((prev) => prev.map((v, i) => (i === index ? event.target.value : v)))
                        }
                        className="mt-1 block w-24 rounded-xl border border-oliva/25 bg-branco px-3.5 py-2.5 text-sm text-tinta focus:border-terracota focus:outline-none"
                      />
                    </label>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-oliva">
                Total: {Number(adults || 0) + minorAges.length} viajante(s).
              </p>
            </div>
          )}

          {tipo !== "internacional" && (
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

          )}

          {tipo !== "internacional" && travelingWithKids && (
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
        {aiQuestions.length > 0 && (
          <div role="status" className="mt-3 rounded-2xl border border-terracota/30 bg-areia/45 p-4">
            <p className="text-sm font-medium text-tinta">Antes de gerar, a IA precisa saber:</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-tinta">
              {aiQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-oliva">
              Responda em &quot;Mais observações&quot; (ou ajuste os campos acima) e gere de novo.
            </p>
          </div>
        )}
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
            <div className="flex max-w-full flex-wrap gap-2">
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
            <p className="-mt-3 rounded-xl bg-branco px-5 py-3 text-sm text-oliva">
              Roteiro salvo! Você já pode ver e ajustar tudo em{" "}
              <Link href="/meu-roteiro" className="text-terracota hover:underline">
                Meu Roteiro
              </Link>
              .
            </p>
          )}
          {saveError && <p className="-mt-3 rounded-xl bg-branco px-5 py-3 text-sm text-terracota">{saveError}</p>}
          {exportError && (
            <p className="-mt-3 rounded-xl bg-branco px-5 py-3 text-sm text-terracota">{exportError}</p>
          )}
          {calendarError && (
            <p className="-mt-3 rounded-xl bg-branco px-5 py-3 text-sm text-terracota">{calendarError}</p>
          )}

          {result.addedCities && result.addedCities.length > 0 && (
            <p className="rounded-xl bg-branco px-5 py-3 text-sm text-oliva">
              A IA incluiu {result.addedCities.join(", ")} no roteiro por combinar com o que você
              pediu.
            </p>
          )}

          {result.orderNote && (
            <div className="rounded-[22px] border border-tinta/10 bg-branco p-5">
              <h3 className="font-serif text-lg text-tinta">Ordem das cidades</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-tinta">{result.orderNote}</p>
            </div>
          )}

          {result.lodging && !result.lodging.hasHotel && (
            <div className="rounded-[22px] border border-tinta/10 bg-branco p-5 shadow-[0_14px_35px_-28px_rgba(43,38,32,0.55)]">
              <h3 className="font-serif text-lg text-tinta">Onde ficar</h3>
              {result.lodging.neighborhoods.map((n) => (
                <p key={n.cityName} className="mt-2 text-sm text-tinta">
                  <span className="font-medium">{n.cityName}: {n.neighborhood}.</span>{" "}
                  <span className="text-oliva">{n.reason}</span>
                </p>
              ))}
              {result.lodging.siteHotels.length > 0 && (
                <>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-oliva">
                    Hotéis da nossa curadoria
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {result.lodging.siteHotels.map((hotel) => (
                      <li key={hotel.slug} className="text-sm">
                        <Link
                          href={`/${hotel.countrySlug}/${hotel.citySlug}/${hotel.slug}`}
                          className="text-terracota hover:underline"
                        >
                          {hotel.name}
                        </Link>{" "}
                        <span className="text-oliva">({hotel.cityName})</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
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
