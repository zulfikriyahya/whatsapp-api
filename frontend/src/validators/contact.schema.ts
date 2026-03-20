// ─────────────────────────────────────────────────────────────────────────────
// src/validators/contact.schema.ts
import { z } from 'zod'
export const contactSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  phoneNumber: z.string().min(8, 'Nomor tidak valid'),
  tags: z.string().optional(), // comma-separated
})
export type ContactInput = z.infer<typeof contactSchema>
