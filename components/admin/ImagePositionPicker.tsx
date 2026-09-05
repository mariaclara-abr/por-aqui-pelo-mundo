"use client";

import { useRef, type PointerEvent } from "react";
import {
  DEFAULT_IMAGE_POSITION,
  imagePositionStyle,
  type ImagePosition,
} from "@/lib/image-position";

export default function ImagePositionPicker({
  imageUrl,
  value,
  onChange,
}: {
  imageUrl: string;
  value: ImagePosition | null;
  onChange: (position: ImagePosition) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startPosition: ImagePosition;
  } | null>(null);

  const position = value ?? DEFAULT_IMAGE_POSITION;

  function clamp(n: number) {
    return Math.min(100, Math.max(0, n));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startPosition: position,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const container = containerRef.current;
    if (!drag || !container) return;

    const rect = container.getBoundingClientRect();
    // Arrastar a imagem pra direita/baixo revela mais do lado
    // esquerdo/superior dela, então o foco (x/y) anda na direção oposta ao
    // arrasto. Divide pelo zoom porque, com a imagem ampliada, o mesmo
    // deslocamento em pixels de tela corresponde a uma fração menor da
    // imagem original.
    const deltaXPercent =
      ((event.clientX - drag.startX) / rect.width) * 100 * (1 / position.zoom);
    const deltaYPercent =
      ((event.clientY - drag.startY) / rect.height) * 100 * (1 / position.zoom);

    onChange({
      ...position,
      x: clamp(drag.startPosition.x - deltaXPercent),
      y: clamp(drag.startPosition.y - deltaYPercent),
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative aspect-[4/3] w-full max-w-xs cursor-move touch-none overflow-hidden rounded-lg bg-areia"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Ajuste o enquadramento arrastando a imagem"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
          style={imagePositionStyle(position)}
        />
      </div>

      <div className="flex max-w-xs items-center gap-2">
        <label htmlFor="image-position-zoom" className="text-xs text-oliva">
          Zoom
        </label>
        <input
          id="image-position-zoom"
          type="range"
          min={1}
          max={2.5}
          step={0.05}
          value={position.zoom}
          onChange={(event) =>
            onChange({ ...position, zoom: Number(event.target.value) })
          }
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => onChange(DEFAULT_IMAGE_POSITION)}
          className="text-xs text-terracota hover:underline"
        >
          Redefinir
        </button>
      </div>

      <p className="max-w-xs text-xs text-oliva">
        Arraste a foto para ajustar o enquadramento e use o zoom se quiser
        aproximar, antes de salvar.
      </p>
    </div>
  );
}
