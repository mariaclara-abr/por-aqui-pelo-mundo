"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useNotifications } from "@/lib/notifications-context";

export default function NotificationBell() {
  const { loading: authLoading } = useAuth();
  const { unreadCount } = useNotifications();

  if (authLoading) return <div className="h-9 w-9" />;

  return (
    <Link
      href="/notificacoes"
      aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ""}`}
      title="Notificações"
      className="group relative flex h-9 w-9 items-center justify-center rounded-full text-tinta transition-colors hover:text-terracota"
    >
      <svg
        viewBox="0 0 20 20"
        className="h-5 w-5 fill-none stroke-current"
        strokeWidth={2}
      >
        <path
          d="M10 3a4.5 4.5 0 0 0-4.5 4.5v2.4c0 .5-.16.98-.46 1.38L4 12.83c-.6.8-.02 1.94.98 1.94h10.04c1 0 1.58-1.14.98-1.94l-1.04-1.55a2.3 2.3 0 0 1-.46-1.38V7.5A4.5 4.5 0 0 0 10 3Z"
          strokeLinejoin="round"
        />
        <path d="M8.2 16.5a1.9 1.9 0 0 0 3.6 0" strokeLinecap="round" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracota px-1 text-[10px] font-medium leading-none text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
      <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-tinta px-2 py-1 text-xs text-branco opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        Notificações
      </span>
    </Link>
  );
}
