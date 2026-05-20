import Link from "next/link";
import { KPICard } from "@/components/kpi-card";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { NotificationWidget } from "@/components/notification-widget";
import {
  monthlySalesData,
  categorySalesData,
} from "@/lib/mock/dashboard";
import { getAnalyticsKpi, getOrders } from "@/lib/api";
import { MonthlySalesChart, CategorySalesChart } from "./dashboard-charts";
import { CorsTest } from "./cors-test";
import type { Order, OrderStatus } from "@/domain/types/order";

const statusLabel: Record<OrderStatus, string> = {
  pending: "대기",
  processing: "처리중",
  shipped: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

const statusVariant: Record<OrderStatus, "success" | "warning" | "error" | "info" | "default"> = {
  pending: "default",
  processing: "info",
  shipped: "warning",
  delivered: "success",
  cancelled: "error",
};

const orderColumns = [
  { header: "주문번호", cell: (row: Order) => row.id },
  { header: "고객명", cell: (row: Order) => row.customerName },
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
    cell: (row: Order) => new Date(row.orderedAt).toLocaleDateString("ko-KR"),
  },
];

export default async function DashboardPage() {
  let kpiData: { label: string; value: string; change?: string; trend?: "up" | "down" | "neutral" }[] = [];
  let recentOrders: Order[] = [];

  try {
    const [kpiRes, ordersRes] = await Promise.all([
      getAnalyticsKpi({ period: "2025-05" }),
      getOrders({ page: 0, size: 5, sort: "orderedAt", direction: "desc" }),
    ]);

    kpiData = [
      { label: "총 매출", value: `₩${kpiRes.revenue.toLocaleString()}`, change: "+12.5% 전월 대비", trend: "up" },
      { label: "주문 수", value: `${kpiRes.orders}건`, change: "-3.2% 전월 대비", trend: "down" },
      { label: "신규 고객", value: "48명", change: "+8명 전월 대비", trend: "up" },
      { label: "평균 주문액", value: `₩${kpiRes.avgOrderValue.toLocaleString()}`, change: "+5.1% 전월 대비", trend: "up" },
    ];

    recentOrders = ordersRes.content;
  } catch {
    // API 실패 시 빈 데이터로 렌더링
    kpiData = [
      { label: "총 매출", value: "-" },
      { label: "주문 수", value: "-" },
      { label: "신규 고객", value: "-" },
      { label: "평균 주문액", value: "-" },
    ];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MonthlySalesChart data={monthlySalesData} />
        <CategorySalesChart data={categorySalesData} />
      </div>

      {/* Notifications */}
      <NotificationWidget />

      {/* Recent Orders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">최근 주문</h2>
          <Link
            href="/orders"
            className="text-sm text-primary hover:underline"
          >
            전체 보기
          </Link>
        </div>
        <DataTable columns={orderColumns} data={recentOrders} />
      </div>

      {/* CORS Test */}
      <CorsTest />
    </div>
  );
}
