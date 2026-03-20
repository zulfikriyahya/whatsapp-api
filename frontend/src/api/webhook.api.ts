// ─────────────────────────────────────────────────────────────────────────────
// src/api/webhook.api.ts
import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export interface WebhookConfig {
  url?: string
  isActive: boolean
  secret?: string
}
export interface WebhookTestResult {
  targetStatus: number
  responseTime: number
}

export const webhookApi = {
  getConfig: () =>
    api
      .get<ApiResponse<WebhookConfig>>('/webhooks/config')
      .then((r) => r.data.data!),
  updateConfig: (payload: Partial<WebhookConfig>) =>
    api
      .put<ApiResponse<WebhookConfig>>('/webhooks/config', payload)
      .then((r) => r.data.data!),
  generateSecret: () =>
    api
      .post<ApiResponse<{ secret: string }>>('/webhooks/generate-secret')
      .then((r) => r.data.data!),
  test: () =>
    api
      .post<ApiResponse<WebhookTestResult>>('/webhooks/test')
      .then((r) => r.data.data!),
}
