export type CustomerGrade = "normal" | "vip" | "vvip";

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  grade: CustomerGrade;
  joinedAt: string;
}
