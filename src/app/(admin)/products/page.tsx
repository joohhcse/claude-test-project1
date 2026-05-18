"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Pagination } from "@/components/pagination";
import { SearchFilter } from "@/components/search-filter";
import { mockProducts, CATEGORIES } from "@/lib/mock/products";
import type { Product, ProductStatus } from "@/domain/types/product";

const PAGE_SIZE = 8;

const statusLabel: Record<ProductStatus, string> = {
  active: "판매중",
  draft: "임시저장",
  soldout: "품절",
};

const statusVariant: Record<
  ProductStatus,
  "success" | "warning" | "error" | "info" | "default"
> = {
  active: "success",
  draft: "default",
  soldout: "error",
};

type StockFilter = "all" | "low" | "out";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return mockProducts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (stockFilter === "low" && p.stock >= 10) return false;
      if (stockFilter === "out" && p.stock !== 0) return false;
      return true;
    });
  }, [search, categoryFilter, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const allOnPageSelected =
    pageData.length > 0 && pageData.every((p) => selected.has(p.id));

  function toggleAll() {
    const next = new Set(selected);
    if (allOnPageSelected) {
      pageData.forEach((p) => next.delete(p.id));
    } else {
      pageData.forEach((p) => next.add(p.id));
    }
    setSelected(next);
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={allOnPageSelected}
          onChange={toggleAll}
          className="accent-primary"
        />
      ),
      cell: (row: Product) => (
        <input
          type="checkbox"
          checked={selected.has(row.id)}
          onChange={() => toggleOne(row.id)}
          className="accent-primary"
        />
      ),
    },
    {
      header: "이미지",
      cell: (row: Product) => (
        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
          {row.name.charAt(0)}
        </div>
      ),
    },
    {
      header: "상품명",
      cell: (row: Product) => (
        <Link
          href={`/products/${row.id}`}
          className="font-medium hover:text-primary"
        >
          {row.name}
        </Link>
      ),
    },
    { header: "카테고리", cell: (row: Product) => row.category },
    {
      header: "가격",
      cell: (row: Product) => `₩${row.price.toLocaleString()}`,
    },
    {
      header: "재고",
      cell: (row: Product) => (
        <span className={row.stock < 10 ? "text-red-600 font-medium" : ""}>
          {row.stock}
        </span>
      ),
    },
    {
      header: "상태",
      cell: (row: Product) => (
        <StatusBadge
          label={statusLabel[row.status]}
          variant={statusVariant[row.status]}
        />
      ),
    },
    {
      header: "등록일",
      cell: (row: Product) =>
        new Date(row.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      header: "관리",
      cell: (row: Product) => (
        <div className="flex gap-2">
          <Link
            href={`/products/${row.id}`}
            className="text-sm text-primary hover:underline"
          >
            수정
          </Link>
          <button className="text-sm text-red-600 hover:underline">삭제</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Link
          href="/products/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-700 transition-colors"
        >
          상품 등록
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <SearchFilter
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="상품명 검색..."
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="">전체 카테고리</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value as StockFilter);
            setPage(1);
          }}
          className="rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">전체 재고</option>
          <option value="low">부족 (10개 미만)</option>
          <option value="out">품절</option>
        </select>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={pageData} />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Selection Bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 left-60 right-0 border-t border-border bg-white px-6 py-3 flex items-center justify-between shadow-lg">
          <span className="text-sm font-medium">
            {selected.size}개 상품 선택됨
          </span>
          <div className="flex gap-2">
            <button className="rounded-md border border-border px-4 py-1.5 text-sm hover:bg-muted transition-colors">
              일괄 수정
            </button>
            <button className="rounded-md bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700 transition-colors">
              일괄 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
