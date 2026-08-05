"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRoteiro } from "@/lib/roteiro";
import { useAuth } from "@/lib/auth";
import CurationRating from "@/components/CurationRating";
import RelatedContent from "@/components/RelatedContent";
import AffiliateCallout from "@/components/AffiliateCallout";
import ShareItineraryDialog from "@/components/ShareItineraryDialog";
import ItinerarySwitcherDialog from "@/components/ItinerarySwitcherDialog";
import ItineraryChat from "@/components/itinerary-chat/ItineraryChat";
import { humanizeSlug } from "@/lib/affiliates";
import { exportToGoogleMaps } from "@/lib/export";
import { ATTRACTION_CATEGORIES } from "@/types/database";

const RoteiroMap = dynamic(() => import("@/components/RoteiroMap"), {
  ssr: false,
});

const WALK_SPEED_KMH = 4.5;
const DRIVE_SPEED_KMH = 25;

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function RoteiroTitle() {
  const { title, canRename, renameItinerary } = useRoteiro();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [saving, setSaving] = useState(false);

  async function save() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === title) {
      setValue(title);
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      await renameItinerary(trimmed);
    } catch (error) {
      console.error("Não foi possível renomear o roteiro:", error);
      setValue(title);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  if (!canRename) {
    return (
      <h1 className="font-serif text-3xl text-tinta sm:text-4xl">{title}</h1>
    );
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        disabled={saving}
        onChange={(event) => setValue(event.target.value)}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            save();
          } else if (event.key === "Escape") {
            setValue(title);
            setEditing(false);
          }
        }}
        className="w-full max-w-md border-b-2 border-terracota bg-transparent font-serif text-3xl text-tinta focus:outline-none disabled:opacity-60 sm:text-4xl"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setValue(title);
        setEditing(true);
      }}
      aria-label="Renomear roteiro"
      title="Editar título"
      className="group flex items-center gap-2 text-left"
    >
      <h1 className="font-serif text-3xl text-tinta sm:text-4xl">{title}</h1>
      <span className="relative">
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4 shrink-0 fill-none stroke-current text-oliva opacity-0 transition-opacity group-hover:opacity-100"
        strokeWidth={1.4}
      >
        <path
          d="M12.9 3.6l3.5 3.5-9 9-4 1 1-4z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.3 5.2l3.5 3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
        <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-tinta px-2 py-1 text-xs text-branco opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          Editar título
        </span>
      </span>
    </button>
  );
}

export default function MeuRoteiroPage() {
  const { items, loading, removeItem, reorder, itineraryId, title } = useRoteiro();
  const { user } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  function moveItem(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const orderedIds = items.map((item) => item.attraction.id);
    const [moved] = orderedIds.splice(index, 1);
    orderedIds.splice(targetIndex, 0, moved);
    reorder(orderedIds).catch((error) => {
      console.error("Não foi possível reordenar o roteiro:", error);
    });
  }

  function handleRemove(attractionId: string) {
    removeItem(attractionId).catch((error) => {
      console.error("Não foi possível remover o item do roteiro:", error);
    });
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <p className="text-oliva">Carregando roteiro...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
          <p className="font-serif text-xl text-tinta">
            Seu roteiro está vazio
          </p>
          <p className="text-oliva">
            Explore os destinos e adicione atrações para começar a montar sua
            viagem.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-full bg-terracota px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90"
          >
            Explorar destinos
          </Link>
          {user && (
            <button
              type="button"
              onClick={() => setSwitcherOpen(true)}
              className="text-sm text-terracota hover:underline"
            >
              Trocar de roteiro
            </button>
          )}
        </div>
        {switcherOpen && user && (
          <ItinerarySwitcherDialog
            userId={user.id}
            currentItineraryId={itineraryId}
            onClose={() => setSwitcherOpen(false)}
          />
        )}
        <ItineraryChat />
      </main>
    );
  }

  const mapPoints: {
    id: string;
    name: string;
    order: number;
    lat: number;
    lng: number;
  }[] = [];
  for (const item of items) {
    if (item.attraction.latitude !== null && item.attraction.longitude !== null) {
      mapPoints.push({
        id: item.attraction.id,
        name: item.attraction.name,
        order: item.order,
        lat: item.attraction.latitude,
        lng: item.attraction.longitude,
      });
    }
  }

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <RoteiroTitle />
            {user && itineraryId && (
              <button
                type="button"
                onClick={() => setSwitcherOpen(true)}
                aria-label="Trocar de roteiro"
                title="Trocar de roteiro"
                className="group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-oliva transition-colors hover:text-terracota"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 fill-none stroke-current"
                  strokeWidth={2}
                >
                  <path
                    d="M6 8l4-4 4 4M6 12l4 4 4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-tinta px-2 py-1 text-xs text-branco opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  Trocar de roteiro
                </span>
              </button>
            )}
          </div>
          {user && itineraryId && (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border-2 border-terracota px-5 py-2 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10 sm:self-auto"
            >
              Compartilhar
            </button>
          )}
        </div>
        <p className="mt-2 text-oliva">
          {items.length}{" "}
          {items.length === 1 ? "atração adicionada" : "atrações adicionadas"}
          .
        </p>

        {shareOpen && user && itineraryId && (
          <ShareItineraryDialog
            itineraryId={itineraryId}
            itineraryTitle={title}
            userId={user.id}
            onClose={() => setShareOpen(false)}
          />
        )}

        {switcherOpen && user && (
          <ItinerarySwitcherDialog
            userId={user.id}
            currentItineraryId={itineraryId}
            onClose={() => setSwitcherOpen(false)}
          />
        )}

        <Link
          href="/meu-roteiro/organizar-com-ia"
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-terracota bg-terracota/5 p-4 transition-colors hover:bg-terracota/10"
        >
          <div>
            <p className="font-serif text-lg text-tinta">Organizar com IA</p>
            <p className="text-sm text-oliva">
              Deixe a IA sugerir a ordem, os dias e os horários das suas
              atrações.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-terracota px-5 py-2 text-sm font-medium text-white">
            Organizar
          </span>
        </Link>

        {mapPoints.length > 0 && (
          <div className="mt-8">
            <div className="isolate overflow-hidden rounded-xl">
              <RoteiroMap points={mapPoints} />
            </div>
            <button
              type="button"
              onClick={() => {
                const url = exportToGoogleMaps(
                  mapPoints.map((point) => ({ lat: point.lat, lng: point.lng })),
                );
                window.open(url, "_blank", "noopener,noreferrer");
              }}
              className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-terracota px-5 py-2 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10"
            >
              Abrir no Google Maps
            </button>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {items.map((item, index) => {
            const categoryLabel =
              ATTRACTION_CATEGORIES.find(
                (c) => c.value === item.attraction.category,
              )?.label ?? item.attraction.category;
            const next = items[index + 1];

            let distanceNode: React.ReactNode = null;
            if (next) {
              const hasCoords =
                item.attraction.latitude !== null &&
                item.attraction.longitude !== null &&
                next.attraction.latitude !== null &&
                next.attraction.longitude !== null;

              if (hasCoords) {
                const km = haversineKm(
                  {
                    lat: item.attraction.latitude as number,
                    lng: item.attraction.longitude as number,
                  },
                  {
                    lat: next.attraction.latitude as number,
                    lng: next.attraction.longitude as number,
                  },
                );
                const walkMin = Math.round((km / WALK_SPEED_KMH) * 60);
                const driveMin = Math.round((km / DRIVE_SPEED_KMH) * 60);
                distanceNode = (
                  <p className="ml-3 mt-1 border-l-2 border-oliva/20 py-1 pl-4 text-xs text-oliva">
                    {formatDistance(km)} em linha reta até a próxima · ≈{" "}
                    {walkMin} min a pé ou {driveMin} min de carro
                  </p>
                );
              } else {
                distanceNode = (
                  <p className="ml-3 mt-1 border-l-2 border-oliva/20 py-1 pl-4 text-xs text-oliva/70">
                    Distância indisponível (coordenadas não cadastradas)
                  </p>
                );
              }
            }

            return (
              <div key={item.attraction.id}>
                <div className="flex items-center gap-3 rounded-xl bg-branco p-3 shadow-sm">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-areia">
                    {item.attraction.coverPhotoUrl && (
                      <img
                        src={item.attraction.coverPhotoUrl}
                        alt={item.attraction.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/${item.attraction.countrySlug}/${item.attraction.citySlug}/${item.attraction.slug}`}
                      className="block truncate font-serif text-lg text-tinta transition-colors hover:text-terracota"
                    >
                      {item.attraction.name}
                    </Link>
                    <p className="text-xs uppercase tracking-wide text-oliva">
                      {categoryLabel}
                    </p>
                    <div className="mt-1">
                      <CurationRating
                        rating={item.attraction.curationRating}
                        showLabel={false}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      aria-label="Mover para cima"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-oliva transition-colors hover:text-terracota disabled:opacity-30"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4 fill-none stroke-current"
                        strokeWidth={2}
                      >
                        <path
                          d="M4 12l6-6 6 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label="Mover para baixo"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-oliva transition-colors hover:text-terracota disabled:opacity-30"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4 fill-none stroke-current"
                        strokeWidth={2}
                      >
                        <path
                          d="M4 8l6 6 6-6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.attraction.id)}
                    aria-label="Remover do roteiro"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-oliva transition-colors hover:text-terracota"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 fill-none stroke-current"
                      strokeWidth={2}
                    >
                      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                {distanceNode}
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <AffiliateCallout
            variant="checklist"
            location={{
              cityName: humanizeSlug(items[0].attraction.citySlug),
              countryName: humanizeSlug(items[0].attraction.countrySlug),
            }}
          />
        </div>

        <section className="mt-12 border-t border-tinta/10 pt-8">
          <h2 className="font-serif text-xl text-tinta">
            Complete seu roteiro
          </h2>
          <p className="mt-1 text-oliva">
            Sugestões com base no que você já adicionou.
          </p>
          <div className="mt-4">
            <RelatedContent mode="itinerary" />
          </div>
        </section>
      </div>

      <ItineraryChat />
    </main>
  );
}
