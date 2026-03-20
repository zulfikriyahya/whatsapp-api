// ── Send Location Form ────────────────────────────────────────────────────────
// src/components/messages/send-location-form.tsx
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
import { parseApiError } from '@/lib/api-error'
import { normalizePhone } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { SandboxBadge } from './message-status-badge'

const schema = z.object({
  to: z.string().min(8),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  description: z.string().optional(),
  sessionId: z.string().optional(),
})
type F = z.infer<typeof schema>

export function SendLocationForm() {
  const [sandbox, setSandbox] = useState(false)
  const form = useForm<F>({ resolver: zodResolver(schema) })
  const mut = useMutation({
    mutationFn: (d: F) =>
      messagesApi.sendLocation({ ...d, to: normalizePhone(d.to) }),
    onSuccess: (r) => {
      setSandbox(r.sandbox)
      toast.success('Lokasi terkirim')
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
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="-6.2088"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="106.8456"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (opsional)</FormLabel>
              <FormControl>
                <Input placeholder="Nama lokasi..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {sandbox && <SandboxBadge />}
        <Button type="submit" disabled={mut.isPending} className="w-full">
          {mut.isPending ? 'Mengirim...' : 'Kirim Lokasi'}
        </Button>
      </form>
    </Form>
  )
}
