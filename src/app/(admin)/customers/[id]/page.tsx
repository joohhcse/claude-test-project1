"use client";

import { use } from "react";
import Link from "next/link";
import { mockCustomers } from "@/lib/mock/customers";
import { mockOrders } from "@/lib/mock/orders";
import { KPICard } from "@/components/kpi-card";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { CategoryChart } from "./category-chart";
import type { Order, OrderStatus } from "@/domain/types/order";

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

const gradeLabel: Record<string, string> = {
  vvip: "VVIP",
  vip: "VIP",
  normal: "일반",
};

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const customer = mockCustomers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        고객을 찾을 수 없습니다.
      </div>
    );
  }

  const customerOrders = mockOrders.filter((o) => o.customerId === id);
  const avgOrderAmount =
    customerOrders.length > 0
      ? Math.round(
          customerOrders.reduce((s, o) => s + o.totalAmount, 0) /
            customerOrders.length,
        )
      : 0;

  // Category distribution from order items
  const categoryCount: Record<string, number> = {};
  customerOrders.forEach((o) =>
    o.items.forEach((item) => {
      // Derive category from product name patterns (simplified mock logic)
      const cat = getCategoryFromProduct(item.productId);
      categoryCount[cat] = (categoryCount[cat] || 0) + item.quantity;
    }),
  );
  const categoryData = Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const orderColumns = [
    {
      header: "주문번호",
      cell: (row: Order) => (
        <Link
          href={`/orders/${row.id}`}
          className="text-primary hover:underline"
        >
          {row.id}
        </Link>
      ),
    },
    {
      header: "상품",
      cell: (row: Order) =>
        row.items.length === 1
          ? row.items[0].name
          : `${row.items[0].name} 외 ${row.items.length - 1}건`,
    },
    {
      header: "금액",
      cell: (row: Order) => `₩${row.totalAmount.toLocaleString()}`,
    },
    {
      header: "상태",
      cell: (row: Order) => (
        <StatusBadge
          label={statusLabel[row.status]}
          variant={statusVariant[row.status]}
        />
      ),
    },
    {
      header: "주문일",
      cell: (row: Order) =>
        new Date(row.orderedAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 고객 목록
      </Link>

      {/* Profile card */}
      <div className="flex items-center gap-5 rounded-lg border border-border bg-white p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          {customer.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold">
            {customer.name}
            {customer.grade !== "normal" && (
              <span className="ml-2 text-yellow-500">★</span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
          <p className="text-xs text-muted-foreground">
            가입일: {new Date(customer.joinedAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="총 주문 횟수" value={`${customer.totalOrders}건`} />
        <KPICard
          label="총 누적 구매액"
          value={`₩${customer.totalSpent.toLocaleString()}`}
        />
        <KPICard
          label="평균 주문 단가"
          value={`₩${avgOrderAmount.toLocaleString()}`}
        />
        <KPICard label="고객 등급" value={gradeLabel[customer.grade]} />
      </div>

      {/* Order history */}
      <div className="space-y-3">
        <h2 className="font-semibold">주문 이력</h2>
        {customerOrders.length > 0 ? (
          <DataTable columns={orderColumns} data={customerOrders} />
        ) : (
          <p className="text-sm text-muted-foreground">주문 이력이 없습니다.</p>
        )}
      </div>

      {/* Category chart */}
      {categoryData.length > 0 && <CategoryChart data={categoryData} />}
    </div>
  );
}

/** Simplified mock: map productId prefix to category */
function getCategoryFromProduct(productId: string): string {
  const map: Record<string, string> = {
    P001: "의류",
    P005: "의류",
    P008: "의류",
    P011: "의류",
    P015: "의류",
    P002: "전자기기",
    P006: "전자기기",
    P009: "전자기기",
    P012: "전자기기",
    P016: "전자기기",
    P003: "식품",
    P007: "식품",
    P013: "식품",
    P017: "식품",
    P004: "생활용품",
    P010: "생활용품",
    P014: "생활용품",
    P018: "생활용품",
  };
  return map[productId] ?? "기타";
}
