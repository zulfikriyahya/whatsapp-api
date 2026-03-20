// ─────────────────────────────────────────────────────────────────────────────
// src/validators/broadcast.schema.ts
import { z } from 'zod'
export const createBroadcastSchema = z.object({
  name: z.string().min(1, 'Nama campaign wajib diisi'),
  message: z.string().min(1, 'Pesan wajib diisi'),
  sessionId: z.string().optional(),
  manualNumbers: z.string().optional(),
  tags: z.string().optional(),
})
export type CreateBroadcastInput = z.infer<typeof createBroadcastSchema>
