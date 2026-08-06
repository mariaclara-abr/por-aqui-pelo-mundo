"use client";

import { useEffect, useRef, useState } from "react";
import { useRoteiro } from "@/lib/roteiro";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Oi! Posso ajustar seu roteiro por aqui: peça para adicionar, remover ou reordenar atrações, ou mudar o nome do roteiro.",
};

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth={1.6}>
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current" strokeWidth={2}>
      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-areia px-3 py-2.5">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-oliva/60" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-oliva/60 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-oliva/60 [animation-delay:300ms]" />
    </div>
  );
}

export default function ItineraryChat() {
  const { canRename, refresh } = useRoteiro();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  if (!canRename) return null;

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const history = messages.filter((message) => message !== GREETING);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/itinerary-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Não foi possível processar seu pedido.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.changed) {
        await refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível processar seu pedido.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Fechar assistente do roteiro" : "Abrir assistente do roteiro"}
        className={`fixed bottom-5 right-5 z-50 h-14 w-14 items-center justify-center rounded-full bg-terracota text-white shadow-lg transition-colors hover:bg-terracota/90 ${
          open ? "hidden sm:flex" : "flex"
        }`}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex h-[80vh] max-h-[560px] flex-col overflow-hidden rounded-t-xl bg-branco shadow-lg sm:inset-x-auto sm:bottom-24 sm:right-5 sm:h-[70vh] sm:w-full sm:max-w-sm sm:rounded-xl">
          <div className="flex items-start justify-between border-b border-tinta/10 px-4 py-3">
            <div>
              <p className="font-serif text-base text-tinta">Assistente do roteiro</p>
              <p className="text-xs text-oliva">Peça alterações e eu faço por você.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar assistente do roteiro"
              className="shrink-0 text-oliva transition-colors hover:text-terracota"
            >
              <CloseIcon />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-terracota text-white"
                      : "bg-areia text-tinta"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <TypingDots />
              </div>
            )}
          </div>

          {error && <p className="px-4 pb-1 text-xs text-terracota">{error}</p>}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-tinta/10 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ex: adicione o Coliseu ao roteiro"
              disabled={loading}
              className="flex-1 rounded-full border border-oliva/30 bg-branco px-4 py-2 text-sm text-tinta focus:border-terracota focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Enviar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracota text-white transition-colors hover:bg-terracota/90 disabled:opacity-60"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
