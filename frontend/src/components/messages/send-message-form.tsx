'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { messagesApi } from '@/api/messages.api'
import { parseApiError } from '@/lib/api-error'
import { normalizePhone } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { SessionSelector } from '@/components/common/session-selector'
import { SandboxBadge } from './message-status-badge'

const schema = z.object({
  to: z.string().min(8, 'Nomor tidak valid'),
  message: z.string().min(1, 'Pesan wajib diisi'),
  sessionId: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export function SendMessageForm() {
  const [sandbox, setSandbox] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { to: '', message: '', sessionId: 'auto' },
  })

  const mut = useMutation({
    mutationFn: (d: FormData) =>
      messagesApi.send({ ...d, to: normalizePhone(d.to) }),
    onSuccess: (res) => {
      setSandbox(res.sandbox)
      toast.success('Pesan berhasil dikirim')
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
                <Input placeholder="628xxxxxxxx" inputMode="tel" {...field} />
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
              <FormLabel>Sesi WhatsApp</FormLabel>
              <FormControl>
                <SessionSelector
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Auto (round-robin)"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesan</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Tulis pesan..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {sandbox && <SandboxBadge />}
        <Button type="submit" disabled={mut.isPending} className="w-full">
          {mut.isPending ? 'Mengirim...' : 'Kirim Pesan'}
        </Button>
      </form>
    </Form>
  )
}
