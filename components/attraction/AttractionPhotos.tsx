"use client";

import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from "react";
import Image from "next/image";
import { thumbUrl } from "@/lib/thumb";
import type { Database } from "@/types/database";
import { linkify } from "@/components/Linkify";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";

type Photo = Database["public"]["Tables"]["attraction_photos"]["Row"];

// Mosaico de 4 colunas x 2 linhas (6 fotos): pequena, alta, larga / 3 pequenas.
// A célula 1 ocupa 2 linhas e a 2 ocupa 2 colunas.
const MOSAIC_SIZE = 6;
const MOSAIC_SPANS = ["", "row-span-2", "col-span-2", "", "", ""];

function PhotoMosaic({
  photos,
  offset,
  attractionName,
  onPick,
  moreOnLast = false,
  priority = false,
}: {
  photos: Photo[];
  offset: number;
  attractionName: string;
  onPick: (index: number) => void;
  moreOnLast?: boolean;
  priority?: boolean;
}) {
  // Bloco incompleto: grade simples sem buracos (1 foto = largura toda).
  const complete = photos.length === MOSAIC_SIZE;
  const cols = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-2", "grid-cols-3"][photos.length];
  return (
    <div
      className={`grid gap-2 sm:gap-3 ${
        complete ? "aspect-[2/1] grid-cols-4 grid-rows-2" : cols
      }`}
    >
      {photos.map((photo, i) => {
        const isMore = moreOnLast && i === MOSAIC_SIZE - 1;
        return (
          <button
            key={photo.id}
            type="button"
            onClick={() => onPick(isMore ? -1 : offset + i)}
            aria-label={isMore ? "Ver todas as fotos" : (photo.caption ?? attractionName)}
            className={`group relative overflow-hidden bg-branco ${
              complete ? MOSAIC_SPANS[i] : photos.length === 1 ? "aspect-[16/9]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={thumbUrl(photo.url)}
              alt={isMore ? "" : (photo.caption ?? attractionName)}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              preload={priority && i === 0}
              className={`object-cover transition-[filter,transform] duration-300 ${
                isMore ? "brightness-[0.2] group-hover:brightness-[0.15]" : "group-hover:scale-105"
              }`}
              style={imagePositionStyle(parseImagePosition(photo.position))}
            />
            {isMore && (
              <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                Ver mais
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function FocusedPhotoTrack({
  photos,
  index,
  attractionName,
  onIndexChange,
  onTap,
}: {
  photos: Photo[];
  index: number;
  attractionName: string;
  onIndexChange: (index: number) => void;
  onTap: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const dragged = useRef(false);
  const pendingDirection = useRef<0 | 1 | -1>(0);

  const prevIndex = (index - 1 + photos.length) % photos.length;
  const nextIndex = (index + 1) % photos.length;

  function handleTouchStart(event: TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
    dragged.current = false;
    setAnimate(false);
  }

  function handleTouchMove(event: TouchEvent) {
    if (touchStartX.current === null || photos.length < 2) return;
    const delta = event.touches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 5) dragged.current = true;
    setOffset(delta);
  }

  function handleTouchEnd(event: TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const viewportWidth = viewportRef.current?.offsetWidth ?? 0;
    const SWIPE_THRESHOLD = 50;

    setAnimate(true);
    if (Math.abs(delta) > SWIPE_THRESHOLD && viewportWidth > 0 && photos.length > 1) {
      pendingDirection.current = delta < 0 ? 1 : -1;
      setOffset(delta < 0 ? -viewportWidth : viewportWidth);
    } else {
      pendingDirection.current = 0;
      setOffset(0);
      if (!dragged.current) onTap();
    }
  }

  function handleTransitionEnd() {
    if (pendingDirection.current !== 0) {
      onIndexChange(pendingDirection.current === 1 ? nextIndex : prevIndex);
    }
    pendingDirection.current = 0;
    setAnimate(false);
    setOffset(0);
  }

  return (
    <div
      ref={viewportRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        if (!dragged.current) onTap();
      }}
      className="relative h-full w-full overflow-hidden"
    >
      <div
        onTransitionEnd={handleTransitionEnd}
        className="flex h-full"
        style={{
          width: "300%",
          transform: `translate3d(calc(-100%/3 + ${offset}px), 0, 0)`,
          transition: animate ? "transform 280ms ease-out" : "none",
        }}
      >
        {[prevIndex, index, nextIndex].map((photoIndex, slot) => {
          const photo = photos[photoIndex];
          return (
            <div key={`${photo.id}-${slot}`} className="relative h-full w-1/3 shrink-0">
              <Image
                src={photo.url}
                alt={photo.caption ?? attractionName}
                fill
                sizes="100vw"
                className="rounded-lg object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhotoGalleryOverlay({
  photos,
  attractionName,
  initialIndex,
  onClose,
}: {
  photos: Photo[];
  attractionName: string;
  initialIndex: number | null;
  onClose: () => void;
}) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(initialIndex);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFocusedIndex((current) => {
          if (current !== null) return null;
          onClose();
          return current;
        });
        return;
      }
      if (event.key === "ArrowLeft") {
        setFocusedIndex((current) =>
          current === null ? current : (current - 1 + photos.length) % photos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setFocusedIndex((current) =>
          current === null ? current : (current + 1) % photos.length,
        );
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, photos.length]);

  const focusedPhoto = focusedIndex !== null ? photos[focusedIndex] : null;

  function goToPrev(event: MouseEvent) {
    event.stopPropagation();
    setFocusedIndex((current) =>
      current === null ? current : (current - 1 + photos.length) % photos.length,
    );
  }

  function goToNext(event: MouseEvent) {
    event.stopPropagation();
    setFocusedIndex((current) =>
      current === null ? current : (current + 1) % photos.length,
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Todas as fotos de ${attractionName}`}
      className={`fixed inset-0 z-[1200] flex flex-col bg-branco transition-opacity duration-200 ease-out ${
        entered ? "opacity-100" : "opacity-0"
      }`}
    >
      {focusedPhoto === null ? (
        <>
          <div className="flex shrink-0 items-center justify-between border-b border-oliva/15 px-4 py-3 sm:px-6">
            <p className="truncate font-serif text-base text-tinta">
              {attractionName}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar galeria"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-tinta transition-colors hover:bg-areia"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 p-2 sm:gap-3 sm:p-4">
              {Array.from({ length: Math.ceil(photos.length / MOSAIC_SIZE) }, (_, c) => (
                <PhotoMosaic
                  key={c}
                  photos={photos.slice(c * MOSAIC_SIZE, (c + 1) * MOSAIC_SIZE)}
                  offset={c * MOSAIC_SIZE}
                  attractionName={attractionName}
                  onPick={setFocusedIndex}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col bg-tinta">
          <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => setFocusedIndex(null)}
              aria-label="Voltar para a grade de fotos"
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar galeria"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-2">
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrev}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:left-4"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Próxima foto"
                  className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-4"
                >
                  ›
                </button>
              </>
            )}
            <FocusedPhotoTrack
              photos={photos}
              index={focusedIndex!}
              attractionName={attractionName}
              onIndexChange={setFocusedIndex}
              onTap={() => setFocusedIndex(null)}
            />
          </div>
          {focusedPhoto.caption && (
            <p className="shrink-0 px-6 pb-6 text-center text-sm leading-relaxed text-white/90 whitespace-pre-line">
              {linkify(focusedPhoto.caption)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AttractionPhotos({
  photos,
  attractionName,
}: {
  photos: Photo[];
  attractionName: string;
}) {
  // null = fechada; -1 = grade completa; >= 0 = foto aberta direto.
  const [gallery, setGallery] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-branco">
        <span className="font-serif text-lg text-oliva">{attractionName}</span>
      </div>
    );
  }

  // Prévia limitada a 2 linhas (6 fotos); a última vira "Ver mais" se houver mais.
  const preview = photos.slice(0, MOSAIC_SIZE);

  return (
    <>
      <PhotoMosaic
        photos={preview}
        offset={0}
        attractionName={attractionName}
        onPick={setGallery}
        moreOnLast={photos.length > MOSAIC_SIZE}
        priority
      />

      {gallery !== null && (
        <PhotoGalleryOverlay
          photos={photos}
          attractionName={attractionName}
          initialIndex={gallery >= 0 ? gallery : null}
          onClose={() => setGallery(null)}
        />
      )}
    </>
  );
}
