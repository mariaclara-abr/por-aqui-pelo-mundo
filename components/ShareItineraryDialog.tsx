"use client";

import { useEffect, useState } from "react";
import {
  getItineraryPublicStatus,
  getOrCreateShare,
  setItineraryPublic,
  setSharePublic,
  setShareShowAuthorName,
} from "@/lib/itinerary-queries";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ShareItineraryDialog({
  itineraryId,
  itineraryTitle,
  userId,
  onClose,
  onSalvarPDF,
}: {
  itineraryId: string;
  itineraryTitle: string;
  userId: string;
  onClose: () => void;
  onSalvarPDF: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [showAuthorName, setShowAuthorName] = useState(true);
  const [copied, setCopied] = useState(false);

  const [profilePublic, setProfilePublic] = useState(false);
  const [confirmingProfilePublic, setConfirmingProfilePublic] = useState(false);
  const [togglingProfilePublic, setTogglingProfilePublic] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    getOrCreateShare(itineraryId, userId)
      .then((share) => {
        setShareToken(share.share_token);
        setIsPublic(share.is_public);
        setShowAuthorName(share.show_author_name);
      })
      .catch(() =>
        setError("Não foi possível gerar o link de compartilhamento."),
      )
      .finally(() => setLoading(false));

    getItineraryPublicStatus(itineraryId)
      .then(setProfilePublic)
      .catch(() => {});

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [itineraryId, userId, onClose]);

  const shareUrl = shareToken ? `${window.location.origin}/roteiros/${shareToken}` : "";
  const shareMessage = `Confira meu roteiro "${itineraryTitle}": ${shareUrl}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleTogglePublic() {
    const next = !isPublic;
    setIsPublic(next);
    try {
      await setSharePublic(itineraryId, next);
    } catch {
      setIsPublic(!next);
    }
  }

  async function handleToggleAuthorName() {
    const next = !showAuthorName;
    setShowAuthorName(next);
    try {
      await setShareShowAuthorName(itineraryId, next);
    } catch {
      setShowAuthorName(!next);
    }
  }

  function handleToggleProfilePublic() {
    if (profilePublic) {
      setProfilePublic(false);
      setItineraryPublic(itineraryId, false).catch(() => setProfilePublic(true));
    } else {
      setConfirmingProfilePublic(true);
    }
  }

  async function handleConfirmProfilePublic() {
    setTogglingProfilePublic(true);
    try {
      await setItineraryPublic(itineraryId, true);
      setProfilePublic(true);
      setConfirmingProfilePublic(false);
    } catch {
      setError("Não foi possível tornar o roteiro público. Tente novamente.");
    } finally {
      setTogglingProfilePublic(false);
    }
  }

  function handleNativeShare() {
    navigator.share?.({ title: itineraryTitle, text: shareMessage, url: shareUrl }).catch(() => {});
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div onClick={onClose} aria-hidden="true" className="absolute inset-0 bg-tinta/50" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-xl bg-branco p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-tinta">Compartilhar roteiro</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-oliva transition-colors hover:text-terracota"
          >
            ✕
          </button>
        </div>

        {loading && <p className="mt-4 text-sm text-oliva">Gerando link...</p>}
        {error && <p className="mt-4 text-sm text-terracota">{error}</p>}

        {!loading && !error && shareToken && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-oliva/20 bg-areia p-2">
              <input
                readOnly
                value={shareUrl}
                onFocus={(event) => event.currentTarget.select()}
                className="min-w-0 flex-1 truncate bg-transparent text-sm text-tinta focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded-full bg-terracota px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-terracota/90"
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {typeof navigator !== "undefined" && !!navigator.share && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="rounded-full border-2 border-terracota px-4 py-2 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10"
                >
                  Compartilhar...
                </button>
              )}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-terracota px-4 py-2 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10"
              >
                WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(`Meu roteiro: ${itineraryTitle}`)}&body=${encodeURIComponent(shareMessage)}`}
                className="rounded-full border-2 border-terracota px-4 py-2 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10"
              >
                E-mail
              </a>
              <button
                type="button"
                onClick={onSalvarPDF}
                className="rounded-full border-2 border-terracota px-4 py-2 text-sm font-medium text-terracota transition-colors hover:bg-terracota/10"
              >
                Salvar em PDF
              </button>
            </div>

            <label className="flex items-center justify-between gap-3 text-sm text-tinta">
              Mostrar meu nome no roteiro compartilhado
              <input
                type="checkbox"
                checked={showAuthorName}
                onChange={handleToggleAuthorName}
                className="h-4 w-4 accent-terracota"
              />
            </label>

            <label className="flex items-center justify-between gap-3 text-sm text-tinta">
              Link ativo
              <input
                type="checkbox"
                checked={isPublic}
                onChange={handleTogglePublic}
                className="h-4 w-4 accent-terracota"
              />
            </label>
            {!isPublic && (
              <p className="text-xs text-oliva">
                O link continua o mesmo, mas ninguém consegue abrir o roteiro
                enquanto estiver desativado.
              </p>
            )}

            <label className="flex items-center justify-between gap-3 text-sm text-tinta">
              Tornar roteiro público no meu perfil
              <input
                type="checkbox"
                checked={profilePublic}
                onChange={handleToggleProfilePublic}
                disabled={togglingProfilePublic}
                className="h-4 w-4 accent-terracota"
              />
            </label>
          </div>
        )}
      </div>

      {confirmingProfilePublic && (
        <ConfirmDialog
          message="Ao tornar este roteiro público, ele vai aparecer no seu perfil, visível para qualquer pessoa que visitá-lo."
          confirmLabel="Tornar público"
          cancelLabel="Manter privado"
          pending={togglingProfilePublic}
          pendingLabel="Tornando público..."
          onConfirm={handleConfirmProfilePublic}
          onCancel={() => setConfirmingProfilePublic(false)}
        />
      )}
    </div>
  );
}
