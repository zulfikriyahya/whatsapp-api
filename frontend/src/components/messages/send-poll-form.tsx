// ── Send Poll Form ────────────────────────────────────────────────────────────
// src/components/messages/send-poll-form.tsx
'use client'
import { messagesApi } from '@/api/messages.api'
import { PhoneInput } from '@/components/common/phone-input'
import { SessionSelector } from '@/components/common/session-selector'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { parseApiError } from '@/lib/api-error'
import { normalizePhone } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { SandboxBadge } from './message-status-badge'

const schema = z.object({
  to: z.string().min(8),
  question: z.string().min(1, 'Pertanyaan wajib diisi'),
  options: z
    .array(z.object({ value: z.string().min(1) }))
    .min(2, 'Minimal 2 pilihan'),
  multiselect: z.boolean().default(false),
  sessionId: z.string().optional(),
})
type F = z.infer<typeof schema>

export function SendPollForm() {
  const [sandbox, setSandbox] = useState(false)
  const form = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      to: '',
      question: '',
      options: [{ value: '' }, { value: '' }],
      multiselect: false,
    },
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  const mut = useMutation({
    mutationFn: (d: F) =>
      messagesApi.sendPoll({
        ...d,
        to: normalizePhone(d.to),
        options: d.options.map((o) => o.value),
      }),
    onSuccess: (r) => {
      setSandbox(r.sandbox)
      toast.success('Poll terkirim')
      form.reset()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) => mut.mutate(d))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Tujuan</FormLabel>
              <FormControl>
                <PhoneInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sessionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sesi</FormLabel>
              <FormControl>
                <SessionSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pertanyaan</FormLabel>
              <FormControl>
                <Input placeholder="Pilih menu favorit Anda?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Pilihan</Label>
          {fields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`options.${i}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder={`Pilihan ${i + 1}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.length > 2 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => remove(i)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
          {fields.length < 12 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: '' })}
            >
              <Plus className="mr-1 h-3 w-3" /> Tambah Pilihan
            </Button>
          )}
        </div>
        <FormField
          control={form.control}
          name="multiselect"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <Label>Boleh pilih lebih dari satu</Label>
            </FormItem>
          )}
        />
        {sandbox && <SandboxBadge />}
        <Button type="submit" disabled={mut.isPending} className="w-full">
          {mut.isPending ? 'Mengirim...' : 'Kirim Poll'}
        </Button>
      </form>
    </Form>
  )
}
