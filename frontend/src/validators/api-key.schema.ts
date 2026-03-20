// ─────────────────────────────────────────────────────────────────────────────
// src/validators/api-key.schema.ts
import { z } from 'zod'
export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  ipWhitelist: z.string().optional(),
  isSandbox: z.boolean().default(false),
  expiresAt: z.string().optional(),
})
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>
