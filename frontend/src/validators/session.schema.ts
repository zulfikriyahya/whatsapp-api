// ─────────────────────────────────────────────────────────────────────────────
// src/validators/session.schema.ts
import { z } from 'zod'
export const createSessionSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi').max(64),
    usePairingCode: z.boolean().default(false),
    phoneNumber: z.string().optional(),
  })
  .refine((d) => !d.usePairingCode || !!d.phoneNumber, {
    message: 'Nomor wajib diisi saat pairing code aktif',
    path: ['phoneNumber'],
  })
export type CreateSessionInput = z.infer<typeof createSessionSchema>
