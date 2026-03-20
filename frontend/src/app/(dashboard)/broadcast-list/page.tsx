// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/broadcast-list/page.tsx
'use client'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { SessionSelector } from '@/components/common/session-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { parseApiError } from '@/lib/api-error'
import api from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { List } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const sendSchema = z.object({ message: z.string().min(1, 'Pesan wajib diisi') })

function SendDialog({
  sessionId,
  listId,
  open,
  onClose,
}: {
  sessionId: string
  listId: string
  open: boolean
  onClose: () => void
}) {
  const form = useForm({ resolver: zodResolver(sendSchema) })
  const mut = useMutation({
    mutationFn: (d: { message: string }) =>
      api.post(`/broadcast-list/${sessionId}/${listId}/send`, d),
    onSuccess: () => {
      toast.success('Pesan terkirim')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kirim ke Broadcast List</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((d) => mut.mutate(d))}
            className="space-y-4"
          >
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={mut.isPending}>
                {mut.isPending ? 'Mengirim...' : 'Kirim'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function BroadcastListPage() {
  const [sessionId, setSessionId] = useState('')
  const [sendTarget, setSendTarget] = useState<string | null>(null)

  const { data: lists = [] } = useQuery({
    queryKey: [...['broadcast-lists'], sessionId],
    queryFn: () =>
      api.get(`/broadcast-list/${sessionId}`).then((r) => r.data.data ?? []),
    enabled: !!sessionId,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Broadcast List"
        description="Kelola WA native broadcast list"
      />
      <div className="space-y-1.5">
        <Label>Pilih Sesi</Label>
        <SessionSelector
          value={sessionId}
          onChange={setSessionId}
          className="w-64"
        />
      </div>
      {sessionId &&
        (lists.length === 0 ? (
          <EmptyState icon={List} title="Tidak ada broadcast list" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {lists.map((l: any) => (
              <Card key={l.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{l.name ?? l.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSendTarget(l.id)}
                  >
                    Kirim Pesan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      {sendTarget && (
        <SendDialog
          sessionId={sessionId}
          listId={sendTarget}
          open
          onClose={() => setSendTarget(null)}
        />
      )}
    </div>
  )
}
