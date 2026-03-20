// src/api/settings.api.ts
import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export interface UserSettings {
  geminiApiKey?: string
  confidenceThreshold?: number
  autoDownloadPhoto?: boolean
  autoDownloadVideo?: boolean
  autoDownloadAudio?: boolean
  autoDownloadDocument?: boolean
}

export interface GlobalSettings {
  defaultDailyMessageLimit: number
  defaultMonthlyBroadcastLimit: number
  maintenanceMode: boolean
}

export const settingsApi = {
  getMe: () =>
    api
      .get<ApiResponse<UserSettings>>('/settings/me')
      .then((r) => r.data.data!),

  updateMe: (payload: Partial<UserSettings>) =>
    api
      .post<ApiResponse<UserSettings>>('/settings/me', payload)
      .then((r) => r.data.data!),

  getGlobal: () =>
    api
      .get<ApiResponse<GlobalSettings>>('/settings/global')
      .then((r) => r.data.data!),

  updateGlobal: (payload: Partial<GlobalSettings>) =>
    api
      .post<ApiResponse<GlobalSettings>>('/settings/global', payload)
      .then((r) => r.data.data!),

  setMaintenance: (enabled: boolean) =>
    api
      .post<ApiResponse>('/settings/maintenance', { enabled })
      .then((r) => r.data),

  sendAnnouncement: (message: string) =>
    api
      .post<ApiResponse>('/settings/announcement', { message })
      .then((r) => r.data),
}
