// ─────────────────────────────────────────────────────────────────────────────
// src/validators/message.schema.ts
import { z } from 'zod'
const phoneMin = z.string().min(8, 'Nomor tidak valid')
export const sendTextSchema = z.object({
  to: phoneMin,
  message: z.string().min(1, 'Pesan wajib diisi'),
  sessionId: z.string().optional(),
  quotedMessageId: z.string().optional(),
})
export const sendLocationSchema = z.object({
  to: phoneMin,
  latitude: z.coerce.number().min(-90).max(90, 'Latitude -90 s/d 90'),
  longitude: z.coerce.number().min(-180).max(180, 'Longitude -180 s/d 180'),
  description: z.string().optional(),
  sessionId: z.string().optional(),
})
export const sendLiveLocationSchema = sendLocationSchema.extend({
  duration: z.coerce.number().min(1).max(86400, 'Durasi maks 86400 detik'),
})
export const sendPollSchema = z.object({
  to: phoneMin,
  question: z.string().min(1, 'Pertanyaan wajib diisi'),
  options: z
    .array(z.string().min(1))
    .min(2, 'Min. 2 pilihan')
    .max(12, 'Maks. 12 pilihan'),
  multiselect: z.boolean().default(false),
  sessionId: z.string().optional(),
})
export const sendContactSchema = z.object({
  to: phoneMin,
  contacts: z.array(phoneMin).min(1, 'Min. 1 kontak'),
  sessionId: z.string().optional(),
})
export type SendTextInput = z.infer<typeof sendTextSchema>
export type SendLocationInput = z.infer<typeof sendLocationSchema>
export type SendLiveLocationInput = z.infer<typeof sendLiveLocationSchema>
export type SendPollInput = z.infer<typeof sendPollSchema>
export type SendContactInput = z.infer<typeof sendContactSchema>
