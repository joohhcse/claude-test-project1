// src/components/notification-widget.tsx
"use client";

import { useRouter } from "next/navigation";
import { useNotifications } from "@/contexts/notification-context";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export function NotificationWidget() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">최근 알림</h2>
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

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          새 알림이 없습니다
        </p>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {sorted.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                markAsRead(n.id);
                router.push(`/orders/${n.orderId}`);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted ${
                n.isRead ? "" : "bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {!n.isRead && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                )}
                <div className={n.isRead ? "pl-3.5" : ""}>
                  <p
                    className={`text-sm ${n.isRead ? "text-muted-foreground" : "font-medium"}`}
                  >
                    {n.title} — {n.message.split(",")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {n.message.includes(",") ? n.message.split(",").slice(1).join(",").trim() : ""}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground/60">
                {timeAgo(n.createdAt)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
