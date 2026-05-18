"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "대시보드", href: "/dashboard" },
  { label: "상품관리", href: "/products" },
  { label: "주문관리", href: "/orders" },
  { label: "고객관리", href: "/customers" },
  { label: "분석", href: "/analytics" },
  { label: "설정", href: "/settings" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-white">
      <div className="p-6">
        <h2 className="text-lg font-bold text-primary">Mall Admin</h2>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
