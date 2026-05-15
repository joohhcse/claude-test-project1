# Notification Center Design

Date: 2026-05-15

## Overview

Admin 대시보드에 주문 알림 센터를 추가한다. 두 가지 UI로 구성:
1. **헤더 벨 아이콘 + 드롭다운 패널** — 모든 Admin 페이지에서 접근 가능
2. **대시보드 알림 위젯** — 대시보드 페이지 내 카드형 섹션

알림 상태는 React Context로 관리하여 두 UI가 동일한 데이터를 공유한다. Mock 데이터 기반.

## Data Model

```typescript
// src/domain/types/notification.ts
type NotificationType = "new_order" | "order_status" | "order_cancelled"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  orderId: string
  isRead: boolean
  createdAt: string // ISO date
}
```

알림 타입은 주문 중심 3가지로 제한:
- `new_order` — 신규 주문 접수
- `order_status` — 주문 상태 변경 (처리중, 배송중, 배송완료)
- `order_cancelled` — 주문 취소

## Architecture

### Approach: React Context 기반 상태 공유

`NotificationProvider`가 알림 목록과 액션을 관리하고, 헤더 벨과 대시보드 위젯이 동일한 Context를 소비한다.

이 방식을 선택한 이유:
- 두 UI가 같은 알림 데이터를 보여줘야 하므로 상태 공유 필수
- Mock 데이터 단계에서 Context가 적합한 복잡도
- 나중에 실제 API 전환 시 Provider 내부만 교체하면 됨

### File Structure

```
src/
├── contexts/
│   └── notification-context.tsx   # NotificationProvider + useNotifications hook
├── components/
│   ├── notification-bell.tsx      # 헤더 벨 아이콘 + 드롭다운 (Client Component)
│   └── notification-widget.tsx    # 대시보드 알림 카드 (Client Component)
├── domain/types/
│   └── notification.ts            # Notification, NotificationType 타입
└── lib/mock/
    └── notifications.ts           # Mock 알림 데이터 10-15건
```

### Context API

```typescript
interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}
```

## Components

### NotificationProvider (`src/contexts/notification-context.tsx`)

- Client Component (`"use client"`)
- mock 알림 데이터를 초기 state로 로드
- `markAsRead(id)` — 특정 알림을 읽음 처리
- `markAllAsRead()` — 모든 알림을 읽음 처리
- `unreadCount` — `notifications.filter(n => !n.isRead).length`로 계산
- Admin 레이아웃(`src/app/(admin)/layout.tsx`)에서 children을 감싼다

### NotificationBell (`src/components/notification-bell.tsx`)

- Client Component (`"use client"`)
- 벨 아이콘 + 빨간 뱃지 (안읽은 수, 0이면 뱃지 숨김)
- 클릭 시 드롭다운 토글 (최근 알림 5건)
- 각 알림 항목: 아이콘 + 제목 + 메시지 + 상대 시간 (예: "2분 전", "1시간 전", "3일 전" — 간단한 유틸 함수로 계산, 외부 라이브러리 불필요)
- 안읽은 알림은 파란색 배경으로 구분
- "모두 읽음" 버튼으로 일괄 읽음 처리
- 알림 클릭 시 해당 주문 상세 페이지(`/orders/{orderId}`)로 이동 + 읽음 처리
- 드롭다운 외부 클릭 시 닫힘
- Admin 레이아웃의 헤더 영역에 배치

### NotificationWidget (`src/components/notification-widget.tsx`)

- Client Component (`"use client"`)
- 대시보드 페이지 내 카드형 섹션
- 전체 알림 목록 표시 (최신순 내림차순 정렬)
- 안읽은 알림: 파란 점 + 파란색 배경, 읽은 알림: 기본 배경 + 흐린 텍스트
- "모두 읽음" 버튼
- 알림 클릭 시 주문 상세로 이동 + 읽음 처리

### Mock Data (`src/lib/mock/notifications.ts`)

10-15건의 mock 알림 데이터. 타입별로 고르게 분포:
- `new_order` 5-6건
- `order_status` 5-6건
- `order_cancelled` 2-3건

일부는 `isRead: true`, 일부는 `isRead: false`로 설정. `orderId`는 기존 mock 주문 데이터의 ID를 참조.

## Existing Code Changes

### `src/app/(admin)/layout.tsx`

- `NotificationProvider`로 children을 감싼다
- 사이드바 옆 메인 콘텐츠 영역 상단에 헤더 바 추가
- 헤더 바에 `NotificationBell` 배치

### `src/app/(admin)/dashboard/page.tsx`

- 차트 섹션과 최근 주문 테이블 사이에 `NotificationWidget` 삽입

### 변경하지 않는 파일

- `src/components/sidebar.tsx` — 변경 없음
- 기존 KPI 카드, 차트, 테이블 컴포넌트 — 변경 없음

## Error Handling

- Context가 Provider 밖에서 사용될 경우 에러 throw (`useNotifications` hook에서 체크)
- 빈 알림 목록일 때 "새 알림이 없습니다" 빈 상태 표시

## Testing Considerations

- `NotificationProvider`의 `markAsRead`, `markAllAsRead` 동작 검증
- 벨 아이콘의 뱃지 카운트가 읽음 처리 후 감소하는지 확인
- 드롭다운 외부 클릭 시 닫히는지 확인
- 대시보드 위젯과 헤더 벨의 상태 동기화 확인
