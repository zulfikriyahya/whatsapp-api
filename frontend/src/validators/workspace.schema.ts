// ─────────────────────────────────────────────────────────────────────────────
// src/validators/workspace.schema.ts
import { z } from 'zod'
export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Nama workspace wajib diisi'),
})
export const inviteMemberSchema = z.object({
  email: z.string().email('Email tidak valid'),
})
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
