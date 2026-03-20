// ─────────────────────────────────────────────────────────────────────────────
// src/validators/scheduler.schema.ts
import { z } from 'zod'
export const createSchedulerSchema = z.object({
  to: z.string().min(8, 'Nomor tidak valid'),
  message: z.string().min(1, 'Pesan wajib diisi'),
  sessionId: z.string().min(1, 'Pilih sesi'),
  scheduledTime: z.string().refine((v) => new Date(v) > new Date(), {
    message: 'Waktu harus di masa depan',
  }),
  recurrenceType: z
    .enum(['none', 'daily', 'weekly', 'monthly'])
    .default('none'),
})
export type CreateSchedulerInput = z.infer<typeof createSchedulerSchema>
