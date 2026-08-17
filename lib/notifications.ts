import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-browser";
import type { NotificationType } from "@/types/database";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  createdAt: string;
  isRead: boolean;
}

export async function getNotifications(
  userId: string,
): Promise<AppNotification[]> {
  const [{ data: notifications, error }, { data: reads, error: readsError }] =
    await Promise.all([
      supabase
        .from("notifications")
        .select("id, type, title, message, link, created_at")
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("notification_reads")
        .select("notification_id")
        .eq("user_id", userId),
    ]);

  if (error) throw error;
  if (readsError) throw readsError;

  const readIds = new Set(reads.map((read) => read.notification_id));

  return notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    link: notification.link,
    createdAt: notification.created_at,
    isRead: readIds.has(notification.id),
  }));
}

export async function markNotificationsRead(
  notificationIds: string[],
  userId: string,
) {
  if (notificationIds.length === 0) return;
  const client = createClient();
  const rows = notificationIds.map((notificationId) => ({
    notification_id: notificationId,
    user_id: userId,
  }));
  const { error } = await client
    .from("notification_reads")
    .upsert(rows, { onConflict: "notification_id,user_id", ignoreDuplicates: true });
  if (error) throw error;
}
