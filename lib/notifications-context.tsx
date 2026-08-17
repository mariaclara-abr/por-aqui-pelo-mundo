"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth";
import {
  getNotifications,
  markNotificationsRead,
  type AppNotification,
} from "@/lib/notifications";

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  loading: true,
  refresh: async () => {},
  markAllAsRead: async () => {},
});

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.error("Não foi possível carregar as notificações:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    Promise.resolve().then(() => refresh());
  }, [refresh]);

  async function markAllAsRead() {
    if (!user) return;
    const unreadIds = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification.id);
    if (unreadIds.length === 0) return;

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );
    try {
      await markNotificationsRead(unreadIds, user.id);
    } catch (err) {
      console.error("Não foi possível marcar notificações como lidas:", err);
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, loading, refresh, markAllAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
