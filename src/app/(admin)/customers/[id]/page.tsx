"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { getCustomer, getOrders, getProducts } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
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

  const { data: customer, isLoading: customerLoading, error: customerError } = useApi(
    () => getCustomer(id),
    [id],
  );

  const { data: ordersData } = useApi(
    () => getOrders({ search: customer?.name, size: 100 }),
    [customer?.name],
  );

  const { data: productsData } = useApi(
    () => getProducts({ size: 100 }),
    [],
  );

  // Filter orders belonging to this customer
  const customerOrders = useMemo(() => {
    if (!ordersData?.content) return [];
    return ordersData.content.filter((o) => o.customerId === id);
  }, [ordersData, id]);

  const avgOrderAmount = useMemo(() => {
    if (customerOrders.length === 0) return 0;
    return Math.round(
      customerOrders.reduce((s, o) => s + o.totalAmount, 0) / customerOrders.length,
    );
  }, [customerOrders]);

  // Build productId → category map from products API
  const productCategoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (productsData?.content) {
      for (const p of productsData.content) {
        map[p.id] = p.category;
      }
    }
    return map;
  }, [productsData]);

  // Category distribution from order items
  const categoryData = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    customerOrders.forEach((o) =>
      o.items.forEach((item) => {
        const cat = productCategoryMap[item.productId] ?? "기타";
        categoryCount[cat] = (categoryCount[cat] || 0) + item.quantity;
      }),
    );
    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [customerOrders, productCategoryMap]);

  if (customerLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (customerError || !customer) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        고객을 찾을 수 없습니다.
      </div>
    );
  }

  const orderColumns = [
    {
      header: "주문번호",
      cell: (row: Order) => (
        <Link
          href={`/orders/${row.id}`}
          className="text-primary hover:underline"
        >
          {row.id.slice(0, 8)}...
        </Link>
      ),
    },
    {
      header: "상품",
      cell: (row: Order) => {
        if (!row.items || row.items.length === 0) return "-";
        return row.items.length === 1
          ? row.items[0].name
          : `${row.items[0].name} 외 ${row.items.length - 1}건`;
      },
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
