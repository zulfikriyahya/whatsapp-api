// ─────────────────────────────────────────────────────────────────────────────
// src/validators/settings.schema.ts
import { z } from 'zod'
export const userSettingsSchema = z.object({
  geminiApiKey: z.string().optional(),
  confidenceThreshold: z.coerce.number().min(0).max(1).optional(),
  autoDownloadPhoto: z.boolean().optional(),
  autoDownloadVideo: z.boolean().optional(),
  autoDownloadAudio: z.boolean().optional(),
  autoDownloadDocument: z.boolean().optional(),
})
export type UserSettingsInput = z.infer<typeof userSettingsSchema>
