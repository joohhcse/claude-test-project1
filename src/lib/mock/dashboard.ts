import type { Order } from "@/domain/types/order";

// --- KPI ---
export const kpiData = [
  { label: "총 매출", value: "₩24,500,000", change: "+12.5% 전월 대비", trend: "up" as const },
  { label: "주문 수", value: "384건", change: "-3.2% 전월 대비", trend: "down" as const },
  { label: "신규 고객", value: "48명", change: "+8명 전월 대비", trend: "up" as const },
  { label: "평균 주문액", value: "₩63,800", change: "+5.1% 전월 대비", trend: "up" as const },
];

// --- 월별 매출 차트 (최근 6개월) ---
export const monthlySalesData = [
  { month: "11월", sales: 18200000 },
  { month: "12월", sales: 22800000 },
  { month: "1월", sales: 19500000 },
  { month: "2월", sales: 21000000 },
  { month: "3월", sales: 23100000 },
  { month: "4월", sales: 24500000 },
];

// --- 카테고리별 매출 차트 ---
export const categorySalesData = [
  { category: "의류", sales: 8500000 },
  { category: "전자기기", sales: 6200000 },
  { category: "식품", sales: 4300000 },
  { category: "생활용품", sales: 3100000 },
  { category: "기타", sales: 2400000 },
];

// --- 최근 주문 5건 ---
export const recentOrders: Order[] = [
  {
    id: "ORD-2024-001",
    customerId: "C001",
    customerName: "김민수",
    items: [{ productId: "P001", name: "캐시미어 코트", quantity: 1, unitPrice: 189000 }],
    totalAmount: 189000,
    status: "delivered",
    orderedAt: "2025-05-11T09:30:00Z",
    address: "서울시 강남구 테헤란로 123",
    phone: "010-1234-5678",
    trackingNumber: "CJ1234567890",
  },
  {
    id: "ORD-2024-002",
    customerId: "C002",
    customerName: "이지은",
    items: [{ productId: "P002", name: "무선 이어폰", quantity: 2, unitPrice: 64000 }],
    totalAmount: 128000,
    status: "shipped",
    orderedAt: "2025-05-10T14:20:00Z",
    address: "서울시 서초구 반포대로 45",
    phone: "010-2345-6789",
    trackingNumber: "HJ9876543210",
  },
  {
    id: "ORD-2024-003",
    customerId: "C003",
    customerName: "박서준",
    items: [{ productId: "P003", name: "유기농 올리브유 세트", quantity: 1, unitPrice: 67000 }],
    totalAmount: 67000,
    status: "processing",
    orderedAt: "2025-05-10T11:45:00Z",
    address: "경기도 성남시 분당구 판교로 67",
    phone: "010-3456-7890",
  },
  {
    id: "ORD-2024-004",
    customerId: "C004",
    customerName: "최유리",
    items: [{ productId: "P004", name: "스테인리스 텀블러", quantity: 3, unitPrice: 22000 }],
    totalAmount: 66000,
    status: "pending",
    orderedAt: "2025-05-10T08:15:00Z",
    address: "부산시 해운대구 센텀로 89",
    phone: "010-4567-8901",
  },
  {
    id: "ORD-2024-005",
    customerId: "C005",
    customerName: "정하늘",
    items: [{ productId: "P005", name: "러닝화", quantity: 1, unitPrice: 145000 }],
    totalAmount: 145000,
    status: "cancelled",
    orderedAt: "2025-05-09T16:50:00Z",
    address: "대전시 유성구 대학로 101",
    phone: "010-5678-9012",
  },
];
