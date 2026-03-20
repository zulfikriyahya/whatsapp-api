import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface Contact {
  id: string
  name: string
  phoneNumber: string
  tags: string[]
  note?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ContactFilter {
  search?: string
  tag?: string
  page?: number
  limit?: number
}

export interface CreateContactPayload {
  name: string
  phoneNumber: string
  tags?: string[]
}

export interface ImportResult {
  imported: number
  skipped: number
  errors: string[]
}

export const contactsApi = {
  list: ({ page = 1, limit = 20, search, tag }: ContactFilter = {}) =>
    api
      .get<PaginatedResponse<Contact>>('/contacts', {
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(tag ? { tag } : {}),
        },
      })
      .then((r) => r.data),

  create: (payload: CreateContactPayload) =>
    api
      .post<ApiResponse<Contact>>('/contacts', payload)
      .then((r) => r.data.data!),

  update: (id: string, payload: Partial<CreateContactPayload>) =>
    api
      .put<ApiResponse<Contact>>(`/contacts/${id}`, payload)
      .then((r) => r.data.data!),

  delete: (id: string) =>
    api.delete<ApiResponse>(`/contacts/${id}`).then((r) => r.data),

  bulkDelete: (ids: string[]) =>
    api.post<ApiResponse>('/contacts/bulk-delete', { ids }).then((r) => r.data),

  importCsv: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api
      .post<ApiResponse<ImportResult>>('/contacts/import', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data!)
  },

  importGoogle: (accessToken: string) =>
    api
      .post<
        ApiResponse<ImportResult>
      >('/contacts/import-google', { accessToken })
      .then((r) => r.data.data!),

  exportCsv: () =>
    api.get('/contacts/export', { responseType: 'blob' }).then((r) => r.data),

  getNote: (contactId: string) =>
    api
      .get<ApiResponse<{ note: string }>>(`/contacts/${contactId}/note`)
      .then((r) => r.data.data!),

  upsertNote: (contactId: string, note: string) =>
    api
      .put<ApiResponse>(`/contacts/${contactId}/note`, { note })
      .then((r) => r.data),

  deleteNote: (contactId: string) =>
    api.delete<ApiResponse>(`/contacts/${contactId}/note`).then((r) => r.data),
}
