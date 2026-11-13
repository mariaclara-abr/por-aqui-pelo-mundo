"use client";

import { useState } from "react";

// Cupom em destaque com botão de copiar (parcerias da Natura).
export default function CopyCoupon({ code, conditions }: { code: string; conditions?: string | null }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissão de área de transferência: o código continua selecionável.
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-dashed border-terracota/50 bg-branco px-4 py-3">
      <p className="text-xs text-oliva">Use o cupom</p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="select-all text-lg font-semibold tracking-[0.14em] text-tinta">{code}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copiar cupom ${code}`}
          className="min-h-11 rounded-md px-3 text-xs font-semibold text-terracota transition-colors hover:bg-terracota/10"
        >
          <span aria-live="polite">{copied ? "Copiado!" : "Copiar"}</span>
        </button>
      </div>
      {conditions && <p className="mt-1 text-xs text-oliva">{conditions}</p>}
    </div>
  );
}
