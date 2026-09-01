import type { ReactNode } from "react";

// Convenção simples usada em textos curados (ex: título de dicas de viagem):
// **palavra** vira negrito, para destacar os termos mais importantes.
export function renderBold(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}
