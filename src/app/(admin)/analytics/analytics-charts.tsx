"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailySalesData {
  date: string;
  sales: number;
}

interface RegionalData {
  region: string;
  sales: number;
}

export function DailySalesChart({ data }: { data: DailySalesData[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
        />
        <Tooltip
          formatter={(v) => [`₩${Number(v).toLocaleString()}`, "매출"]}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#2563eb"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RegionalSalesChart({ data }: { data: RegionalData[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="region" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
        />
        <Tooltip
          formatter={(v) => [`₩${Number(v).toLocaleString()}`, "매출"]}
        />
        <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
