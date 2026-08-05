"use client";

import { useEffect, type ReactNode } from "react";

export default function ConfirmDialog({
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  pending = false,
  pendingLabel,
  onConfirm,
  onCancel,
}: {
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  pendingLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div
        onClick={onCancel}
        aria-hidden="true"
        className="absolute inset-0 bg-tinta/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xs rounded-xl bg-branco p-5 text-center shadow-lg"
      >
        <p className="text-tinta">{message}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="flex-1 rounded-full border border-oliva/30 px-4 py-2 text-sm text-oliva transition-colors hover:bg-areia disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="flex-1 rounded-full bg-terracota px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
          >
            {pending ? (pendingLabel ?? "Aguarde...") : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
