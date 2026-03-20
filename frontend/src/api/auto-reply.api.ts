// src/api/auto-reply.api.ts
import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export type MatchType = 'exact' | 'contains' | 'regex' | 'ai_smart'

export interface AutoReplyRule {
  id: string
  keyword: string
  response: string
  matchType: MatchType
  priority: number
  isActive: boolean
  createdAt: string
}

export const autoReplyApi = {
  list: () =>
    api
      .get<ApiResponse<AutoReplyRule[]>>('/auto-reply')
      .then((r) => r.data.data!),
  create: (payload: Omit<AutoReplyRule, 'id' | 'isActive' | 'createdAt'>) =>
    api
      .post<ApiResponse<AutoReplyRule>>('/auto-reply', payload)
      .then((r) => r.data.data!),
  update: (id: string, payload: Partial<AutoReplyRule>) =>
    api
      .put<ApiResponse<AutoReplyRule>>(`/auto-reply/${id}`, payload)
      .then((r) => r.data.data!),
  delete: (id: string) =>
    api.delete<ApiResponse>(`/auto-reply/${id}`).then((r) => r.data),
  toggle: (id: string) =>
    api
      .post<ApiResponse<AutoReplyRule>>(`/auto-reply/${id}/toggle`)
      .then((r) => r.data.data!),
}
