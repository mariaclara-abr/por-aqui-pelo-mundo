"use client";

import { useRef, useState } from "react";

type MarkerKey = "bold" | "italic" | "underline";

const MARKERS: Record<MarkerKey, string> = {
  bold: "**",
  italic: "*",
  underline: "__",
};

const BUTTONS: { key: MarkerKey; label: string; title: string; className: string }[] = [
  { key: "bold", label: "N", title: "Negrito", className: "font-bold" },
  { key: "italic", label: "I", title: "Itálico", className: "italic" },
  { key: "underline", label: "S", title: "Sublinhado", className: "underline" },
];

type Props = {
  id?: string;
  className?: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

// Verifica se a seleção [start, end) já está diretamente envolta pelo marcador,
// sem confundir "*" (itálico) com "**" (negrito).
function isSurroundedByMarker(text: string, start: number, end: number, key: MarkerKey) {
  const marker = MARKERS[key];
  const len = marker.length;
  const before = text.slice(start - len, start);
  const after = text.slice(end, end + len);
  if (before !== marker || after !== marker) return false;

  if (key === "italic") {
    // Evita detectar itálico dentro de "**negrito**" (o "*" extra ao lado).
    if (text.slice(start - 2, start) === "**" || text.slice(end, end + 2) === "**") {
      return false;
    }
  }
  return true;
}

function getActiveMarkers(text: string, start: number, end: number) {
  return {
    bold: isSurroundedByMarker(text, start, end, "bold"),
    italic: isSurroundedByMarker(text, start, end, "italic"),
    underline: isSurroundedByMarker(text, start, end, "underline"),
  };
}

// Formatação em estilo markdown leve (**negrito**, *itálico*, __sublinhado__),
// aplicada ao texto selecionado, com toggle: clicar de novo remove o marcador
// em vez de duplicá-lo. O texto continua sendo salvo como string pura; a
// interpretação dos marcadores acontece só na exibição (ver Linkify.tsx).
export default function FormattingToolbarTextarea({ id, className, rows, value, onChange, required }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeMarkers, setActiveMarkers] = useState({ bold: false, italic: false, underline: false });

  function syncActiveMarkers() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    setActiveMarkers(getActiveMarkers(value, textarea.selectionStart, textarea.selectionEnd));
  }

  function toggleMarker(key: MarkerKey) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const marker = MARKERS[key];
    const len = marker.length;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const isActive = isSurroundedByMarker(value, start, end, key);

    let newValue: string;
    let newStart: number;
    let newEnd: number;

    if (isActive) {
      newValue = value.slice(0, start - len) + value.slice(start, end) + value.slice(end + len);
      newStart = start - len;
      newEnd = end - len;
    } else {
      const selected = value.slice(start, end);
      newValue = `${value.slice(0, start)}${marker}${selected}${marker}${value.slice(end)}`;
      newStart = selected ? start + len : start + len;
      newEnd = selected ? end + len : end + len;
    }

    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
      setActiveMarkers(getActiveMarkers(newValue, newStart, newEnd));
    });
  }

  return (
    <div>
      <div className="mb-1.5 flex gap-1">
        {BUTTONS.map((button) => (
          <button
            key={button.key}
            type="button"
            title={button.title}
            onClick={() => toggleMarker(button.key)}
            className={`flex h-7 w-7 items-center justify-center rounded border text-sm ${button.className} ${
              activeMarkers[button.key]
                ? "border-terracota bg-terracota text-white"
                : "border-oliva/30 text-oliva hover:border-terracota hover:text-terracota"
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        className={className}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onSelect={syncActiveMarkers}
        onKeyUp={syncActiveMarkers}
        onClick={syncActiveMarkers}
        required={required}
      />
    </div>
  );
}
