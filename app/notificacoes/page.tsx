"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useNotifications } from "@/lib/notifications-context";
import type { AppNotification } from "@/lib/notifications";
import type { NotificationType } from "@/types/database";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TypeIcon({ type }: { type: NotificationType }) {
  if (type === "bem_vindo") {
    return (
      <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-white" strokeWidth={2}>
        <path d="M3 8.5 10 4l7 4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 7.5V16h11V7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "pergunta_respondida") {
    return (
      <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-white" strokeWidth={2}>
        <path
          d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v6A1.5 1.5 0 0 1 14.5 13H9l-3.5 3v-3H5.5A1.5 1.5 0 0 1 4 11.5v-6Z"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-white" strokeWidth={2}>
      <path
        d="M10 17s5.5-4.9 5.5-9A5.5 5.5 0 0 0 4.5 8c0 4.1 5.5 9 5.5 9Z"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="1.75" />
    </svg>
  );
}

function NotificationCard({ notification }: { notification: AppNotification }) {
  const content = (
    <div
      className={`flex items-start gap-3 rounded-xl bg-branco/90 p-4 transition-colors ${
        notification.link ? "hover:bg-branco" : ""
      } ${!notification.isRead ? "border-l-4 border-terracota" : ""}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-oliva">
        <TypeIcon type={notification.type} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-tinta">{notification.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-tinta/80">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-oliva">{formatDate(notification.createdAt)}</p>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

export default function NotificacoesPage() {
  const { user, loading: authLoading } = useAuth();
  const { notifications, loading, markAllAsRead } = useNotifications();
  const markedRef = useRef(false);

  useEffect(() => {
    if (loading || markedRef.current) return;
    if (notifications.some((notification) => !notification.isRead)) {
      markedRef.current = true;
      markAllAsRead();
    }
  }, [loading, notifications, markAllAsRead]);

  return (
    <main className="flex-1 bg-oliva">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <h1 className="font-serif text-2xl text-branco sm:text-3xl">
          Notificações
        </h1>
        <p className="mt-2 text-sm text-branco/80">
          Avisos sobre suas perguntas, novidades do site e boas-vindas.
        </p>

        <div className="mt-8">
          {authLoading ? null : !user ? (
            <div className="rounded-xl bg-branco/90 p-4 text-sm text-oliva">
              <Link
                href="/entrar"
                className="font-medium text-terracota hover:underline"
              >
                Entre
              </Link>{" "}
              para ver suas notificações.
            </div>
          ) : loading ? (
            <p className="text-sm text-branco/80">Carregando notificações...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-branco/80">
              Você ainda não tem notificações.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
