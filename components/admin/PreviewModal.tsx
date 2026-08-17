"use client";

import { useEffect, type ReactNode } from "react";

export default function PreviewModal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1200] flex flex-col p-3 sm:p-6">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-tinta/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Prévia da página"
        className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-xl bg-areia shadow-lg"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-oliva/15 bg-branco px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-terracota">
              Prévia
            </p>
            <p className="text-sm text-oliva">
              Assim a página vai aparecer para os visitantes. As alterações
              ainda não foram salvas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar prévia"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-tinta transition-colors hover:bg-areia"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
