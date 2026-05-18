"use client";

import { useState } from "react";
import { KPICard } from "@/components/kpi-card";
import {
  analyticsKpi,
  dailySales30,
  dailySales7,
  dailySales1,
  bestsellers,
  regionalSales,
  aiInsights,
} from "@/lib/mock/analytics";
import { DailySalesChart, RegionalSalesChart } from "./analytics-charts";

type Period = "today" | "7d" | "30d" | "custom";

const periodLabel: Record<Period, string> = {
  today: "오늘",
  "7d": "7일",
  "30d": "30일",
  custom: "직접선택",
};

function getSalesData(period: Period) {
  if (period === "today") return dailySales1;
  if (period === "7d") return dailySales7;
  return dailySales30;
}

function downloadCsv() {
  const header = "날짜,매출\n";
  const rows = dailySales30.map((d) => `${d.date},${d.sales}`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sales-data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const chartData = getSalesData(period);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">분석</h1>

      {/* Period filter + Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="매출" value={analyticsKpi.revenue} />
        <KPICard label="주문수" value={analyticsKpi.orders} />
        <KPICard label="객단가" value={analyticsKpi.avgOrderValue} />
        <KPICard label="전환율" value={analyticsKpi.conversionRate} />
      </div>

      {/* Main chart + Side */}
      <div className="grid grid-cols-3 gap-4">
        {/* Daily sales line chart (2 cols) */}
        <div className="col-span-2 rounded-lg border border-border bg-white p-6">
          <h2 className="mb-4 font-semibold">일별 매출 추이</h2>
          <DailySalesChart data={chartData} />
        </div>

        {/* Side: Bestsellers + Regional */}
        <div className="space-y-4">
          {/* Bestsellers */}
          <div className="rounded-lg border border-border bg-white p-6">
            <h2 className="mb-3 font-semibold">베스트셀러 Top 5</h2>
            <ol className="space-y-2">
              {bestsellers.map((item) => (
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
            <RegionalSalesChart data={regionalSales} />
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
