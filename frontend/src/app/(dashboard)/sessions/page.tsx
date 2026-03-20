'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { sessionsApi } from '@/api/sessions.api'
import { QK } from '@/constants/query-keys'
import { PageHeader } from '@/components/common/page-header'
import { SessionCard } from '@/components/session/session-card'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { LoadingSkeleton } from '@/components/common/loading-skeleton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useSessionStore } from '@/store/session.store'
import { parseApiError } from '@/lib/api-error'
import { Smartphone } from 'lucide-react'

// ── Schema ────────────────────────────────────────────────────────────────────
const createSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi'),
    usePairingCode: z.boolean().default(false),
    phoneNumber: z.string().optional(),
  })
  .refine(
    (d) => !d.usePairingCode || (d.phoneNumber && d.phoneNumber.length >= 8),
    {
      message: 'Nomor telepon wajib diisi untuk pairing code',
      path: ['phoneNumber'],
    }
  )
type CreateForm = z.infer<typeof createSchema>

// ── Add Session Dialog ────────────────────────────────────────────────────────
function AddSessionDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const form = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: '', usePairingCode: false, phoneNumber: '' },
  })
  const usePairing = form.watch('usePairingCode')

  const mut = useMutation({
    mutationFn: (data: CreateForm) => sessionsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.SESSIONS })
      toast.success('Sesi dibuat, menunggu QR/Pairing...')
      onClose()
      form.reset()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Sesi WhatsApp</DialogTitle>
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
                  <FormLabel>Nama Sesi</FormLabel>
                  <FormControl>
                    <Input placeholder="contoh: Akun Utama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usePairingCode"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <Label className="cursor-pointer">
                      Gunakan Pairing Code
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Tanpa scan QR — masukkan kode di WhatsApp
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {usePairing && (
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="628xxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={mut.isPending}>
                {mut.isPending ? 'Membuat...' : 'Buat Sesi'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// ── QR Dialog ─────────────────────────────────────────────────────────────────
function QrDialog({
  sessionId,
  onClose,
}: {
  sessionId: string | null
  onClose: () => void
}) {
  const activeQr = useSessionStore((s) => s.activeQr)
  const qr = activeQr?.sessionId === sessionId ? activeQr.qr : null
  return (
    <Dialog open={!!sessionId} onOpenChange={onClose}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          {qr ? (
            <div className="rounded-xl border bg-white p-3">
              <QRCodeSVG value={qr} size={220} />
            </div>
          ) : (
            <div className="bg-muted flex h-[238px] w-[238px] items-center justify-center rounded-xl border">
              <p className="text-muted-foreground text-sm">Menunggu QR...</p>
            </div>
          )}
          <p className="text-muted-foreground text-center text-xs">
            Buka WhatsApp → Setelan → Perangkat Tertaut → Tautkan Perangkat
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Info Dialog ───────────────────────────────────────────────────────────────
function InfoDialog({
  sessionId,
  onClose,
}: {
  sessionId: string | null
  onClose: () => void
}) {
  const { data, isLoading } = useQuery({
    queryKey: QK.SESSION_INFO(sessionId ?? ''),
    queryFn: () => sessionsApi.getInfo(sessionId!),
    enabled: !!sessionId,
  })
  return (
    <Dialog open={!!sessionId} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Info Sesi</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <LoadingSkeleton rows={3} />
        ) : (
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['State', data?.state],
              ['Pushname', data?.pushname],
              ['Platform', data?.platform],
              ['Version', data?.version],
              ['Nomor', data?.phoneNumber],
            ].map(([k, v]) =>
              v ? (
                <div key={k as string}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ) : null
            )}
          </dl>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SessionsPage() {
  const [addOpen, setAddOpen] = useState(false)
  const [qrSessionId, setQrSessionId] = useState<string | null>(null)
  const [infoSessionId, setInfoSessionId] = useState<string | null>(null)

  const {
    data: sessions,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: QK.SESSIONS,
    queryFn: sessionsApi.list,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sesi WhatsApp"
        description="Kelola koneksi akun WhatsApp Anda"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Sesi
          </Button>
        }
      />

      {isLoading && <LoadingSkeleton rows={3} />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading &&
        !isError &&
        (sessions && sessions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                onShowQr={setQrSessionId}
                onShowInfo={setInfoSessionId}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Smartphone}
            title="Belum ada sesi"
            description="Tambah sesi WhatsApp untuk mulai mengirim pesan"
            action={{ label: 'Tambah Sesi', onClick: () => setAddOpen(true) }}
          />
        ))}

      <AddSessionDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <QrDialog sessionId={qrSessionId} onClose={() => setQrSessionId(null)} />
      <InfoDialog
        sessionId={infoSessionId}
        onClose={() => setInfoSessionId(null)}
      />
    </div>
  )
}
