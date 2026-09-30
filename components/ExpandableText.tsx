"use client";

import { useState } from "react";
import { linkify } from "@/components/Linkify";

const SENTENCE_SPLIT = /(?<=[.!?])\s+(?=[A-ZÀ-Ú0-9])/;
const VISIBLE_SENTENCES = 2;

export default function ExpandableText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  // Corta o texto original (não recompõe as frases) para manter as quebras de linha.
  const boundaries = [...text.matchAll(new RegExp(SENTENCE_SPLIT, "g"))];
  const lineClass = `${className} whitespace-pre-line`;

  if (boundaries.length < VISIBLE_SENTENCES) {
    return <p className={lineClass}>{linkify(text)}</p>;
  }

  const preview = text.slice(0, boundaries[VISIBLE_SENTENCES - 1].index);

  return (
    <p className={lineClass}>
      {linkify(expanded ? text : preview)}{" "}
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="font-medium text-terracota underline-offset-2 hover:underline"
      >
        {expanded ? "Ver menos" : "Ver mais"}
      </button>
    </p>
  );
}
