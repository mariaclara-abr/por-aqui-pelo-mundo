"use client";

import { useState } from "react";
import { linkify } from "@/components/Linkify";

const MAX_CHARS = 350;

export default function ReviewComment({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > MAX_CHARS;
  const shown = isLong && !expanded ? `${text.slice(0, MAX_CHARS).trimEnd()}…` : text;

  return (
    <blockquote className="flex-1 whitespace-pre-line text-sm leading-relaxed text-tinta">
      &ldquo;{linkify(shown)}&rdquo;
      {isLong && (
        <>
          {" "}
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="font-medium text-terracota underline-offset-2 hover:underline"
          >
            {expanded ? "Ver menos" : "Ver mais"}
          </button>
        </>
      )}
    </blockquote>
  );
}
