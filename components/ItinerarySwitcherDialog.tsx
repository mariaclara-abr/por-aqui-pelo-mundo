"use client";

import { useEffect, useState } from "react";
import { useRoteiro } from "@/lib/roteiro";
import {
  deriveDestination,
  getUserItineraries,
  type ItinerarySummary,
} from "@/lib/itinerary-queries";

export default function ItinerarySwitcherDialog({
  userId,
  currentItineraryId,
  onClose,
}: {
  userId: string;
  currentItineraryId: string | null;
  onClose: () => void;
}) {
  const { switchItinerary, createNewItinerary } = useRoteiro();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    getUserItineraries(userId)
      .then((data) =>
        setItineraries(data.filter((it) => it.status === "planejando")),
      )
      .catch(() => setError("Não foi possível carregar seus roteiros."))
      .finally(() => setLoading(false));

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userId, onClose]);

  async function handleSelect(itinerary: ItinerarySummary) {
    if (itinerary.id === currentItineraryId || pending) return;
    setPending(true);
    try {
      await switchItinerary(itinerary.id, itinerary.title);
      onClose();
    } catch {
      setError("Não foi possível trocar de roteiro.");
      setPending(false);
    }
  }

  async function handleCreateNew() {
    if (pending) return;
    setPending(true);
    try {
      await createNewItinerary();
      onClose();
    } catch {
      setError("Não foi possível criar um novo roteiro.");
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-tinta/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[80vh] w-full max-w-md flex-col rounded-xl bg-branco p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-tinta">Trocar de roteiro</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-oliva transition-colors hover:text-terracota"
          >
            ✕
          </button>
        </div>

        {loading && <p className="mt-4 text-sm text-oliva">Carregando...</p>}
        {error && <p className="mt-4 text-sm text-terracota">{error}</p>}

        {!loading && (
          <div className="mt-4 flex flex-col gap-2 overflow-y-auto">
            {itineraries.map((itinerary) => {
              const active = itinerary.id === currentItineraryId;
              return (
                <button
                  key={itinerary.id}
                  type="button"
                  onClick={() => handleSelect(itinerary)}
                  disabled={pending}
                  className={`flex flex-col items-start rounded-lg border p-3 text-left transition-colors disabled:opacity-60 ${
                    active
                      ? "border-terracota bg-terracota/5"
                      : "border-oliva/20 hover:bg-areia"
                  }`}
                >
                  <span className="font-serif text-base text-tinta">
                    {itinerary.title}
                    {active && (
                      <span className="ml-2 text-xs font-medium uppercase tracking-wide text-terracota">
                        Atual
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-oliva">
                    {deriveDestination(itinerary)} · {itinerary.items.length}{" "}
                    {itinerary.items.length === 1 ? "atração" : "atrações"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={handleCreateNew}
          disabled={pending}
          className="mt-4 shrink-0 rounded-full bg-terracota px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
        >
          + Criar novo roteiro
        </button>
      </div>
    </div>
  );
}
