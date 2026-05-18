interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export function KPICard({ label, value, change, trend }: KPICardProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {change && (
        <p
          className={`mt-1 text-sm ${
            trend === "up"
              ? "text-green-600"
              : trend === "down"
                ? "text-red-600"
                : "text-muted-foreground"
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );
}
