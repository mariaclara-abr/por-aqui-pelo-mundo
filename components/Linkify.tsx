import type { ReactNode } from "react";

const TOKEN_PATTERN = /(\*\*.+?\*\*|__.+?__|\*.+?\*|https?:\/\/[^\s<>"]+|www\.[^\s<>"]+)/g;

function toHref(match: string) {
  return match.startsWith("www.") ? `https://${match}` : match;
}

// Interpreta um texto vindo da curadoria (nunca HTML): reconhece apenas
// **negrito**, *itálico*, __sublinhado__ e URLs, mantendo o resto como
// texto puro.
export function linkify(text: string, linkClassName = "break-all text-terracota underline-offset-2 hover:underline"): ReactNode[] {
  const parts = text.split(TOKEN_PATTERN);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("__") && part.endsWith("__") && part.length > 3) {
      return <u key={index}>{part.slice(2, -2)}</u>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (/^(https?:\/\/|www\.)/.test(part)) {
      return (
        <a
          key={index}
          href={toHref(part)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
