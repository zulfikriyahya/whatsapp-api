// ─────────────────────────────────────────────────────────────────────────────
// src/api/chats.api.ts (inline)
import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export interface Chat {
  id: string
  name?: string
  isGroup: boolean
  isArchived: boolean
  isMuted: boolean
  isPinned: boolean
  unreadCount: number
}
export const chatsApi = {
  list: (sessionId: string) =>
    api
      .get<ApiResponse<Chat[]>>(`/chats/${sessionId}`)
      .then((r) => r.data.data!),
  archive: (sessionId: string, chatId: string, archive: boolean) =>
    api
      .post<ApiResponse>(
        `/chats/${sessionId}/${chatId}/${archive ? 'archive' : 'unarchive'}`
      )
      .then((r) => r.data),
  mute: (sessionId: string, chatId: string, duration: number) =>
    api
      .post<ApiResponse>(`/chats/${sessionId}/${chatId}/mute`, { duration })
      .then((r) => r.data),
  unmute: (sessionId: string, chatId: string) =>
    api
      .post<ApiResponse>(`/chats/${sessionId}/${chatId}/unmute`)
      .then((r) => r.data),
  pin: (sessionId: string, chatId: string, pin: boolean) =>
    api
      .post<ApiResponse>(
        `/chats/${sessionId}/${chatId}/${pin ? 'pin' : 'unpin'}`
      )
      .then((r) => r.data),
  markRead: (sessionId: string, chatId: string) =>
    api
      .post<ApiResponse>(`/chats/${sessionId}/${chatId}/read`)
      .then((r) => r.data),
  delete: (sessionId: string, chatId: string) =>
    api
      .delete<ApiResponse>(`/chats/${sessionId}/${chatId}`)
      .then((r) => r.data),
  search: (sessionId: string, q: string) =>
    api
      .get<ApiResponse<Chat[]>>(`/chats/${sessionId}/search`, { params: { q } })
      .then((r) => r.data.data!),
}
