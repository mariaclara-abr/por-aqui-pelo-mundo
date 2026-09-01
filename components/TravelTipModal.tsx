"use client";

import { useEffect } from "react";
import { linkify } from "@/components/Linkify";
import { renderBold } from "@/lib/text-formatting";

export default function TravelTipModal({
  title,
  content,
  category,
  onClose,
}: {
  title: string;
  content: string;
  category: string;
  onClose: () => void;
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
    <div className="fixed inset-0 z-[1200] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-tinta/65 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="travel-tip-modal-title"
        className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-tinta/10 bg-areia shadow-[0_24px_70px_rgba(43,38,32,0.28)] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-6 border-b border-tinta/10 bg-oliva px-5 py-5 text-areia sm:px-7 sm:py-6">
          <div>
            <p className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-areia/65">
              {category}
            </p>
            <h2
              id="travel-tip-modal-title"
              className="mt-2 font-serif text-2xl leading-snug text-branco sm:text-[1.7rem]"
            >
              {renderBold(title)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            autoFocus
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-areia/25 text-areia transition-colors hover:bg-areia hover:text-tinta"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-9">
          <p className="whitespace-pre-line text-left font-serif text-lg leading-[1.75] text-tinta sm:text-xl">
            {linkify(content)}
          </p>
          <div className="mt-8 flex items-center gap-3 border-t border-tinta/10 pt-5 text-terracota">
            <span className="font-serif text-lg italic">por aqui</span>
            <span className="h-px flex-1 bg-terracota/25" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
