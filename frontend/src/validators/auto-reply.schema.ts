// ─────────────────────────────────────────────────────────────────────────────
// src/validators/auto-reply.schema.ts
import { z } from 'zod'
export const autoReplySchema = z
  .object({
    keyword: z.string().min(1, 'Keyword wajib diisi'),
    response: z.string().min(1, 'Respon wajib diisi'),
    matchType: z.enum(['exact', 'contains', 'regex', 'ai_smart']),
    priority: z.coerce.number().int().min(0).max(999),
  })
  .superRefine((d, ctx) => {
    if (d.matchType === 'regex') {
      try {
        new RegExp(d.keyword)
      } catch {
        ctx.addIssue({
          code: 'custom',
          path: ['keyword'],
          message: 'Format regex tidak valid',
        })
      }
    }
  })
export type AutoReplyInput = z.infer<typeof autoReplySchema>
