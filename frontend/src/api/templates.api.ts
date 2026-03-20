// ─────────────────────────────────────────────────────────────────────────────
// src/api/templates.api.ts
import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export interface Template {
  id: string
  name: string
  content: string
  category: string
  userId: string
  createdAt: string
}

export const templatesApi = {
  list: (search?: string, category?: string) =>
    api
      .get<ApiResponse<Template[]>>('/templates', {
        params: {
          ...(search ? { search } : {}),
          ...(category ? { category } : {}),
        },
      })
      .then((r) => r.data.data!),
  create: (payload: Pick<Template, 'name' | 'content' | 'category'>) =>
    api
      .post<ApiResponse<Template>>('/templates', payload)
      .then((r) => r.data.data!),
  update: (
    id: string,
    payload: Partial<Pick<Template, 'name' | 'content' | 'category'>>
  ) =>
    api
      .put<ApiResponse<Template>>(`/templates/${id}`, payload)
      .then((r) => r.data.data!),
  delete: (id: string) =>
    api.delete<ApiResponse>(`/templates/${id}`).then((r) => r.data),
}
