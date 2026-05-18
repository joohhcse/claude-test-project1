"use client";

import { useState } from "react";
import { KPICard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { Pagination } from "@/components/pagination";
import { SearchFilter } from "@/components/search-filter";

interface SampleRow {
  id: string;
  name: string;
  status: string;
  amount: number;
}

const sampleData: SampleRow[] = [
  { id: "ORD-001", name: "김민수", status: "배송완료", amount: 45000 },
  { id: "ORD-002", name: "이지은", status: "처리중", amount: 128000 },
  { id: "ORD-003", name: "박서준", status: "배송중", amount: 67000 },
  { id: "ORD-004", name: "최유리", status: "취소", amount: 32000 },
  { id: "ORD-005", name: "정하늘", status: "대기", amount: 89000 },
];

const statusVariantMap: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  "배송완료": "success",
  "처리중": "info",
  "배송중": "warning",
  "취소": "error",
  "대기": "default",
};

export default function DevPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  return (
    <div className="mx-auto max-w-5xl space-y-12 p-8">
      <h1 className="text-2xl font-bold">공통 컴포넌트 확인</h1>

      {/* KPICard */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">KPICard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="총 매출" value="₩12,450,000" change="+12.5% 전월 대비" trend="up" />
          <KPICard label="주문 수" value="384건" change="-3.2% 전월 대비" trend="down" />
          <KPICard label="신규 고객" value="48명" change="+8명 전월 대비" trend="up" />
          <KPICard label="반품률" value="2.1%" trend="neutral" />
        </div>
      </section>

      {/* StatusBadge */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">StatusBadge</h2>
        <div className="flex gap-3">
          <StatusBadge label="배송완료" variant="success" />
          <StatusBadge label="처리중" variant="info" />
          <StatusBadge label="배송중" variant="warning" />
          <StatusBadge label="취소" variant="error" />
          <StatusBadge label="대기" variant="default" />
        </div>
      </section>

      {/* SearchFilter */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">SearchFilter</h2>
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="주문번호 또는 고객명 검색..."
        />
        {search && (
          <p className="text-sm text-muted-foreground">
            입력값: &quot;{search}&quot;
          </p>
        )}
      </section>

      {/* DataTable */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">DataTable</h2>
        <DataTable
          columns={[
            { header: "주문번호", cell: (row) => row.id },
            { header: "고객명", cell: (row) => row.name },
            {
              header: "상태",
              cell: (row) => (
                <StatusBadge
                  label={row.status}
                  variant={statusVariantMap[row.status]}
                />
              ),
            },
            {
              header: "금액",
              cell: (row) => `₩${row.amount.toLocaleString()}`,
            },
          ]}
          data={sampleData}
        />
      </section>

      {/* Pagination */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pagination</h2>
        <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />
        <p className="text-sm text-muted-foreground">현재 페이지: {page}</p>
      </section>
    </div>
  );
}
