export type NotificationType = "new_order" | "order_status" | "order_cancelled";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId: string;
  isRead: boolean;
  createdAt: string;
}
