"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/contexts/notification-context";
import { timeAgo } from "@/lib/time-ago";
import type { NotificationType } from "@/domain/types/notification";

const typeIcon: Record<NotificationType, string> = {
  new_order: "📦",
  order_status: "🚚",
  order_cancelled: "❌",
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const recent = useMemo(
    () =>
      [...notifications]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [notifications],
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`알림${unreadCount > 0 ? ` (읽지 않은 알림 ${unreadCount}건)` : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-md p-2 text-muted-foreground hover:bg-muted"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold">알림</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                모두 읽음
              </button>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              새 알림이 없습니다
            </div>
          ) : (
            <ul>
              {recent.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      markAsRead(n.id);
                      setIsOpen(false);
                      router.push(`/orders/${n.orderId}`);
                    }}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted ${
                      n.isRead ? "" : "bg-blue-50"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm">
                      {typeIcon[n.type]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${n.isRead ? "text-muted-foreground" : "font-medium"}`}
                      >
                        {n.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {n.message}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/60">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
