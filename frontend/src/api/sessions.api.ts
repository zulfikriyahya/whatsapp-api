import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type {
  Session,
  CreateSessionPayload,
  SessionInfo,
} from '@/types/session'

export const sessionsApi = {
  list: () =>
    api.get<ApiResponse<Session[]>>('/sessions').then((r) => r.data.data!),

  create: (payload: CreateSessionPayload) =>
    api
      .post<ApiResponse<Session>>('/sessions', payload)
      .then((r) => r.data.data!),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/sessions/${id}`).then((r) => r.data),

  reconnect: (id: string) =>
    api.post<ApiResponse>(`/sessions/${id}/reconnect`).then((r) => r.data),

  setDefault: (id: string) =>
    api
      .post<ApiResponse<Session>>(`/sessions/${id}/default`)
      .then((r) => r.data.data!),

  getInfo: (id: string) =>
    api
      .get<ApiResponse<SessionInfo>>(`/sessions/${id}/info`)
      .then((r) => r.data.data!),
}
