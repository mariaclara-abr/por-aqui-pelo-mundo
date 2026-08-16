"use client";

import { useState } from "react";
import { linkify } from "@/components/Linkify";

const SENTENCE_SPLIT = /(?<=[.!?])\s+(?=[A-ZÀ-Ú0-9])/;
const VISIBLE_SENTENCES = 3;

export default function ExpandableText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const sentences = text.split(SENTENCE_SPLIT).filter(Boolean);

  if (sentences.length <= VISIBLE_SENTENCES) {
    return <p className={className}>{linkify(text)}</p>;
  }

  const preview = sentences.slice(0, VISIBLE_SENTENCES).join(" ");

  return (
    <p className={className}>
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
