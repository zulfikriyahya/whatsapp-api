// ─────────────────────────────────────────────────────────────────────────────
// src/api/calls.api.ts (tambahan)
import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
export interface CallLog {
  id: string
  from: string
  sessionId: string
  type: 'voice' | 'video'
  status: 'missed' | 'received'
  timestamp: string
}
export const callsApi = {
  list: (page = 1) =>
    api
      .get<PaginatedResponse<CallLog>>('/calls', { params: { page } })
      .then((r) => r.data),
  createLink: (sessionId: string) =>
    api
      .post<ApiResponse<{ link: string }>>('/calls/link', { sessionId })
      .then((r) => r.data.data!),
}
