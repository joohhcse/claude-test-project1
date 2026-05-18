"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

function formatKrw(value: number) {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}천만`;
  if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
  return value.toLocaleString();
}

interface MonthlySales {
  month: string;
  sales: number;
}

interface CategorySales {
  category: string;
  sales: number;
}

export function MonthlySalesChart({ data }: { data: MonthlySales[] }) {
  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold">월별 매출 추이</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={formatKrw} />
          <Tooltip formatter={(v) => [`₩${Number(v).toLocaleString()}`, "매출"]} />
          <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategorySalesChart({ data }: { data: CategorySales[] }) {
  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold">카테고리별 매출</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="sales"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name }) => name}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`₩${Number(v).toLocaleString()}`, "매출"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
