"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useRoteiro } from "@/lib/roteiro";
import {
  deleteItinerary,
  deriveDestination,
  duplicateItinerary,
  getUserItineraries,
  setItineraryStatus,
  type ItinerarySummary,
} from "@/lib/itinerary-queries";

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatDateRange(start: string | null, end: string | null) {
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
  if (start) return `A partir de ${formatDate(start)}`;
  if (end) return `Até ${formatDate(end)}`;
  return null;
}

function ItineraryCard({
  itinerary,
  userId,
  onChanged,
}: {
  itinerary: ItinerarySummary;
  userId: string;
  onChanged: () => void;
}) {
  const router = useRouter();
  const { switchItinerary } = useRoteiro();
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateRange = formatDateRange(itinerary.startDate, itinerary.endDate);
  const photos = itinerary.items
    .map((item) => item.attraction.coverPhotoUrl)
    .filter((url): url is string => url !== null)
    .slice(0, 4);

  async function handleContinue() {
    setPending(true);
    setError(null);
    try {
      await switchItinerary(itinerary.id, itinerary.title);
      router.push("/meu-roteiro");
    } catch {
      setError("Não foi possível abrir esse roteiro. Tente novamente.");
      setPending(false);
    }
  }

  async function handleDuplicate() {
    setPending(true);
    setError(null);
    try {
      await duplicateItinerary(itinerary, userId);
      onChanged();
    } catch {
      setError("Não foi possível duplicar. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  async function handleComplete() {
    setPending(true);
    setError(null);
    try {
      await setItineraryStatus(itinerary.id, "concluida");
      onChanged();
    } catch {
      setError("Não foi possível atualizar. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    setPending(true);
    setError(null);
    try {
      await deleteItinerary(itinerary.id);
      onChanged();
    } catch {
      setError("Não foi possível excluir. Tente novamente.");
      setPending(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <div className="rounded-xl bg-branco p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg text-tinta">{itinerary.title}</h3>
          <p className="text-sm text-oliva">{deriveDestination(itinerary)}</p>
          {dateRange && <p className="text-xs text-oliva">{dateRange}</p>}
          <p className="mt-1 text-xs text-oliva">
            {itinerary.items.length}{" "}
            {itinerary.items.length === 1
              ? "atração adicionada"
              : "atrações adicionadas"}
          </p>
        </div>

        {photos.length > 0 && (
          <div className="flex -space-x-3">
            {photos.map((url, index) => (
              <img
                key={index}
                src={url}
                alt=""
                className="h-12 w-12 rounded-full border-2 border-branco object-cover"
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          {itinerary.status === "planejando" ? (
            <button
              type="button"
              onClick={handleContinue}
              disabled={pending}
              className="font-medium text-terracota hover:underline disabled:opacity-60"
            >
              Continuar roteiro
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="font-medium text-terracota hover:underline"
            >
              {expanded ? "Fechar" : "Ver roteiro"}
            </button>
          )}

          <button
            type="button"
            onClick={handleDuplicate}
            disabled={pending}
            className="text-oliva hover:underline disabled:opacity-60"
          >
            Duplicar
          </button>

          {itinerary.status === "planejando" && (
            <button
              type="button"
              onClick={handleComplete}
              disabled={pending}
              className="text-oliva hover:underline disabled:opacity-60"
            >
              Marcar como concluído
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setConfirmingDelete(true)}
          disabled={pending}
          className="shrink-0 text-terracota hover:underline disabled:opacity-60"
        >
          Excluir
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-terracota">{error}</p>}

      {expanded && (
        <ul className="mt-4 flex flex-col gap-2 border-t border-oliva/15 pt-3">
          {itinerary.items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/${item.attraction.countrySlug}/${item.attraction.citySlug}/${item.attraction.slug}`}
                className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-areia"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-areia">
                  {item.attraction.coverPhotoUrl && (
                    <img
                      src={item.attraction.coverPhotoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <span className="text-sm text-tinta">
                  {item.attraction.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {confirmingDelete && (
        <ConfirmDialog
          message={
            <>
              Tem certeza que quer excluir{" "}
              <span className="font-medium">{itinerary.title}</span>? Essa
              ação não pode ser desfeita.
            </>
          }
          confirmLabel="Sim, excluir"
          pendingLabel="Excluindo..."
          pending={pending}
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}

export default function ItineraryHistory({
  userId,
  initialItineraries,
}: {
  userId: string;
  initialItineraries: ItinerarySummary[];
}) {
  const [itineraries, setItineraries] = useState(initialItineraries);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getUserItineraries(userId);
      setItineraries(data);
    } catch (error) {
      console.error("Não foi possível atualizar os roteiros:", error);
    } finally {
      setLoading(false);
    }
  }

  const planning = itineraries.filter((it) => it.status === "planejando");
  const completed = itineraries.filter((it) => it.status === "concluida");

  if (itineraries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-branco p-8 text-center">
        <p className="font-serif text-lg text-tinta">
          Você ainda não montou nenhum roteiro
        </p>
        <p className="text-sm text-oliva">
          Explore os destinos e adicione atrações para começar a planejar sua
          viagem.
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

  return (
    <div className={`flex flex-col gap-8 ${loading ? "opacity-60" : ""}`}>
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-oliva">
          Planejando
        </h3>
        {planning.length === 0 ? (
          <p className="mt-2 text-sm text-oliva">
            Nenhum roteiro em planejamento no momento.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {planning.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                userId={userId}
                onChanged={refresh}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-oliva">
          Roteiros concluídos
        </h3>
        {completed.length === 0 ? (
          <p className="mt-2 text-sm text-oliva">
            Nenhum roteiro concluído ainda.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {completed.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                userId={userId}
                onChanged={refresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
