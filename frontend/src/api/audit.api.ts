// ─────────────────────────────────────────────────────────────────────────────
// src/api/audit.api.ts
import api from '@/lib/axios'
import type { PaginatedResponse } from '@/types/api'

export interface AuditLog {
  id: string
  userId: string
  email: string
  action: string
  ip?: string
  detail?: Record<string, unknown>
  createdAt: string
}

export interface AuditFilter {
  action?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export const auditApi = {
  list: ({ page = 1, limit = 20, action, from, to }: AuditFilter = {}) =>
    api
      .get<PaginatedResponse<AuditLog>>('/audit', {
        params: {
          page,
          limit,
          ...(action ? { action } : {}),
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        },
      })
      .then((r) => r.data),

  exportPdf: () =>
    api.get('/audit/export-pdf', { responseType: 'blob' }).then((r) => r.data),
}
