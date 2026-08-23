"use client";

import Link from "next/link";
import { useRoteiro } from "@/lib/roteiro";

export default function RoteiroIndicator() {
  const { items } = useRoteiro();
  const count = items.length;

  return (
    <Link
      href="/meu-roteiro"
      aria-label={`Meus roteiros, ${count} ${count === 1 ? "item" : "itens"}`}
      title="Meus roteiros"
      className="group relative flex h-9 w-9 items-center justify-center rounded-full text-tinta transition-colors hover:text-terracota"
    >
      <SuitcaseIcon />
      {count > 0 && <CountBadge count={count} />}
      <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-tinta px-2 py-1 text-xs text-branco opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        Meus roteiros
      </span>
    </Link>
  );
}

function SuitcaseIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth={2}
      aria-hidden="true"
    >
      <rect x="3" y="6" width="14" height="10" rx="1.5" />
      <path d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h3A1.5 1.5 0 0 1 13 4.5V6" />
    </svg>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracota px-1 text-[10px] font-medium leading-none text-white">
      {count}
    </span>
  );
}
