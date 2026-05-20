/** Spring Boot paginated response */
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/** GET /api/notifications/unread-count */
export interface UnreadCountResponse {
  count: number;
}
