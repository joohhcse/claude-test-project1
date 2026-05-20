import type { Customer } from "@/domain/types/customer";
import type { Product } from "@/domain/types/product";
import type { Order } from "@/domain/types/order";
import type { Notification } from "@/domain/types/notification";
import type { PaginatedResponse, UnreadCountResponse } from "@/domain/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// ---------------------------------------------------------------------------
// Base fetch wrapper
// ---------------------------------------------------------------------------

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `API error: ${res.status} ${res.statusText}`);
  }
  // DELETE 등 빈 응답 처리
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== "") {
      sp.set(key, String(val));
    }
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export function getCustomers(params: {
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
  grade?: string;
  search?: string;
}) {
  return fetchApi<PaginatedResponse<Customer>>(
    `/api/customers${buildQuery(params)}`,
  );
}

export function getCustomer(id: string) {
  return fetchApi<Customer>(`/api/customers/${id}`);
}

export function createCustomer(body: {
  name: string;
  email: string;
  grade?: string;
  joinedAt?: string;
}) {
  return fetchApi<Customer>("/api/customers", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateCustomer(
  id: string,
  body: {
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    grade: string;
  },
) {
  return fetchApi<Customer>(`/api/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteCustomer(id: string) {
  return fetchApi<void>(`/api/customers/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export function getProducts(params: {
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
  category?: string;
  status?: string;
  search?: string;
}) {
  return fetchApi<PaginatedResponse<Product>>(
    `/api/products${buildQuery(params)}`,
  );
}

export function getProduct(id: string) {
  return fetchApi<Product>(`/api/products/${id}`);
}

export function createProduct(body: {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  description: string;
}) {
  return fetchApi<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateProduct(
  id: string,
  body: {
    name: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    image: string;
    description: string;
  },
) {
  return fetchApi<Product>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteProduct(id: string) {
  return fetchApi<void>(`/api/products/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export function getOrders(params: {
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
  status?: string;
  search?: string;
}) {
  return fetchApi<PaginatedResponse<Order>>(
    `/api/orders${buildQuery(params)}`,
  );
}

export function getOrder(id: string) {
  return fetchApi<Order>(`/api/orders/${id}`);
}

export function createOrder(body: {
  customerId: string;
  customerName: string;
  address: string;
  phone: string;
  items: { productId: string; name: string; quantity: number; unitPrice: number }[];
}) {
  return fetchApi<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateOrderStatus(
  id: string,
  body: { status: string; trackingNumber?: string },
) {
  return fetchApi<Order>(`/api/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteOrder(id: string) {
  return fetchApi<void>(`/api/orders/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export function getNotifications(params: {
  page?: number;
  size?: number;
  isRead?: boolean;
}) {
  const raw: Record<string, string | number | boolean | undefined> = {
    page: params.page,
    size: params.size,
  };
  if (params.isRead !== undefined) raw.isRead = params.isRead;
  return fetchApi<PaginatedResponse<Notification>>(
    `/api/notifications${buildQuery(raw)}`,
  );
}

export function getUnreadCount() {
  return fetchApi<UnreadCountResponse>("/api/notifications/unread-count");
}

export function markNotificationAsRead(id: string) {
  return fetchApi<void>(`/api/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsAsRead() {
  return fetchApi<void>("/api/notifications/read-all", { method: "PATCH" });
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface DailySalesRow {
  date: string;
  totalSales: number;
  orderCount: number;
}

export interface BestsellerRow {
  period: string;
  productId: string;
  productName: string;
  salesCount: number;
  rank: number;
}

export interface RegionalSalesRow {
  period: string;
  region: string;
  salesAmount: number;
}

export interface AnalyticsKpiRow {
  period: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  conversionRate: number;
}

export function getDailySales(params: {
  startDate?: string;
  endDate?: string;
}) {
  return fetchApi<DailySalesRow[]>(
    `/api/analytics/daily-sales${buildQuery(params)}`,
  );
}

export function getBestsellers(params: { period?: string }) {
  return fetchApi<BestsellerRow[]>(
    `/api/analytics/bestsellers${buildQuery(params)}`,
  );
}

export function getRegionalSales(params: { period?: string }) {
  return fetchApi<RegionalSalesRow[]>(
    `/api/analytics/regional-sales${buildQuery(params)}`,
  );
}

export function getAnalyticsKpi(params: { period?: string }) {
  return fetchApi<AnalyticsKpiRow>(
    `/api/analytics/kpi${buildQuery(params)}`,
  );
}
