// ─────────────────────────────────────────────────────────────────────────────
// src/components/broadcast/create-broadcast-dialog.tsx
'use client'
import { broadcastApi } from '@/api/broadcast.api'
import { SessionSelector } from '@/components/common/session-selector'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { normalizePhone } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import Papa from 'papaparse'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  message: z.string().min(1, 'Pesan wajib diisi'),
  sessionId: z.string().optional(),
  manualNumbers: z.string().optional(),
  tags: z.string().optional(),
})
type F = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
}
export function CreateBroadcastDialog({ open, onClose }: Props) {
  const qc = useQueryClient()
  const [csvRecipients, setCsvRecipients] = useState<string[]>([])
  const [csvPreview, setCsvPreview] = useState<
    { name?: string; number: string }[]
  >([])
  const csvRef = useRef<HTMLInputElement>(null)

  const form = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      message: '',
      sessionId: 'auto',
      manualNumbers: '',
      tags: '',
    },
  })

  const parseCsv = (file: File) => {
    Papa.parse<{ name?: string; number: string }>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = res.data
        setCsvPreview(rows.slice(0, 5))
        setCsvRecipients(
          rows.map((r) => normalizePhone(r.number ?? '')).filter(Boolean)
        )
        toast.success(`${rows.length} kontak berhasil diparsing`)
      },
      error: () => toast.error('Gagal membaca file CSV'),
    })
  }

  const mut = useMutation({
    mutationFn: (d: F) => {
      const manual = d.manualNumbers
        ? d.manualNumbers
            .split(/[\n,]/)
            .map((n) => normalizePhone(n.trim()))
            .filter(Boolean)
        : []
      const tags = d.tags
        ? d.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined
      const recipients = [...manual, ...csvRecipients]
      if (!recipients.length && !tags?.length)
        throw new Error('Minimal satu penerima diperlukan')
      return broadcastApi.create({
        name: d.name,
        message: d.message,
        sessionId: d.sessionId,
        recipients,
        tags,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.CAMPAIGNS })
      toast.success('Broadcast berhasil dibuat')
      onClose()
      form.reset()
      setCsvRecipients([])
      setCsvPreview([])
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Broadcast</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((d) => mut.mutate(d))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Campaign</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesan</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="mb-2 text-sm font-medium">Penerima</p>
              <Tabs defaultValue="manual">
                <TabsList className="w-full">
                  <TabsTrigger value="manual" className="flex-1">
                    Manual
                  </TabsTrigger>
                  <TabsTrigger value="csv" className="flex-1">
                    CSV
                  </TabsTrigger>
                  <TabsTrigger value="tag" className="flex-1">
                    Tag
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="manual">
                  <FormField
                    control={form.control}
                    name="manualNumbers"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="628111...\n628222..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="csv" className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => csvRef.current?.click()}
                  >
                    <Upload className="mr-2 h-3.5 w-3.5" /> Upload CSV
                  </Button>
                  <input
                    ref={csvRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) parseCsv(f)
                    }}
                  />
                  {csvPreview.length > 0 && (
                    <div className="rounded-md border text-xs">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50 border-b">
                            <th className="px-3 py-1.5 text-left">Nama</th>
                            <th className="px-3 py-1.5 text-left">Nomor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.map((r, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="px-3 py-1.5">{r.name ?? '—'}</td>
                              <td className="px-3 py-1.5 font-mono">
                                {r.number}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-muted-foreground px-3 py-1.5">
                        {csvRecipients.length} kontak total
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="tag">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="pelanggan,vip" {...field} />
                        </FormControl>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Pisahkan tag dengan koma
                        </p>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={mut.isPending}>
                {mut.isPending ? 'Membuat...' : 'Buat Broadcast'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
