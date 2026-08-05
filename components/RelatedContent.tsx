"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRoteiro } from "@/lib/roteiro";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  estimateWalkMinutes,
  formatDistanceKm,
  getAttractionRecommendations,
  getItineraryRecommendations,
  getNearbyCities,
  type AttractionRecommendations,
  type RecommendedAttraction,
  type RecommendedCity,
} from "@/lib/recommendations";
import { ATTRACTION_CATEGORIES } from "@/types/database";
import CurationRating from "@/components/CurationRating";
import DestinationCard from "@/components/DestinationCard";

type RelatedContentProps =
  | {
      mode: "attraction";
      attraction: {
        id: string;
        citySlug: string;
        latitude: number | null;
        longitude: number | null;
      };
    }
  | { mode: "city"; citySlug: string }
  | { mode: "itinerary" };

const ATTRACTION_GROUPS: { key: keyof AttractionRecommendations; label: string }[] = [
  { key: "nearbyAttractions", label: "Atrações próximas" },
  { key: "nearbyRestaurants", label: "Restaurantes próximos" },
  { key: "nearbyHotels", label: "Hotéis próximos" },
  { key: "complementaryTours", label: "Passeios complementares" },
];

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Ver anteriores" : "Ver mais"}
      className={`absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-terracota text-white shadow-sm transition-colors hover:bg-terracota/90 ${
        direction === "left" ? "left-1" : "right-1"
      }`}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
        {direction === "left" ? (
          <path d="M12 4l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M8 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function RecommendationGroup({ title, children }: { title: string; children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, children]);

  function scrollByScreen(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div>
      <h3 className="font-serif text-lg text-tinta">{title}</h3>
      <div className="relative mt-3">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
        {canScrollLeft && (
          <CarouselArrow direction="left" onClick={() => scrollByScreen(-1)} />
        )}
        {canScrollRight && (
          <CarouselArrow direction="right" onClick={() => scrollByScreen(1)} />
        )}
      </div>
    </div>
  );
}

function WalkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth={1.7}>
      <circle cx="10" cy="3.2" r="1.4" fill="currentColor" stroke="none" />
      <path
        d="M10 4.9 L9 10 M9 10 L11.5 12.3 L13 16 M9 10 L6.7 15.6 M9.8 5.6 L7 8.3 M9.8 5.6 L13 7.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path
        d="M10 18s6-5.7 6-10.5a6 6 0 10-12 0C4 12.3 10 18 10 18z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="7.5" r="2.1" />
    </svg>
  );
}

function CityDistance({ distanceKm }: { distanceKm: number }) {
  return (
    <span className="flex items-center gap-1 text-xs text-oliva">
      <PinIcon className="h-3.5 w-3.5" />
      {formatDistanceKm(distanceKm)}
    </span>
  );
}

function WalkTime({ distanceKm }: { distanceKm: number }) {
  return (
    <span className="flex items-center gap-1 text-xs text-oliva">
      <WalkIcon className="h-3.5 w-3.5" />
      {estimateWalkMinutes(distanceKm)} min a pé
    </span>
  );
}

function AddToRoteiroButton({ attraction }: { attraction: RecommendedAttraction }) {
  const { addItem, removeItem, isInRoteiro } = useRoteiro();
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const inRoteiro = isInRoteiro(attraction.id);

  function stop(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  async function handleAdd(event: React.MouseEvent) {
    stop(event);
    if (pending) return;
    setPending(true);
    try {
      await addItem(attraction);
    } catch (error) {
      console.error("Não foi possível adicionar ao roteiro:", error);
    } finally {
      setPending(false);
    }
  }

  async function handleRemove() {
    if (pending) return;
    setPending(true);
    try {
      await removeItem(attraction.id);
    } catch (error) {
      console.error("Não foi possível remover do roteiro:", error);
    } finally {
      setPending(false);
      setConfirming(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          if (inRoteiro) {
            stop(event);
            setConfirming(true);
          } else {
            handleAdd(event);
          }
        }}
        disabled={pending}
        className={`mt-2 w-full rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
          inRoteiro
            ? "border border-terracota text-terracota hover:bg-terracota/10"
            : "bg-terracota text-white hover:bg-terracota/90"
        }`}
      >
        {inRoteiro ? "Adicionado ao roteiro" : "Adicionar ao roteiro"}
      </button>

      {confirming && (
        <ConfirmDialog
          message={
            <>
              Tem certeza que quer remover{" "}
              <span className="font-medium">{attraction.name}</span> do
              roteiro?
            </>
          }
          confirmLabel="Sim, remover"
          pendingLabel="Removendo..."
          pending={pending}
          onConfirm={handleRemove}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}

function AttractionRecommendationCard({ attraction }: { attraction: RecommendedAttraction }) {
  const categoryLabel =
    ATTRACTION_CATEGORIES.find((c) => c.value === attraction.category)?.label ?? attraction.category;

  return (
    <div className="w-40 shrink-0 snap-start sm:w-48">
      <Link
        href={`/${attraction.countrySlug}/${attraction.citySlug}/${attraction.slug}`}
        className="group block"
      >
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-branco shadow-sm">
          {attraction.coverPhotoUrl ? (
            <img
              src={attraction.coverPhotoUrl}
              alt={attraction.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-sm text-oliva">{attraction.name}</span>
            </div>
          )}
        </div>
        <p className="mt-2 text-xs uppercase tracking-wide text-oliva">{categoryLabel}</p>
        <h4 className="truncate font-serif text-base text-tinta transition-colors group-hover:text-terracota">
          {attraction.name}
        </h4>
        <div className="mt-1">
          <CurationRating rating={attraction.curationRating} showLabel={false} size="sm" />
        </div>
        {attraction.distanceKm !== null && (
          <div className="mt-1">
            <WalkTime distanceKm={attraction.distanceKm} />
          </div>
        )}
      </Link>
      <AddToRoteiroButton attraction={attraction} />
    </div>
  );
}

function CityRecommendationCard({ city }: { city: RecommendedCity }) {
  return (
    <div className="w-40 shrink-0 snap-start sm:w-48">
      <DestinationCard
        href={`/${city.countrySlug}/${city.slug}`}
        name={city.name}
        imageUrl={city.coverImageUrl}
      />
      {city.distanceKm !== null && (
        <div className="mt-2">
          <CityDistance distanceKm={city.distanceKm} />
        </div>
      )}
    </div>
  );
}

export default function RelatedContent(props: RelatedContentProps) {
  const { items } = useRoteiro();
  const [recommendations, setRecommendations] = useState<AttractionRecommendations | null>(null);
  const [nearbyCities, setNearbyCities] = useState<RecommendedCity[] | null>(null);
  const [loading, setLoading] = useState(true);

  const roteiroKey = useMemo(
    () => items.map((item) => item.attraction.id).join(","),
    [items],
  );

  const reactiveKey =
    props.mode === "attraction"
      ? `attraction:${props.attraction.id}`
      : props.mode === "city"
        ? `city:${props.citySlug}`
        : `itinerary:${roteiroKey}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        if (props.mode === "attraction") {
          const data = await getAttractionRecommendations(props.attraction);
          if (!cancelled) setRecommendations(data);
        } else if (props.mode === "city") {
          const data = await getNearbyCities(props.citySlug);
          if (!cancelled) setNearbyCities(data);
        } else {
          const data = await getItineraryRecommendations(
            items.map((item) => ({
              id: item.attraction.id,
              citySlug: item.attraction.citySlug,
              latitude: item.attraction.latitude,
              longitude: item.attraction.longitude,
            })),
          );
          if (!cancelled) setRecommendations(data);
        }
      } catch (error) {
        console.error("Não foi possível carregar as recomendações:", error);
        if (!cancelled) {
          setRecommendations(null);
          setNearbyCities(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactiveKey]);

  if (loading) {
    return <p className="text-sm text-oliva">Carregando recomendações...</p>;
  }

  if (props.mode === "city") {
    if (!nearbyCities || nearbyCities.length === 0) {
      return (
        <p className="text-oliva">
          Ainda não há cidades próximas cadastradas — em breve teremos mais
          sugestões.
        </p>
      );
    }
    return (
      <RecommendationGroup title="Cidades próximas">
        {nearbyCities.map((city) => (
          <CityRecommendationCard key={city.slug} city={city} />
        ))}
      </RecommendationGroup>
    );
  }

  const groups = ATTRACTION_GROUPS.map(({ key, label }) => ({
    key,
    label,
    items: (recommendations?.[key] ?? []) as RecommendedAttraction[],
  })).filter((group) => group.items.length > 0);

  const cities = recommendations?.nearbyCities ?? [];

  if (groups.length === 0 && cities.length === 0) {
    return (
      <p className="text-oliva">
        Ainda não há recomendações para este lugar — em breve teremos mais
        sugestões.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <RecommendationGroup key={group.key} title={group.label}>
          {group.items.map((attraction) => (
            <AttractionRecommendationCard key={attraction.id} attraction={attraction} />
          ))}
        </RecommendationGroup>
      ))}
      {cities.length > 0 && (
        <RecommendationGroup title="Cidades próximas">
          {cities.map((city) => (
            <CityRecommendationCard key={city.slug} city={city} />
          ))}
        </RecommendationGroup>
      )}
    </div>
  );
}
