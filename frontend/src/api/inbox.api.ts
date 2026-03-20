import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { InboxMessage, Conversation, ReplyPayload } from '@/types/inbox'

export const inboxApi = {
  getConversations: (unreadOnly?: boolean) =>
    api
      .get<ApiResponse<Conversation[]>>('/inbox/conversations', {
        params: unreadOnly ? { unreadOnly: true } : undefined,
      })
      .then((r) => r.data.data!),

  getMessages: (jid: string, page = 1, limit = 30) =>
    api
      .get<PaginatedResponse<InboxMessage>>('/inbox', {
        params: { jid, page, limit },
      })
      .then((r) => r.data),

  markRead: (id: string) =>
    api.patch<ApiResponse>(`/inbox/${id}/read`).then((r) => r.data),

  markAllRead: (jid: string) =>
    api
      .patch<ApiResponse>(`/inbox/conversations/${jid}/read-all`)
      .then((r) => r.data),

  reply: (id: string, payload: ReplyPayload) =>
    api.post<ApiResponse>(`/inbox/${id}/reply`, payload).then((r) => r.data),
}
