// ── Profile API (inline) ──────────────────────────────────────────────────────
// src/api/profile.api.ts
import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export interface WaProfile {
  pushname?: string
  phoneNumber?: string
  platform?: string
  profilePictureUrl?: string
  about?: string
}
export const profileApi = {
  get: (sessionId: string) =>
    api
      .get<ApiResponse<WaProfile>>(`/profile/${sessionId}`)
      .then((r) => r.data.data!),
  setDisplayName: (sessionId: string, name: string) =>
    api
      .post<ApiResponse>(`/profile/${sessionId}/display-name`, { name })
      .then((r) => r.data),
  setStatus: (sessionId: string, status: string) =>
    api
      .post<ApiResponse>(`/profile/${sessionId}/status`, { status })
      .then((r) => r.data),
  uploadPhoto: (sessionId: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api
      .post<ApiResponse>(`/profile/${sessionId}/photo`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },
  deletePhoto: (sessionId: string) =>
    api.delete<ApiResponse>(`/profile/${sessionId}/photo`).then((r) => r.data),
}
