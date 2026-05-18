import type { Customer } from "@/domain/types/customer";

export const mockCustomers: Customer[] = [
  { id: "C001", name: "김민수", email: "minsu@example.com", totalOrders: 12, totalSpent: 1850000, grade: "vip", joinedAt: "2024-03-15" },
  { id: "C002", name: "이지은", email: "jieun@example.com", totalOrders: 8, totalSpent: 920000, grade: "vip", joinedAt: "2024-05-20" },
  { id: "C003", name: "박서준", email: "seojun@example.com", totalOrders: 5, totalSpent: 480000, grade: "normal", joinedAt: "2024-07-10" },
  { id: "C004", name: "최유리", email: "yuri@example.com", totalOrders: 3, totalSpent: 210000, grade: "normal", joinedAt: "2024-09-01" },
  { id: "C005", name: "정하늘", email: "haneul@example.com", totalOrders: 7, totalSpent: 780000, grade: "normal", joinedAt: "2024-06-18" },
  { id: "C006", name: "한소희", email: "sohee@example.com", totalOrders: 15, totalSpent: 2340000, grade: "vvip", joinedAt: "2024-01-05" },
  { id: "C007", name: "윤도현", email: "dohyun@example.com", totalOrders: 6, totalSpent: 530000, grade: "normal", joinedAt: "2024-08-22" },
  { id: "C008", name: "강다니엘", email: "daniel@example.com", totalOrders: 10, totalSpent: 1450000, grade: "vip", joinedAt: "2024-04-12" },
  { id: "C009", name: "송지효", email: "jihyo@example.com", totalOrders: 4, totalSpent: 350000, grade: "normal", joinedAt: "2024-10-30" },
  { id: "C010", name: "유재석", email: "jaeseok@example.com", totalOrders: 20, totalSpent: 3200000, grade: "vvip", joinedAt: "2023-12-01" },
  { id: "C011", name: "김태리", email: "taeri@example.com", totalOrders: 2, totalSpent: 150000, grade: "normal", joinedAt: "2025-01-15" },
  { id: "C012", name: "이도현", email: "dohyun2@example.com", totalOrders: 1, totalSpent: 65000, grade: "normal", joinedAt: "2025-04-20" },
  { id: "C013", name: "전지현", email: "jihyun@example.com", totalOrders: 18, totalSpent: 2890000, grade: "vvip", joinedAt: "2023-11-10" },
  { id: "C014", name: "공유", email: "gong@example.com", totalOrders: 9, totalSpent: 1120000, grade: "vip", joinedAt: "2024-02-28" },
  { id: "C015", name: "수지", email: "suzy@example.com", totalOrders: 1, totalSpent: 42000, grade: "normal", joinedAt: "2025-05-01" },
];
