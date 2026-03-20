// ─────────────────────────────────────────────────────────────────────────────
// src/api/tiers.api.ts
import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Tier } from '@/types/tier'

export interface AssignTierPayload {
  userId: string
  tierId: string
  expiresAt?: string
}

export interface TierHistory {
  id: string
  userId: string
  tierId: string
  tier: Tier
  assignedBy: string
  createdAt: string
}

export const tiersApi = {
  list: () => api.get<ApiResponse<Tier[]>>('/tiers').then((r) => r.data.data!),

  get: (id: string) =>
    api.get<ApiResponse<Tier>>(`/tiers/${id}`).then((r) => r.data.data!),

  create: (payload: Partial<Tier>) =>
    api.post<ApiResponse<Tier>>('/tiers', payload).then((r) => r.data.data!),

  update: (id: string, payload: Partial<Tier>) =>
    api
      .put<ApiResponse<Tier>>(`/tiers/${id}`, payload)
      .then((r) => r.data.data!),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/tiers/${id}`).then((r) => r.data),

  assign: (payload: AssignTierPayload) =>
    api.post<ApiResponse>('/tiers/assign', payload).then((r) => r.data),

  getHistory: (userId: string) =>
    api
      .get<ApiResponse<TierHistory[]>>(`/tiers/history/${userId}`)
      .then((r) => r.data.data!),
}
