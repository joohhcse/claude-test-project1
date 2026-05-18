"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { SearchFilter } from "@/components/search-filter";
import { mockOrders } from "@/lib/mock/orders";
import type { Order, OrderStatus } from "@/domain/types/order";

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "대기", value: "pending" },
  { label: "처리중", value: "processing" },
  { label: "배송중", value: "shipped" },
  { label: "배송완료", value: "delivered" },
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

export default function OrdersPage() {
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    return mockOrders.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (
        search &&
        !o.id.toLowerCase().includes(search.toLowerCase()) &&
        !o.customerName.includes(search)
      )
        return false;
      if (dateFrom && o.orderedAt < dateFrom) return false;
      if (dateTo && o.orderedAt > dateTo + "T23:59:59Z") return false;
      return true;
    });
  }, [tab, search, dateFrom, dateTo]);

  const pendingCount = mockOrders.filter(
    (o) => o.status === "pending" || o.status === "processing",
  ).length;

  const columns = [
    {
      header: "주문번호",
      cell: (row: Order) => (
        <Link
          href={`/orders/${row.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.id}
        </Link>
      ),
    },
    { header: "고객명", cell: (row: Order) => row.customerName },
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">주문 관리</h1>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.value
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="주문번호 또는 고객명 검색..."
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <span className="text-sm text-muted-foreground">~</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filtered} />

      {/* Pending summary bar */}
      <div className="rounded-lg border border-border bg-blue-50 px-4 py-3 text-sm">
        <span className="font-medium text-primary">처리 필요 주문:</span>{" "}
        <span className="font-bold">{pendingCount}건</span>
        <span className="text-muted-foreground">
          {" "}
          (대기 {mockOrders.filter((o) => o.status === "pending").length}건 +
          처리중{" "}
          {mockOrders.filter((o) => o.status === "processing").length}건)
        </span>
      </div>
    </div>
  );
}
