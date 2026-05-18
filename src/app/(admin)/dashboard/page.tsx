import Link from "next/link";
import { KPICard } from "@/components/kpi-card";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { NotificationWidget } from "@/components/notification-widget";
import {
  kpiData,
  monthlySalesData,
  categorySalesData,
  recentOrders,
} from "@/lib/mock/dashboard";
import { MonthlySalesChart, CategorySalesChart } from "./dashboard-charts";
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

export default function DashboardPage() {
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
    </div>
  );
}
