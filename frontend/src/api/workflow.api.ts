// ─────────────────────────────────────────────────────────────────────────────
// src/api/workflow.api.ts
import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export type NodeType = 'send_message' | 'delay' | 'add_tag'
export interface WorkflowNode {
  type: NodeType
  config: Record<string, unknown>
}
export interface Workflow {
  id: string
  name: string
  triggerKeyword: string
  matchType: 'exact' | 'contains' | 'regex'
  nodes: WorkflowNode[]
  isActive: boolean
  executionCount: number
  createdAt: string
}

export const workflowApi = {
  list: () =>
    api.get<ApiResponse<Workflow[]>>('/workflows').then((r) => r.data.data!),
  create: (
    payload: Omit<Workflow, 'id' | 'isActive' | 'executionCount' | 'createdAt'>
  ) =>
    api
      .post<ApiResponse<Workflow>>('/workflows', payload)
      .then((r) => r.data.data!),
  update: (id: string, payload: Partial<Workflow>) =>
    api
      .put<ApiResponse<Workflow>>(`/workflows/${id}`, payload)
      .then((r) => r.data.data!),
  delete: (id: string) =>
    api.delete<ApiResponse>(`/workflows/${id}`).then((r) => r.data),
  toggle: (id: string) =>
    api
      .post<ApiResponse<Workflow>>(`/workflows/${id}/toggle`)
      .then((r) => r.data.data!),
}
