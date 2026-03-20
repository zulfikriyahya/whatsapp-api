// ─────────────────────────────────────────────────────────────────────────────
// src/api/scheduler.api.ts
import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export type ScheduledStatus = 'pending' | 'sent' | 'failed' | 'cancelled'
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly'
export interface Scheduled {
  id: string
  to: string
  message: string
  sessionId: string
  scheduledTime: string
  recurrenceType: RecurrenceType
  status: ScheduledStatus
  createdAt: string
}

export const schedulerApi = {
  list: (
    params: { status?: ScheduledStatus; page?: number; limit?: number } = {}
  ) =>
    api
      .get<PaginatedResponse<Scheduled>>('/scheduler', { params })
      .then((r) => r.data),
  create: (payload: Omit<Scheduled, 'id' | 'status' | 'createdAt'>) =>
    api
      .post<ApiResponse<Scheduled>>('/scheduler', payload)
      .then((r) => r.data.data!),
  cancel: (id: string) =>
    api.post<ApiResponse>(`/scheduler/${id}/cancel`).then((r) => r.data),
  delete: (id: string) =>
    api.delete<ApiResponse>(`/scheduler/${id}`).then((r) => r.data),
}
