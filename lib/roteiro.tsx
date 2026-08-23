"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth";
import { useUserSubscription } from "@/lib/useUserSubscription";
import { getAttractionsSummaryByIds } from "@/lib/queries";
import {
  addAccountItem,
  createItineraryRow,
  getItineraryTitle,
  getOrCreateCurrentItinerary,
  loadAccountItems,
  migrateLocalItemsToAccount,
  removeAccountItem,
  renameItinerary as renameItineraryQuery,
  reorderAccountItems,
  setCurrentItineraryId,
} from "@/lib/itinerary-queries";
import { canAddCountryToItinerary } from "@/lib/itinerary-country-limit";
import { humanizeSlug } from "@/lib/affiliates";
import ConfirmDialog from "@/components/ConfirmDialog";
import PremiumDialog from "@/components/PremiumDialog";
import type { AttractionCategory } from "@/types/database";

const STORAGE_KEY = "roteiro-local-v1";
const DEFAULT_TITLE = "Meu Roteiro";

export interface RoteiroAttraction {
  id: string;
  name: string;
  slug: string;
  category: AttractionCategory;
  curationRating: number | null;
  latitude: number | null;
  longitude: number | null;
  coverPhotoUrl: string | null;
  citySlug: string;
  countrySlug: string;
}

export interface RoteiroItem {
  itemId: string;
  order: number;
  attraction: RoteiroAttraction;
}

interface AttractionFields {
  id: string;
  name: string;
  slug: string;
  category: AttractionCategory;
  curation_rating: number | null;
  latitude: number | null;
  longitude: number | null;
  attraction_photos: { url: string; order: number }[];
}

interface RawAttractionSummary extends AttractionFields {
  cities: { slug: string; countries: { slug: string } | null } | null;
}

export function attractionToRoteiroSummary(
  attraction: AttractionFields,
  countrySlug: string,
  citySlug: string,
): RoteiroAttraction {
  const cover = [...attraction.attraction_photos].sort(
    (a, b) => a.order - b.order,
  )[0];

  return {
    id: attraction.id,
    name: attraction.name,
    slug: attraction.slug,
    category: attraction.category,
    curationRating: attraction.curation_rating,
    latitude: attraction.latitude,
    longitude: attraction.longitude,
    coverPhotoUrl: cover?.url ?? null,
    citySlug,
    countrySlug,
  };
}

function mapAttractionRow(row: RawAttractionSummary): RoteiroAttraction {
  return attractionToRoteiroSummary(
    row,
    row.cities?.countries?.slug ?? "",
    row.cities?.slug ?? "",
  );
}

interface RoteiroContextValue {
  items: RoteiroItem[];
  loading: boolean;
  title: string;
  canRename: boolean;
  itineraryId: string | null;
  isInRoteiro: (attractionId: string) => boolean;
  addItem: (attraction: RoteiroAttraction) => Promise<void>;
  removeItem: (attractionId: string) => Promise<void>;
  clearItems: () => Promise<void>;
  reorder: (orderedAttractionIds: string[]) => Promise<void>;
  renameItinerary: (title: string) => Promise<void>;
  refresh: () => Promise<void>;
  switchItinerary: (itineraryId: string, itineraryTitle: string) => Promise<void>;
  createNewItinerary: () => Promise<void>;
}

const RoteiroContext = createContext<RoteiroContextValue>({
  items: [],
  loading: true,
  title: DEFAULT_TITLE,
  canRename: false,
  itineraryId: null,
  isInRoteiro: () => false,
  addItem: async () => {},
  removeItem: async () => {},
  clearItems: async () => {},
  reorder: async () => {},
  renameItinerary: async () => {},
  refresh: async () => {},
  switchItinerary: async () => {},
  createNewItinerary: async () => {},
});

function readLocalIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function RoteiroProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isPremium } = useUserSubscription();
  const [items, setItems] = useState<RoteiroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itineraryId, setItineraryId] = useState<string | null>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [countryConflict, setCountryConflict] = useState<{
    attraction: RoteiroAttraction;
  } | null>(null);
  const [creatingConflictItinerary, setCreatingConflictItinerary] =
    useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function sync() {
      setLoading(true);

      try {
        if (user) {
          const { id, title: fetchedTitle } = await getOrCreateCurrentItinerary(
            user.id,
          );
          const localIds = readLocalIds();
          if (localIds.length > 0) {
            await migrateLocalItemsToAccount(id, localIds);
            writeLocalIds([]);
          }

          const rows = await loadAccountItems(id);
          const loaded = rows
            .map((row) => ({
              itemId: row.id,
              order: row.order,
              attraction: mapAttractionRow(row.attractions),
            }))
            .sort((a, b) => a.order - b.order);

          if (!cancelled) {
            setItineraryId(id);
            setTitle(fetchedTitle);
            setItems(loaded);
          }
        } else {
          const localIds = readLocalIds();
          const rows =
            localIds.length > 0
              ? await getAttractionsSummaryByIds(localIds)
              : [];
          const byId = new Map(rows.map((row) => [row.id, row]));
          const loaded = localIds
            .map((id, index) => {
              const row = byId.get(id);
              if (!row) return null;
              return {
                itemId: id,
                order: index,
                attraction: mapAttractionRow(row),
              };
            })
            .filter((item): item is RoteiroItem => item !== null);

          if (!cancelled) {
            setItineraryId(null);
            setTitle(DEFAULT_TITLE);
            setItems(loaded);
          }
        }
      } catch (error) {
        console.error("Não foi possível carregar o roteiro:", error);
        if (!cancelled) {
          setItineraryId(null);
          setTitle(DEFAULT_TITLE);
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  function isInRoteiro(attractionId: string) {
    return items.some((item) => item.attraction.id === attractionId);
  }

  async function addItem(attraction: RoteiroAttraction) {
    if (isInRoteiro(attraction.id)) return;

    // O limite de 1 país por roteiro só vale pra quem tem conta — visitante
    // usa uma lista local sem conceito de "vários roteiros" pra dividir.
    if (user && items.length > 0) {
      const existingCountrySlugs = items.map(
        (item) => item.attraction.countrySlug,
      );
      if (
        !canAddCountryToItinerary(
          existingCountrySlugs,
          attraction.countrySlug,
          isPremium,
        )
      ) {
        setCountryConflict({ attraction });
        return;
      }
    }

    if (user && itineraryId) {
      const order = items.length;
      const created = await addAccountItem(itineraryId, attraction.id, order);
      setItems((prev) => [...prev, { itemId: created.id, order, attraction }]);
    } else {
      writeLocalIds([...items.map((item) => item.attraction.id), attraction.id]);
      setItems((prev) => [
        ...prev,
        { itemId: attraction.id, order: prev.length, attraction },
      ]);
    }
  }

  async function removeItem(attractionId: string) {
    const target = items.find((item) => item.attraction.id === attractionId);
    if (!target) return;

    if (user) {
      await removeAccountItem(target.itemId);
    } else {
      writeLocalIds(
        items
          .filter((item) => item.attraction.id !== attractionId)
          .map((item) => item.attraction.id),
      );
    }

    setItems((prev) =>
      prev.filter((item) => item.attraction.id !== attractionId),
    );
  }

  async function clearItems() {
    if (items.length === 0) return;

    if (user) {
      await Promise.all(items.map((item) => removeAccountItem(item.itemId)));
    } else {
      writeLocalIds([]);
    }

    setItems([]);
  }

  async function reorder(orderedAttractionIds: string[]) {
    const byAttractionId = new Map(
      items.map((item) => [item.attraction.id, item]),
    );
    const reordered = orderedAttractionIds
      .map((id, index) => {
        const item = byAttractionId.get(id);
        if (!item) return null;
        return { ...item, order: index };
      })
      .filter((item): item is RoteiroItem => item !== null);

    setItems(reordered);

    if (user) {
      await reorderAccountItems(
        reordered.map((item) => ({ id: item.itemId, order: item.order })),
      );
    } else {
      writeLocalIds(reordered.map((item) => item.attraction.id));
    }
  }

  async function renameItinerary(nextTitle: string) {
    if (!itineraryId) return;
    setTitle(nextTitle);
    await renameItineraryQuery(itineraryId, nextTitle);
  }

  // Recarrega itens e título do roteiro atual direto do banco — usada depois
  // que algo fora deste contexto (como o chat de edição por IA) altera o
  // roteiro do usuário, para refletir o estado real na tela.
  async function refresh() {
    if (!user || !itineraryId) return;

    const [fetchedTitle, rows] = await Promise.all([
      getItineraryTitle(itineraryId),
      loadAccountItems(itineraryId),
    ]);
    const loaded = rows
      .map((row) => ({
        itemId: row.id,
        order: row.order,
        attraction: mapAttractionRow(row.attractions),
      }))
      .sort((a, b) => a.order - b.order);

    setTitle(fetchedTitle);
    setItems(loaded);
  }

  // Troca qual roteiro está sendo editado — usada pelo seletor de roteiros
  // e por "Continuar roteiro" no histórico de /perfil.
  async function switchItinerary(nextItineraryId: string, nextTitle: string) {
    if (!user) return;
    setLoading(true);
    try {
      await setCurrentItineraryId(user.id, nextItineraryId);
      const rows = await loadAccountItems(nextItineraryId);
      const loaded = rows
        .map((row) => ({
          itemId: row.id,
          order: row.order,
          attraction: mapAttractionRow(row.attractions),
        }))
        .sort((a, b) => a.order - b.order);

      setItineraryId(nextItineraryId);
      setTitle(nextTitle);
      setItems(loaded);
    } finally {
      setLoading(false);
    }
  }

  async function createNewItinerary() {
    if (!user) return;
    setLoading(true);
    try {
      const created = await createItineraryRow(user.id);
      await setCurrentItineraryId(user.id, created.id);
      setItineraryId(created.id);
      setTitle(created.title);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  function cancelCountryConflict() {
    setCountryConflict(null);
  }

  function openPremiumFromCountryConflict() {
    setCountryConflict(null);
    setPremiumOpen(true);
  }

  // Cria um roteiro novo pra atração que não coube no atual por causa do
  // limite de 1 país, e já adiciona ela lá.
  async function createItineraryForConflict() {
    if (!countryConflict || !user) return;
    setCreatingConflictItinerary(true);
    try {
      const created = await createItineraryRow(user.id);
      await setCurrentItineraryId(user.id, created.id);
      const addedItem = await addAccountItem(
        created.id,
        countryConflict.attraction.id,
        0,
      );
      setItineraryId(created.id);
      setTitle(created.title);
      setItems([
        { itemId: addedItem.id, order: 0, attraction: countryConflict.attraction },
      ]);
      setCountryConflict(null);
    } finally {
      setCreatingConflictItinerary(false);
    }
  }

  const countryCount = new Set(items.map((item) => item.attraction.countrySlug))
    .size;

  return (
    <RoteiroContext.Provider
      value={{
        items,
        loading,
        title,
        canRename: itineraryId !== null,
        itineraryId,
        isInRoteiro,
        addItem,
        removeItem,
        clearItems,
        reorder,
        renameItinerary,
        refresh,
        switchItinerary,
        createNewItinerary,
      }}
    >
      {children}
      {countryConflict && (
        <ConfirmDialog
          wide
          message={
            <>
              <span className="mb-1 block font-serif text-lg text-tinta">
                Um roteiro, um país
              </span>
              <span className="text-oliva">
                Esse roteiro já tem atrações de{" "}
                <span className="font-medium text-tinta">
                  {humanizeSlug(items[0]?.attraction.countrySlug ?? "")}
                </span>
                . Pra adicionar atrações de{" "}
                <span className="font-medium text-tinta">
                  {humanizeSlug(countryConflict.attraction.countrySlug)}
                </span>
                , crie um novo roteiro ou assine o{" "}
                <button
                  type="button"
                  onClick={openPremiumFromCountryConflict}
                  className="font-medium text-terracota underline decoration-terracota/40 underline-offset-2 transition-colors hover:decoration-terracota"
                >
                  Premium
                </button>{" "}
                pra ter roteiros com vários países.
              </span>
            </>
          }
          confirmLabel="Criar novo roteiro"
          cancelLabel="Cancelar"
          pending={creatingConflictItinerary}
          pendingLabel="Criando..."
          onConfirm={createItineraryForConflict}
          onCancel={cancelCountryConflict}
        />
      )}
      {premiumOpen && (
        <PremiumDialog
          itineraryId={itineraryId}
          countryCount={countryCount}
          onClose={() => setPremiumOpen(false)}
        />
      )}
    </RoteiroContext.Provider>
  );
}

export function useRoteiro() {
  return useContext(RoteiroContext);
}
