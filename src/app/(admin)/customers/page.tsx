"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchFilter } from "@/components/search-filter";
import { Pagination } from "@/components/pagination";
import { getCustomers } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import type { Customer } from "@/domain/types/customer";

type SortKey = "joinedAt" | "totalSpent";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

const gradeLabel: Record<string, string> = {
  vvip: "VVIP",
  vip: "VIP",
  normal: "일반",
};

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("joinedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
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
      getCustomers({
        page: page - 1,
        size: PAGE_SIZE,
        sort: sortKey,
        direction: sortDir,
        search: debouncedSearch || undefined,
      }),
    [page, sortKey, sortDir, debouncedSearch],
  );

  const customers = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

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
    setPage(1);
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

      {/* Table — clickable rows */}
      {!isLoading && !error && (
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
              {customers.map((row) => (
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
      )}

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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-white p-4 text-center">
          <p className="text-sm text-muted-foreground">전체 고객 수</p>
          <p className="mt-1 text-2xl font-bold">{totalElements}명</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4 text-center">
          <p className="text-sm text-muted-foreground">현재 페이지</p>
          <p className="mt-1 text-2xl font-bold">{page} / {totalPages}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4 text-center">
          <p className="text-sm text-muted-foreground">표시 항목</p>
          <p className="mt-1 text-2xl font-bold">{customers.length}명</p>
        </div>
      </div>
    </div>
  );
}
