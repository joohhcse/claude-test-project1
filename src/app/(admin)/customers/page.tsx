"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SearchFilter } from "@/components/search-filter";
import { mockCustomers } from "@/lib/mock/customers";
import type { Customer } from "@/domain/types/customer";

type SortKey = "joinedAt" | "totalSpent";
type SortDir = "asc" | "desc";

const gradeLabel: Record<string, string> = {
  vvip: "VVIP",
  vip: "VIP",
  normal: "일반",
};

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("joinedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    let list = mockCustomers.filter(
      (c) =>
        !search ||
        c.name.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase()),
    );
    list = [...list].sort((a, b) => {
      const va = sortKey === "joinedAt" ? a.joinedAt : a.totalSpent;
      const vb = sortKey === "joinedAt" ? b.joinedAt : b.totalSpent;
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [search, sortKey, sortDir]);

  const totalCount = mockCustomers.length;
  const newThisMonth = mockCustomers.filter((c) =>
    c.joinedAt.startsWith("2025-05"),
  ).length;
  const vipCount = mockCustomers.filter(
    (c) => c.grade === "vip" || c.grade === "vvip",
  ).length;
  const vipPercent = Math.round((vipCount / totalCount) * 100);

  const columns = [
    {
      header: "고객명",
      cell: (row: Customer) => (
        <span className="font-medium">
          {row.name}
          {(row.grade === "vip" || row.grade === "vvip") && (
            <span className="ml-1 text-yellow-500" title={gradeLabel[row.grade]}>
              ★
            </span>
          )}
        </span>
      ),
    },
    { header: "이메일", cell: (row: Customer) => row.email },
    {
      header: "등급",
      cell: (row: Customer) => gradeLabel[row.grade],
    },
    {
      header: "총 주문",
      cell: (row: Customer) => `${row.totalOrders}건`,
    },
    {
      header: "총 구매액",
      cell: (row: Customer) => `₩${row.totalSpent.toLocaleString()}`,
    },
    {
      header: "가입일",
      cell: (row: Customer) =>
        new Date(row.joinedAt).toLocaleDateString("ko-KR"),
    },
  ];

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">고객 관리</h1>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="이름 또는 이메일 검색..."
        />
        <button
          onClick={() => toggleSort("joinedAt")}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            sortKey === "joinedAt"
              ? "border-primary text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          가입일 {sortKey === "joinedAt" && (sortDir === "desc" ? "↓" : "↑")}
        </button>
        <button
          onClick={() => toggleSort("totalSpent")}
          className={`rounded-md border px-3 py-2 text-sm transition-colors ${
            sortKey === "totalSpent"
              ? "border-primary text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          구매액 {sortKey === "totalSpent" && (sortDir === "desc" ? "↓" : "↑")}
        </button>
      </div>

      {/* Table — clickable rows */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 font-medium text-muted-foreground"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                onClick={() => router.push(`/customers/${row.id}`)}
                className="cursor-pointer border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
              >
                {columns.map((col, j) => (
                  <td key={j} className="px-4 py-3">
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-white p-4 text-center">
          <p className="text-sm text-muted-foreground">전체 고객 수</p>
          <p className="mt-1 text-2xl font-bold">{totalCount}명</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4 text-center">
          <p className="text-sm text-muted-foreground">이달의 신규 고객</p>
          <p className="mt-1 text-2xl font-bold">{newThisMonth}명</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4 text-center">
          <p className="text-sm text-muted-foreground">VIP 비중</p>
          <p className="mt-1 text-2xl font-bold">
            {vipPercent}%{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({vipCount}명)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
