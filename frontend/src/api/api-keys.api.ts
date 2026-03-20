// ─────────────────────────────────────────────────────────────────────────────
// src/api/api-keys.api.ts
import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export interface ApiKey {
  id: string
  name: string
  preview: string
  ipWhitelist?: string
  isSandbox: boolean
  expiresAt?: string
  lastUsedAt?: string
  createdAt: string
}
export interface CreateApiKeyResponse extends ApiKey {
  token: string
}

export const apiKeysApi = {
  list: () => api.get<ApiResponse<ApiKey[]>>('/keys').then((r) => r.data.data!),
  create: (payload: {
    name: string
    ipWhitelist?: string
    isSandbox?: boolean
    expiresAt?: string
  }) =>
    api
      .post<ApiResponse<CreateApiKeyResponse>>('/keys', payload)
      .then((r) => r.data.data!),
  delete: (id: string) =>
    api.delete<ApiResponse>(`/keys/${id}`).then((r) => r.data),
}
