// ─────────────────────────────────────────────────────────────────────────────
// src/api/drip.api.ts
import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface DripStep {
  dayOffset: number
  timeAt: string
  message: string
}
export interface DripCampaign {
  id: string
  name: string
  triggerTag: string
  sessionId?: string
  steps: DripStep[]
  isActive: boolean
  subscriberCount: number
  createdAt: string
}
export type SubscriptionStatus = 'active' | 'completed' | 'paused' | 'cancelled'
export interface DripSubscriber {
  id: string
  contactId: string
  contactName?: string
  phoneNumber: string
  status: SubscriptionStatus
  lastStepDay: number
  startedAt: string
}

export const dripApi = {
  list: () =>
    api
      .get<ApiResponse<DripCampaign[]>>('/drip-campaigns')
      .then((r) => r.data.data!),
  create: (
    payload: Omit<
      DripCampaign,
      'id' | 'isActive' | 'subscriberCount' | 'createdAt'
    >
  ) =>
    api
      .post<ApiResponse<DripCampaign>>('/drip-campaigns', payload)
      .then((r) => r.data.data!),
  update: (id: string, payload: Partial<DripCampaign>) =>
    api
      .put<ApiResponse<DripCampaign>>(`/drip-campaigns/${id}`, payload)
      .then((r) => r.data.data!),
  delete: (id: string) =>
    api.delete<ApiResponse>(`/drip-campaigns/${id}`).then((r) => r.data),
  toggle: (id: string) =>
    api
      .post<ApiResponse<DripCampaign>>(`/drip-campaigns/${id}/toggle`)
      .then((r) => r.data.data!),
  getSubscribers: (id: string, status?: SubscriptionStatus, page = 1) =>
    api
      .get<PaginatedResponse<DripSubscriber>>(
        `/drip-campaigns/${id}/subscribers`,
        {
          params: { page, ...(status ? { status } : {}) },
        }
      )
      .then((r) => r.data),
  cancelSubscription: (subscriptionId: string) =>
    api
      .post<ApiResponse>(
        `/drip-campaigns/subscriptions/${subscriptionId}/cancel`
      )
      .then((r) => r.data),
}
