export interface ApiResponse<T = unknown> {
  status: boolean
  data?: T
  message?: string
  error?: string
  code?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  status: boolean
  data: T[]
  meta: PaginationMeta
}

export interface PaginationParams {
  page?: number
  limit?: number
}
