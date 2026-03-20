// ─────────────────────────────────────────────────────────────────────────────
// src/api/workspace.api.ts
import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export interface Workspace {
  id: string
  name: string
  ownerId: string
  memberCount: number
  createdAt: string
}
export interface WorkspaceMember {
  id: string
  userId: string
  name: string
  email: string
  role: string
  joinedAt: string
  permissions?: string[]
}

export const workspaceApi = {
  list: () =>
    api.get<ApiResponse<Workspace[]>>('/workspaces').then((r) => r.data.data!),
  create: (name: string) =>
    api
      .post<ApiResponse<Workspace>>('/workspaces', { name })
      .then((r) => r.data.data!),
  getMembers: (id: string) =>
    api
      .get<ApiResponse<WorkspaceMember[]>>(`/workspaces/${id}/members`)
      .then((r) => r.data.data!),
  invite: (id: string, email: string) =>
    api
      .post<ApiResponse>(`/workspaces/${id}/invite`, { email })
      .then((r) => r.data),
  updatePermission: (
    id: string,
    memberId: string,
    payload: { role?: string; permissions?: string[] }
  ) =>
    api
      .put<ApiResponse>(
        `/workspaces/${id}/members/${memberId}/permission`,
        payload
      )
      .then((r) => r.data),
  removeMember: (id: string, memberId: string) =>
    api
      .delete<ApiResponse>(`/workspaces/${id}/members/${memberId}`)
      .then((r) => r.data),
}
