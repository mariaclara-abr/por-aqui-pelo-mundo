"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import type { Database } from "@/types/database";
import { linkify } from "@/components/Linkify";
import { imagePositionStyle, parseImagePosition } from "@/lib/image-position";

type Photo = Database["public"]["Tables"]["attraction_photos"]["Row"];

// Quantas fotos "extras" (além da principal) aparecem na prévia embutida na
// página antes de precisar abrir a galeria completa.
const PREVIEW_COUNT = 3;

function PhotoGalleryOverlay({
  photos,
  attractionName,
  onClose,
}: {
  photos: Photo[];
  attractionName: string;
  onClose: () => void;
}) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
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
            <div className="grid grid-cols-2 gap-0.5 p-0.5 sm:gap-1 sm:p-1">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setFocusedIndex(index)}
                  aria-label={photo.caption ?? `Foto ${index + 1}`}
                  className="group relative aspect-square overflow-hidden bg-areia"
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption ?? ""}
                    fill
                    sizes="50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={imagePositionStyle(parseImagePosition(photo.position))}
                  />
                </button>
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
          <div
            onClick={() => setFocusedIndex(null)}
            className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-2"
          >
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrev}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:left-4"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Próxima foto"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-4"
                >
                  ›
                </button>
              </>
            )}
            <Image
              src={focusedPhoto.url}
              alt={focusedPhoto.caption ?? attractionName}
              onClick={(event) => event.stopPropagation()}
              fill
              sizes="100vw"
              className="rounded-lg object-contain"
            />
          </div>
          {focusedPhoto.caption && (
            <p className="shrink-0 px-6 pb-6 text-center text-sm leading-relaxed text-white/90">
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
  const [galleryOpen, setGalleryOpen] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl bg-branco">
        <span className="font-serif text-lg text-oliva">{attractionName}</span>
      </div>
    );
  }

  // Uma vez que a atração tenha 4 fotos ou mais, a prévia mostra só a
  // principal + 3 (a última delas com um convite pra ver o resto), em vez de
  // empilhar todas as fotos direto na página.
  const showTeaser = photos.length >= 1 + PREVIEW_COUNT;
  const rest = showTeaser ? photos.slice(1, 1 + PREVIEW_COUNT) : photos.slice(1);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-branco">
          <Image
            src={photos[0].url}
            alt={attractionName}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            preload
            className="object-cover"
            style={imagePositionStyle(parseImagePosition(photos[0].position))}
          />
        </div>
        {rest.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {rest.map((photo, index) => {
              const isTeaser = showTeaser && index === rest.length - 1;
              return isTeaser ? (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  aria-label="Ver todas as fotos"
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-branco"
                >
                  <Image
                    src={photo.url}
                    alt=""
                    fill
                    sizes="33vw"
                    className="object-cover brightness-[0.2] transition-[filter] group-hover:brightness-[0.15]"
                    style={imagePositionStyle(parseImagePosition(photo.position))}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                    Ver mais
                  </span>
                </button>
              ) : (
                <div
                  key={photo.id}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-branco"
                >
                  <Image
                    src={photo.url}
                    alt={attractionName}
                    fill
                    sizes="33vw"
                    className="object-cover"
                    style={imagePositionStyle(parseImagePosition(photo.position))}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {galleryOpen && (
        <PhotoGalleryOverlay
          photos={photos}
          attractionName={attractionName}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
}
