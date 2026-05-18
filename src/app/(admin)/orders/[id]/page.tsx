"use client";

import { use, useState } from "react";
import Link from "next/link";
import { mockOrders } from "@/lib/mock/orders";
import { StatusBadge } from "@/components/status-badge";
import type { OrderStatus } from "@/domain/types/order";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "주문 접수" },
  { key: "processing", label: "처리중" },
  { key: "shipped", label: "배송중" },
  { key: "delivered", label: "배송완료" },
];

const statusLabel: Record<OrderStatus, string> = {
  pending: "대기",
  processing: "처리중",
  shipped: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

const statusVariant: Record<
  OrderStatus,
  "success" | "warning" | "error" | "info" | "default"
> = {
  pending: "default",
  processing: "info",
  shipped: "warning",
  delivered: "success",
  cancelled: "error",
};

function getStepIndex(status: OrderStatus) {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? -1 : idx;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const order = mockOrders.find((o) => o.id === id);
  const [tracking, setTracking] = useState(order?.trackingNumber ?? "");
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
    order?.status ?? "pending",
  );

  if (!order) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        주문을 찾을 수 없습니다.
      </div>
    );
  }

  const stepIndex = getStepIndex(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← 주문 목록
          </Link>
          <h1 className="text-2xl font-bold">{order.id}</h1>
          <StatusBadge
            label={statusLabel[currentStatus]}
            variant={statusVariant[currentStatus]}
          />
        </div>
      </div>

      {/* Stepper */}
      {!isCancelled && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-white p-6">
          {STEPS.map((step, i) => {
            const done = i <= stepIndex;
            const active = i === stepIndex;
            return (
              <div key={step.key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    } ${active ? "ring-2 ring-primary ring-offset-2" : ""}`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs ${done ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${i < stepIndex ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3-card layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Order info */}
        <div className="rounded-lg border border-border bg-white p-6 space-y-3">
          <h2 className="font-semibold">주문 정보</h2>
          <dl className="space-y-2 text-sm">
            <Row label="주문번호" value={order.id} />
            <Row
              label="주문일시"
              value={new Date(order.orderedAt).toLocaleString("ko-KR")}
            />
            <Row
              label="총 금액"
              value={`₩${order.totalAmount.toLocaleString()}`}
            />
          </dl>
        </div>

        {/* Customer info */}
        <div className="rounded-lg border border-border bg-white p-6 space-y-3">
          <h2 className="font-semibold">고객 정보</h2>
          <dl className="space-y-2 text-sm">
            <Row label="이름" value={order.customerName} />
            <Row label="연락처" value={order.phone} />
            <Row label="고객 ID" value={order.customerId} />
          </dl>
        </div>

        {/* Shipping info */}
        <div className="rounded-lg border border-border bg-white p-6 space-y-3">
          <h2 className="font-semibold">배송 정보</h2>
          <dl className="space-y-2 text-sm">
            <Row label="배송지" value={order.address} />
            <div>
              <dt className="text-muted-foreground">운송장 번호</dt>
              <dd className="mt-0.5">
                <input
                  type="text"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="운송장 번호 입력"
                  className="w-full rounded-md border border-border px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Product table */}
      <div className="rounded-lg border border-border bg-white p-6 space-y-4">
        <h2 className="font-semibold">상품 정보</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 font-medium text-muted-foreground">상품명</th>
              <th className="pb-2 text-right font-medium text-muted-foreground">
                단가
              </th>
              <th className="pb-2 text-right font-medium text-muted-foreground">
                수량
              </th>
              <th className="pb-2 text-right font-medium text-muted-foreground">
                소계
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId} className="border-b border-border">
                <td className="py-3">{item.name}</td>
                <td className="py-3 text-right">
                  ₩{item.unitPrice.toLocaleString()}
                </td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right font-medium">
                  ₩{(item.unitPrice * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-3 text-right font-semibold">
                합계
              </td>
              <td className="pt-3 text-right text-lg font-bold text-primary">
                ₩{order.totalAmount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setCurrentStatus("cancelled")}
          disabled={isCancelled}
          className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
        >
          주문 취소
        </button>
        <button
          type="button"
          onClick={() => {
            // Mock: advance to next status
            const next = STEPS[stepIndex + 1];
            if (next) setCurrentStatus(next.key);
          }}
          disabled={isCancelled || stepIndex >= STEPS.length - 1}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          상태 변경 저장
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
