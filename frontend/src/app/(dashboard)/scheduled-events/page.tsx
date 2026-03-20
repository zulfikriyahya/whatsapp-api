// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/scheduled-events/page.tsx
'use client'
import { PageHeader } from '@/components/common/page-header'
import { SessionSelector } from '@/components/common/session-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { parseApiError } from '@/lib/api-error'
import api from '@/lib/axios'
import { normalizePhone } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const sendSchema = z.object({
  to: z.string().min(8),
  title: z.string().min(1, 'Judul wajib diisi'),
  startTime: z.string().min(1, 'Waktu mulai wajib diisi'),
  description: z.string().optional(),
  location: z.string().optional(),
  sessionId: z.string().min(1, 'Pilih sesi'),
})
const respondSchema = z.object({
  messageId: z.string().min(1, 'Message ID wajib diisi'),
  response: z.enum(['accept', 'decline']),
  sessionId: z.string().min(1, 'Pilih sesi'),
})
type SendForm = z.infer<typeof sendSchema>
type RespondForm = z.infer<typeof respondSchema>

export default function ScheduledEventsPage() {
  const sendForm = useForm<SendForm>({ resolver: zodResolver(sendSchema) })
  const respondForm = useForm<RespondForm>({
    resolver: zodResolver(respondSchema),
    defaultValues: { response: 'accept' },
  })

  const sendMut = useMutation({
    mutationFn: (d: SendForm) =>
      api.post('/scheduled-events/send', { ...d, to: normalizePhone(d.to) }),
    onSuccess: () => {
      toast.success('Event terkirim')
      sendForm.reset()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const respondMut = useMutation({
    mutationFn: (d: RespondForm) => api.post('/scheduled-events/respond', d),
    onSuccess: () => {
      toast.success('Respons terkirim')
      respondForm.reset()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Scheduled Event"
        description="Kirim dan respons undangan event WhatsApp"
      />
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="send">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="send" className="flex-1">
                Kirim Event
              </TabsTrigger>
              <TabsTrigger value="respond" className="flex-1">
                Respons Event
              </TabsTrigger>
            </TabsList>
            <TabsContent value="send">
              <Form {...sendForm}>
                <form
                  onSubmit={sendForm.handleSubmit((d) => sendMut.mutate(d))}
                  className="space-y-4"
                >
                  <FormField
                    control={sendForm.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Tujuan</FormLabel>
                        <FormControl>
                          <Input placeholder="628xxxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={sendForm.control}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={sendForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Event</FormLabel>
                        <FormControl>
                          <Input placeholder="Rapat Tim Q2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={sendForm.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Waktu Mulai</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={sendForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi (opsional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={sendForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasi (opsional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Zoom / Kantor Jakarta"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={sendMut.isPending}
                  >
                    {sendMut.isPending ? 'Mengirim...' : 'Kirim Event'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="respond">
              <Form {...respondForm}>
                <form
                  onSubmit={respondForm.handleSubmit((d) =>
                    respondMut.mutate(d)
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={respondForm.control}
                    name="messageId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message ID</FormLabel>
                        <FormControl>
                          <Input placeholder="ID pesan undangan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={respondForm.control}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={respondForm.control}
                    name="response"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Respons</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="accept">Terima</SelectItem>
                            <SelectItem value="decline">Tolak</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={respondMut.isPending}
                  >
                    {respondMut.isPending ? 'Mengirim...' : 'Kirim Respons'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
