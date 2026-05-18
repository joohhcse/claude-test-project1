"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CategoryData {
  category: string;
  count: number;
}

export function CategoryChart({ data }: { data: CategoryData[] }) {
  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <h2 className="mb-4 font-semibold">선호 카테고리 분포</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip formatter={(v) => [`${v}건`, "주문"]} />
          <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
