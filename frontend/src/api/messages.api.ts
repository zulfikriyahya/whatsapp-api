import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  MessageLog,
  SendMessagePayload,
  SendMediaPayload,
  SendLocationPayload,
  SendLiveLocationPayload,
  SendPollPayload,
  SendContactPayload,
  SendVoiceNotePayload,
  SendMessageResponse,
  CheckNumberResponse,
  MessageLogsFilter,
} from '@/types/message'

export const messagesApi = {
  send: (payload: SendMessagePayload) =>
    api
      .post<ApiResponse<SendMessageResponse>>('/messages/send', payload)
      .then((r) => r.data.data!),

  sendMedia: (payload: SendMediaPayload) => {
    const fd = new FormData()
    fd.append('file', payload.file)
    fd.append('to', payload.to)
    if (payload.caption) fd.append('caption', payload.caption)
    if (payload.sessionId) fd.append('sessionId', payload.sessionId)
    return api
      .post<ApiResponse<SendMessageResponse>>('/messages/send-media', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data!)
  },

  sendLocation: (payload: SendLocationPayload) =>
    api
      .post<
        ApiResponse<SendMessageResponse>
      >('/messages/send-location', payload)
      .then((r) => r.data.data!),

  sendLiveLocation: (payload: SendLiveLocationPayload) =>
    api
      .post<
        ApiResponse<SendMessageResponse>
      >('/messages/send-live-location', payload)
      .then((r) => r.data.data!),

  sendPoll: (payload: SendPollPayload) =>
    api
      .post<ApiResponse<SendMessageResponse>>('/messages/send-poll', payload)
      .then((r) => r.data.data!),

  sendContact: (payload: SendContactPayload) =>
    api
      .post<ApiResponse<SendMessageResponse>>('/messages/send-contact', payload)
      .then((r) => r.data.data!),

  sendVoiceNote: (payload: SendVoiceNotePayload) => {
    const fd = new FormData()
    fd.append('file', payload.file)
    fd.append('to', payload.to)
    if (payload.sessionId) fd.append('sessionId', payload.sessionId)
    return api
      .post<ApiResponse<SendMessageResponse>>('/messages/send-voice-note', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data!)
  },

  getLogs: (filter: MessageLogsFilter = {}) => {
    const { page = 1, limit = 20, ...params } = filter
    return api
      .get<PaginatedResponse<MessageLog>>('/messages/logs', {
        params: { page, limit, ...params },
      })
      .then((r) => r.data)
  },

  exportPdf: () =>
    api
      .get('/messages/logs/export-pdf', { responseType: 'blob' })
      .then((r) => r.data),

  checkNumber: (sessionId: string, phone: string) =>
    api
      .get<
        ApiResponse<CheckNumberResponse>
      >(`/messages/check/${sessionId}/${phone}`)
      .then((r) => r.data.data!),
}
