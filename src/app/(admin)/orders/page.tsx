"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { SearchFilter } from "@/components/search-filter";
import { Pagination } from "@/components/pagination";
import { getOrders } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
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

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search]);

  const { data, isLoading, error } = useApi(
    () =>
      getOrders({
        page: page - 1,
        size: PAGE_SIZE,
        sort: "orderedAt",
        direction: "desc",
        status: tab === "all" ? undefined : tab,
        search: debouncedSearch || undefined,
      }),
    [page, tab, debouncedSearch],
  );

  // Pending counts for summary bar
  const { data: pendingData } = useApi(
    () => getOrders({ status: "pending", size: 1 }),
    [],
  );
  const { data: processingData } = useApi(
    () => getOrders({ status: "processing", size: 1 }),
    [],
  );

  // Client-side date filtering (API doesn't support date range params)
  const filtered = useMemo(() => {
    if (!data?.content) return [];
    if (!dateFrom && !dateTo) return data.content;
    return data.content.filter((o) => {
      if (dateFrom && o.orderedAt < dateFrom) return false;
      if (dateTo && o.orderedAt > dateTo + "T23:59:59Z") return false;
      return true;
    });
  }, [data, dateFrom, dateTo]);

  const totalPages = data?.totalPages ?? 1;

  const pendingCount = (pendingData?.totalElements ?? 0) + (processingData?.totalElements ?? 0);
  const pendingOnly = pendingData?.totalElements ?? 0;
  const processingOnly = processingData?.totalElements ?? 0;

  function handleTabChange(value: OrderStatus | "all") {
    setTab(value);
    setPage(1);
  }

  const columns = [
    {
      header: "주문번호",
      cell: (row: Order) => (
        <Link
          href={`/orders/${row.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.id.slice(0, 8)}...
        </Link>
      ),
    },
    { header: "고객명", cell: (row: Order) => row.customerName },
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">주문 관리</h1>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabChange(t.value)}
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

      {/* Loading / Error */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      {error && (
        <div className="py-12 text-center text-muted-foreground">
          데이터를 불러올 수 없습니다.
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && <DataTable columns={columns} data={filtered} />}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Pending summary bar */}
      <div className="rounded-lg border border-border bg-blue-50 px-4 py-3 text-sm">
        <span className="font-medium text-primary">처리 필요 주문:</span>{" "}
        <span className="font-bold">{pendingCount}건</span>
        <span className="text-muted-foreground">
          {" "}
          (대기 {pendingOnly}건 + 처리중 {processingOnly}건)
        </span>
      </div>
    </div>
  );
}
