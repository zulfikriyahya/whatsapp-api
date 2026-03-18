export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  status: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  meta?: PaginationMeta;
}
