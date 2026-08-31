"use client";

import { useEffect, useRef, useState } from "react";

const EMOJIS = [
  "😊", "😍", "🥰", "😄", "😁", "🙂", "😉", "🤩", "😅", "🤗",
  "👍", "👏", "🙌", "🤝", "👌", "🙏", "💪",
  "❤️", "✨", "⭐", "🔥", "💯", "🎉",
  "✈️", "🌍", "🗺️", "🧳", "📸", "🌅", "🌄", "🏖️", "🏝️", "🏔️", "🚗", "🚢", "🚆",
  "🍽️", "☕", "🍷", "🍕", "🍦",
  "😂", "😢", "😴", "🤔",
];

export default function EmojiPickerButton({
  value,
  onChange,
  textareaRef,
}: {
  value: string;
  onChange: (value: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function insertEmoji(emoji: string) {
    const el = textareaRef?.current;
    if (!el) {
      onChange(value + emoji);
      setOpen(false);
      return;
    }

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + emoji + value.slice(end));

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Inserir emoji"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-oliva/30 text-base leading-none transition-colors hover:bg-areia"
      >
        😊
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 grid w-64 grid-cols-8 gap-1 rounded-xl border border-oliva/15 bg-branco p-2 shadow-lg">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-lg hover:bg-areia"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
