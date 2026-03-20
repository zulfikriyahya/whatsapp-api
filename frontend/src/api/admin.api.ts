import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export interface ImpersonateResponse {
  token: string
  targetUser: { id: string; name: string; email: string }
  expiresIn: number
}

export const adminApi = {
  impersonate: (userId: string) =>
    api
      .post<ApiResponse<ImpersonateResponse>>('/admin/impersonate', { userId })
      .then((r) => r.data.data!),

  endImpersonate: (targetUserId: string) =>
    api
      .delete<ApiResponse>(`/admin/impersonate/${targetUserId}`)
      .then((r) => r.data),
}
