import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  User,
  UpdateUserPayload,
  UpdateQuotaPayload,
  UpdateProfilePayload,
} from '@/types/user'

export const usersApi = {
  list: (
    params: {
      page?: number
      limit?: number
      search?: string
      role?: string
      isActive?: boolean
    } = {}
  ) =>
    api.get<PaginatedResponse<User>>('/users', { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`).then((r) => r.data.data!),

  update: (id: string, payload: UpdateUserPayload) =>
    api
      .put<ApiResponse<User>>(`/users/${id}`, payload)
      .then((r) => r.data.data!),

  updateQuota: (id: string, payload: UpdateQuotaPayload) =>
    api
      .put<ApiResponse<User>>(`/users/${id}/quota`, payload)
      .then((r) => r.data.data!),

  updateProfile: (payload: UpdateProfilePayload) =>
    api
      .put<ApiResponse<User>>('/users/profile', payload)
      .then((r) => r.data.data!),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/users/${id}`).then((r) => r.data),

  deleteMe: () => api.delete<ApiResponse>('/users/me').then((r) => r.data),
}
