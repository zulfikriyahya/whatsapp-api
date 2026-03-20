import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Campaign, CreateBroadcastPayload } from '@/types/broadcast'

export const broadcastApi = {
  list: (page = 1, limit = 20, status?: string) =>
    api
      .get<PaginatedResponse<Campaign>>('/broadcast', {
        params: { page, limit, ...(status ? { status } : {}) },
      })
      .then((r) => r.data),

  get: (id: string) =>
    api
      .get<ApiResponse<Campaign>>(`/broadcast/${id}`)
      .then((r) => r.data.data!),

  create: (payload: CreateBroadcastPayload) => {
    const fd = new FormData()
    fd.append('name', payload.name)
    fd.append('message', payload.message)
    if (payload.sessionId) fd.append('sessionId', payload.sessionId)
    if (payload.recipients?.length)
      fd.append('recipients', JSON.stringify(payload.recipients))
    if (payload.tags?.length) fd.append('tags', JSON.stringify(payload.tags))
    if (payload.attachment) fd.append('attachment', payload.attachment)
    return api
      .post<ApiResponse<Campaign>>('/broadcast', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data!)
  },

  cancel: (id: string) =>
    api
      .post<ApiResponse>(`/broadcast/campaigns/${id}/cancel`)
      .then((r) => r.data),

  exportPdf: (id: string) =>
    api
      .get(`/broadcast/campaigns/${id}/export-pdf`, { responseType: 'blob' })
      .then((r) => r.data),
}
