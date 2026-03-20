// src/validators/auth.schema.ts
import { z } from 'zod'
export const twoFaSchema = z.object({
  code: z.string().length(6, 'Kode harus 6 digit'),
})
export const backupCodeSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{5}-[A-Z0-9]{5}$/, 'Format: XXXXX-XXXXX'),
})
export type TwoFaInput = z.infer<typeof twoFaSchema>
export type BackupCodeInput = z.infer<typeof backupCodeSchema>
