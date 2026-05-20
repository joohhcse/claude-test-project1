"use client";

import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import type { Notification } from "@/domain/types/notification";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/api";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNotifications({ page: 0, size: 20 })
      .then((res) => setNotifications(res.content))
      .catch(() => { /* API 실패 시 빈 배열 유지 */ })
      .finally(() => setIsLoading(false));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    markNotificationAsRead(id).catch(() => { /* silent */ });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    markAllNotificationsAsRead().catch(() => { /* silent */ });
  }, []);

  const value = useMemo(
    () => ({ notifications, unreadCount, isLoading, markAsRead, markAllAsRead }),
    [notifications, unreadCount, isLoading, markAsRead, markAllAsRead],
  );

  return (
    <NotificationContext value={value}>
      {children}
    </NotificationContext>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
