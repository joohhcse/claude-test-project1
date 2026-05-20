"use client";

import { useState, useMemo } from "react";
import { KPICard } from "@/components/kpi-card";
import { aiInsights } from "@/lib/mock/analytics";
import {
  getDailySales,
  getBestsellers,
  getRegionalSales,
  getAnalyticsKpi,
} from "@/lib/api";
import type { DailySalesRow, BestsellerRow, RegionalSalesRow, AnalyticsKpiRow } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { DailySalesChart, RegionalSalesChart } from "./analytics-charts";

type Period = "today" | "7d" | "30d" | "custom";

const periodLabel: Record<Period, string> = {
  today: "오늘",
  "7d": "7일",
  "30d": "30일",
  custom: "직접선택",
};

function getDateRange(period: Period, customFrom: string, customTo: string) {
  if (period === "custom" && customFrom && customTo) {
    return { startDate: customFrom, endDate: customTo };
  }
  const end = new Date();
  const start = new Date();
  const days = period === "today" ? 1 : period === "7d" ? 7 : 30;
  start.setDate(end.getDate() - days + 1);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function formatKpi(kpi: AnalyticsKpiRow | null) {
  if (!kpi) return { revenue: "-", orders: "-", avgOrderValue: "-", conversionRate: "-" };
  return {
    revenue: `₩${kpi.revenue.toLocaleString()}`,
    orders: `${kpi.orders}건`,
    avgOrderValue: `₩${kpi.avgOrderValue.toLocaleString()}`,
    conversionRate: `${kpi.conversionRate}%`,
  };
}

function toChartSales(rows: DailySalesRow[] | null) {
  if (!rows) return [];
  return rows.map((r) => {
    const d = new Date(r.date);
    return { date: `${d.getMonth() + 1}/${d.getDate()}`, sales: r.totalSales };
  });
}

function toChartBestsellers(rows: BestsellerRow[] | null) {
  if (!rows) return [];
  return rows.map((r) => ({ rank: r.rank, name: r.productName, sales: r.salesCount }));
}

function toChartRegional(rows: RegionalSalesRow[] | null) {
  if (!rows) return [];
  return rows.map((r) => ({ region: r.region, sales: r.salesAmount }));
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const { startDate, endDate } = useMemo(
    () => getDateRange(period, customFrom, customTo),
    [period, customFrom, customTo],
  );

  const periodStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const { data: dailySalesRaw } = useApi(
    () => getDailySales({ startDate, endDate }),
    [startDate, endDate],
  );
  const { data: kpiRaw } = useApi(
    () => getAnalyticsKpi({ period: periodStr }),
    [periodStr],
  );
  const { data: bestsellersRaw } = useApi(
    () => getBestsellers({ period: periodStr }),
    [periodStr],
  );
  const { data: regionalRaw } = useApi(
    () => getRegionalSales({ period: periodStr }),
    [periodStr],
  );

  const chartData = toChartSales(dailySalesRaw);
  const kpi = formatKpi(kpiRaw);
  const bestsellersList = toChartBestsellers(bestsellersRaw);
  const regionalList = toChartRegional(regionalRaw);

  function downloadCsv() {
    const header = "날짜,매출\n";
    const rows = chartData.map((d) => `${d.date},${d.sales}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">분석</h1>

      {/* Period filter + Export */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(periodLabel) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {periodLabel[p]}
            </button>
          ))}
          {period === "custom" && (
            <div className="ml-2 flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded-md border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
              />
              <span className="text-sm text-muted-foreground">~</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="rounded-md border border-border px-2 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadCsv}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            CSV 내보내기
          </button>
          <button
            onClick={downloadCsv}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            Excel 내보내기
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="매출" value={kpi.revenue} />
        <KPICard label="주문수" value={kpi.orders} />
        <KPICard label="객단가" value={kpi.avgOrderValue} />
        <KPICard label="전환율" value={kpi.conversionRate} />
      </div>

      {/* Main chart + Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily sales line chart (2 cols) */}
        <div className="md:col-span-2 rounded-lg border border-border bg-white p-6">
          <h2 className="mb-4 font-semibold">일별 매출 추이</h2>
          <DailySalesChart data={chartData} />
        </div>

        {/* Side: Bestsellers + Regional */}
        <div className="space-y-4">
          {/* Bestsellers */}
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="mb-3 font-semibold">베스트셀러 Top 5</h2>
            <ol className="space-y-2">
              {bestsellersList.map((item) => (
                <li key={item.rank} className="flex items-center gap-3 text-sm">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      item.rank <= 3
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.rank}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  <span className="text-muted-foreground">{item.sales}건</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Regional sales */}
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="mb-3 font-semibold">지역별 판매량</h2>
            <RegionalSalesChart data={regionalList} />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h2 className="mb-3 font-semibold text-primary">AI 인사이트</h2>
        <ul className="space-y-2">
          {aiInsights.map((insight, i) => (
            <li key={i} className="text-sm leading-relaxed">
              • {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
