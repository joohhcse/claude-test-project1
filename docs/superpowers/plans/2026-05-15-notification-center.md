# Notification Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an order notification center to the admin dashboard with a header bell icon + dropdown and a dashboard widget, sharing state via React Context.

**Architecture:** `NotificationProvider` (React Context) manages notification list and read/unread state. Two consumer components — `NotificationBell` (header dropdown) and `NotificationWidget` (dashboard card) — share the same context. All data is mock-based.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-05-15-notification-center-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/domain/types/notification.ts` | `Notification` and `NotificationType` type definitions |
| Create | `src/lib/mock/notifications.ts` | 12 mock notification records referencing existing order IDs |
| Create | `src/contexts/notification-context.tsx` | `NotificationProvider` + `useNotifications` hook (Client Component) |
| Create | `src/components/notification-bell.tsx` | Header bell icon + dropdown panel (Client Component) |
| Create | `src/components/notification-widget.tsx` | Dashboard notification card (Client Component) |
| Modify | `src/app/(admin)/layout.tsx` | Wrap with `NotificationProvider`, add header bar with `NotificationBell` |
| Modify | `src/app/(admin)/dashboard/page.tsx` | Insert `NotificationWidget` between charts and recent orders |

---

### Task 1: Notification type definition

**Files:**
- Create: `src/domain/types/notification.ts`

- [ ] **Step 1: Create the type file**

```typescript
// src/domain/types/notification.ts
export type NotificationType = "new_order" | "order_status" | "order_cancelled";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId: string;
  isRead: boolean;
  createdAt: string;
}
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no errors related to this file)

- [ ] **Step 3: Commit**

```bash
git add src/domain/types/notification.ts
git commit -m "feat: add Notification type definition"
```

---

### Task 2: Mock notification data

**Files:**
- Create: `src/lib/mock/notifications.ts`

- [ ] **Step 1: Create mock data file**

The mock data references existing order IDs from `src/lib/mock/orders.ts` (ORD-001 through ORD-020). Mix of `isRead: true` and `isRead: false`. Timestamps use ISO strings relative to the mock order dates.

```typescript
// src/lib/mock/notifications.ts
import type { Notification } from "@/domain/types/notification";

export const mockNotifications: Notification[] = [
  {
    id: "NTF-001",
    type: "new_order",
    title: "새 주문이 접수되었습니다",
    message: "ORD-020, 정하늘, ₩129,000",
    orderId: "ORD-020",
    isRead: false,
    createdAt: "2025-05-11T10:05:00Z",
  },
  {
    id: "NTF-002",
    type: "order_cancelled",
    title: "주문이 취소되었습니다",
    message: "ORD-005, 정하늘, ₩145,000",
    orderId: "ORD-005",
    isRead: false,
    createdAt: "2025-05-11T09:50:00Z",
  },
  {
    id: "NTF-003",
    type: "order_status",
    title: "주문 상태가 변경되었습니다",
    message: "ORD-002, 이지은 → 배송중",
    orderId: "ORD-002",
    isRead: false,
    createdAt: "2025-05-11T09:35:00Z",
  },
  {
    id: "NTF-004",
    type: "new_order",
    title: "새 주문이 접수되었습니다",
    message: "ORD-017, 송지효, ₩189,000",
    orderId: "ORD-017",
    isRead: false,
    createdAt: "2025-05-10T16:00:00Z",
  },
  {
    id: "NTF-005",
    type: "order_status",
    title: "주문 상태가 변경되었습니다",
    message: "ORD-001, 김민수 → 배송완료",
    orderId: "ORD-001",
    isRead: true,
    createdAt: "2025-05-10T14:30:00Z",
  },
  {
    id: "NTF-006",
    type: "new_order",
    title: "새 주문이 접수되었습니다",
    message: "ORD-014, 한소희, ₩75,000",
    orderId: "ORD-014",
    isRead: true,
    createdAt: "2025-05-10T12:00:00Z",
  },
  {
    id: "NTF-007",
    type: "order_status",
    title: "주문 상태가 변경되었습니다",
    message: "ORD-008, 강다니엘 → 배송중",
    orderId: "ORD-008",
    isRead: true,
    createdAt: "2025-05-09T11:20:00Z",
  },
  {
    id: "NTF-008",
    type: "new_order",
    title: "새 주문이 접수되었습니다",
    message: "ORD-012, 박서준, ₩28,000",
    orderId: "ORD-012",
    isRead: true,
    createdAt: "2025-05-09T08:30:00Z",
  },
  {
    id: "NTF-009",
    type: "order_status",
    title: "주문 상태가 변경되었습니다",
    message: "ORD-003, 박서준 → 처리중",
    orderId: "ORD-003",
    isRead: true,
    createdAt: "2025-05-08T17:00:00Z",
  },
  {
    id: "NTF-010",
    type: "order_cancelled",
    title: "주문이 취소되었습니다",
    message: "ORD-005, 정하늘, ₩145,000",
    orderId: "ORD-005",
    isRead: true,
    createdAt: "2025-05-08T13:15:00Z",
  },
  {
    id: "NTF-011",
    type: "new_order",
    title: "새 주문이 접수되었습니다",
    message: "ORD-009, 송지효, ₩90,000",
    orderId: "ORD-009",
    isRead: true,
    createdAt: "2025-05-08T10:30:00Z",
  },
  {
    id: "NTF-012",
    type: "order_status",
    title: "주문 상태가 변경되었습니다",
    message: "ORD-010, 유재석 → 배송완료",
    orderId: "ORD-010",
    isRead: true,
    createdAt: "2025-05-07T15:45:00Z",
  },
  {
    id: "NTF-013",
    type: "new_order",
    title: "새 주문이 접수되었습니다",
    message: "ORD-006, 한소희, ₩118,000",
    orderId: "ORD-006",
    isRead: true,
    createdAt: "2025-05-07T10:05:00Z",
  },
];
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/mock/notifications.ts
git commit -m "feat: add mock notification data"
```

---

### Task 3: NotificationProvider context

**Files:**
- Create: `src/contexts/notification-context.tsx`

- [ ] **Step 1: Create the context file**

```typescript
// src/contexts/notification-context.tsx
"use client";

import { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { Notification } from "@/domain/types/notification";
import { mockNotifications } from "@/lib/mock/notifications";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, markAllAsRead }),
    [notifications, unreadCount, markAsRead, markAllAsRead],
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
```

Note: React 19 uses `<Context value={...}>` instead of `<Context.Provider value={...}>`.

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/contexts/notification-context.tsx
git commit -m "feat: add NotificationProvider context"
```

---

### Task 4: NotificationBell component

**Files:**
- Create: `src/components/notification-bell.tsx`

- [ ] **Step 1: Create the bell component**

This component renders a bell icon with an unread badge. Clicking toggles a dropdown showing the 5 most recent notifications. Clicking a notification navigates to the order detail page and marks it as read. An outside click closes the dropdown.

```typescript
// src/components/notification-bell.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/contexts/notification-context";
import type { NotificationType } from "@/domain/types/notification";

const typeIcon: Record<NotificationType, string> = {
  new_order: "📦",
  order_status: "🚚",
  order_cancelled: "❌",
};

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recent = notifications.slice(0, 5);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-md p-2 text-muted-foreground hover:bg-muted"
      >
        <svg
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
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/notification-bell.tsx
git commit -m "feat: add NotificationBell header component"
```

---

### Task 5: NotificationWidget component

**Files:**
- Create: `src/components/notification-widget.tsx`

- [ ] **Step 1: Create the widget component**

This component renders a card-style notification list for the dashboard page. Shows all notifications sorted by newest first. Unread items have a blue dot and blue background.

```typescript
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
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/notification-widget.tsx
git commit -m "feat: add NotificationWidget dashboard component"
```

---

### Task 6: Integrate into Admin layout

**Files:**
- Modify: `src/app/(admin)/layout.tsx`

- [ ] **Step 1: Update admin layout**

The current layout is a Server Component with just `<Sidebar />` and `<main>`. We need to:
1. Wrap everything with `NotificationProvider` (this makes the layout a parent of Client Components but doesn't itself need `"use client"` — the provider is the client boundary)
2. Add a header bar in the main content area with `NotificationBell`

Replace the entire file with:

```typescript
// src/app/(admin)/layout.tsx
import { Sidebar } from "@/components/sidebar";
import { NotificationProvider } from "@/contexts/notification-context";
import { NotificationBell } from "@/components/notification-bell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NotificationProvider>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 shrink-0 items-center justify-end border-b border-border bg-white px-6">
            <NotificationBell />
          </header>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/(admin)/layout.tsx
git commit -m "feat: integrate NotificationProvider and bell into admin layout"
```

---

### Task 7: Add NotificationWidget to dashboard page

**Files:**
- Modify: `src/app/(admin)/dashboard/page.tsx`

- [ ] **Step 1: Insert NotificationWidget**

Add the import at the top and insert the widget between the charts section and the recent orders section. The dashboard page itself remains a Server Component — `NotificationWidget` is a Client Component that renders within it.

Add this import after the existing imports:

```typescript
import { NotificationWidget } from "@/components/notification-widget";
```

Insert the widget between the `{/* Charts */}` section and the `{/* Recent Orders */}` section. The updated JSX order in the return becomes:

```tsx
{/* KPI Cards */}
{/* Charts */}

{/* Notifications */}
<NotificationWidget />

{/* Recent Orders */}
```

The only change is adding the import line and the `<NotificationWidget />` element. No other lines change.

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/(admin)/dashboard/page.tsx
git commit -m "feat: add notification widget to dashboard page"
```

---

### Task 8: Build verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors.

- [ ] **Step 3: Visual smoke test**

Run: `npm run dev`
Open `http://localhost:3000/dashboard` and verify:
1. Header bar appears at top of main content area with bell icon
2. Bell shows red badge with unread count (4)
3. Clicking bell opens dropdown with 5 most recent notifications
4. Unread notifications have blue background
5. "모두 읽음" button marks all as read (badge disappears)
6. Dashboard page shows "최근 알림" card between charts and recent orders
7. Notification widget and bell share same read/unread state
8. Clicking a notification navigates to `/orders/{orderId}`

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: address build/lint issues from notification center"
```

Only run this step if Steps 1-2 required fixes.
