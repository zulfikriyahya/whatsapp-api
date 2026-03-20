// src/app/(dashboard)/drip-campaigns/page.tsx
'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Play, Pause, Users } from 'lucide-react'
import { toast } from 'sonner'
import { dripApi, type DripCampaign } from '@/api/drip.api'
import { QK } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { parseApiError } from '@/lib/api-error'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { TierGate } from '@/components/common/tier-gate'
import { StatusBadge } from '@/components/common/status-badge'
import { SessionSelector } from '@/components/common/session-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Droplets } from 'lucide-react'

const stepSchema = z.object({
  dayOffset: z.coerce.number().int().min(0, 'Hari >= 0'),
  timeAt: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
  message: z.string().min(1, 'Pesan wajib diisi'),
})
const dripSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi'),
    triggerTag: z.string().min(1, 'Tag wajib diisi'),
    sessionId: z.string().optional(),
    steps: z.array(stepSchema).min(1, 'Min. 1 step'),
  })
  .superRefine((d, ctx) => {
    const days = d.steps.map((s) => s.dayOffset)
    const dupes = days.filter((v, i) => days.indexOf(v) !== i)
    if (dupes.length > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['steps'],
        message: `Day offset duplikat: ${[...new Set(dupes)].join(', ')}`,
      })
    }
  })
type DripForm = z.infer<typeof dripSchema>

// ── Drip Dialog ───────────────────────────────────────────────────────────────
function DripDialog({
  open,
  onClose,
  existing,
}: {
  open: boolean
  onClose: () => void
  existing?: DripCampaign
}) {
  const qc = useQueryClient()
  const form = useForm<DripForm>({
    resolver: zodResolver(dripSchema),
    defaultValues: {
      name: existing?.name ?? '',
      triggerTag: existing?.triggerTag ?? '',
      sessionId: existing?.sessionId ?? '',
      steps: existing?.steps ?? [
        { dayOffset: 0, timeAt: '09:00', message: '' },
      ],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'steps',
  })

  const mut = useMutation({
    mutationFn: (d: DripForm) =>
      existing
        ? dripApi.update(existing.id, d)
        : dripApi.create({ ...d, isActive: true, subscriberCount: 0 }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.DRIP_CAMPAIGNS })
      toast.success(
        existing ? 'Drip campaign diperbarui' : 'Drip campaign dibuat'
      )
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {existing ? 'Edit Drip Campaign' : 'Buat Drip Campaign'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mut.mutate(d))}>
            <ScrollArea className="h-[60vh] pr-3">
              <div className="space-y-4 pb-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="triggerTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trigger Tag</FormLabel>
                      <FormControl>
                        <Input placeholder="onboarding" {...field} />
                      </FormControl>
                      <p className="text-muted-foreground text-xs">
                        Kontak dengan tag ini akan otomatis masuk ke drip
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sessionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sesi (opsional)</FormLabel>
                      <FormControl>
                        <SessionSelector
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Auto"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Steps */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Step ({fields.length})
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() =>
                        append({
                          dayOffset: fields.length,
                          timeAt: '09:00',
                          message: '',
                        })
                      }
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Tambah Step
                    </Button>
                  </div>
                  {fields.map((f, i) => (
                    <div
                      key={f.id}
                      className="bg-muted/20 space-y-2 rounded-md border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs font-medium">
                          Step {i + 1}
                        </span>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-red-500"
                            onClick={() => remove(i)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name={`steps.${i}.dayOffset`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Hari ke-
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  className="h-8 text-xs"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`steps.${i}.timeAt`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Jam (HH:MM)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  className="h-8 text-xs"
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
                        name={`steps.${i}.message`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                rows={2}
                                placeholder="Isi pesan step ini..."
                                className="resize-none text-xs"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  {(form.formState.errors.steps as any)?.message && (
                    <p className="text-xs text-red-500">
                      {(form.formState.errors.steps as any).message}
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={mut.isPending}>
                {mut.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DripCampaignsPage() {
  const qc = useQueryClient()
  const router = useRouter()
  const [addOpen, setAddOpen] = useState(false)
  const [editDrip, setEditDrip] = useState<DripCampaign | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: drips = [], isLoading } = useQuery({
    queryKey: QK.DRIP_CAMPAIGNS,
    queryFn: dripApi.list,
  })
  const toggleMut = useMutation({
    mutationFn: (id: string) => dripApi.toggle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.DRIP_CAMPAIGNS }),
    onError: (e) => toast.error(parseApiError(e)),
  })
  const deleteMut = useMutation({
    mutationFn: () => dripApi.delete(deleteId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.DRIP_CAMPAIGNS })
      toast.success('Drip campaign dihapus')
      setDeleteId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <TierGate feature="drip_campaign">
      <div className="space-y-6">
        <PageHeader
          title="Drip Campaign"
          description="Kirim pesan berseri otomatis berdasarkan tag kontak"
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Buat Drip
            </Button>
          }
        />

        {!isLoading && drips.length === 0 ? (
          <EmptyState
            icon={Droplets}
            title="Belum ada drip campaign"
            action={{
              label: 'Buat Drip Campaign',
              onClick: () => setAddOpen(true),
            }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drips.map((d) => (
              <Card key={d.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{d.name}</CardTitle>
                    <StatusBadge status={d.isActive ? 'active' : 'inactive'} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="text-muted-foreground">Tag:</span>
                    <Badge variant="secondary">{d.triggerTag}</Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {d.steps.length} step · {d.subscriberCount} subscriber aktif
                  </p>
                  <div className="flex gap-1 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => router.push(ROUTES.DRIP_SUBSCRIBERS(d.id))}
                    >
                      <Users className="mr-1 h-3 w-3" />
                      Subscriber
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => toggleMut.mutate(d.id)}
                      disabled={toggleMut.isPending}
                    >
                      {d.isActive ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setEditDrip(d)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500"
                      onClick={() => setDeleteId(d.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DripDialog open={addOpen} onClose={() => setAddOpen(false)} />
        {editDrip && (
          <DripDialog
            open
            onClose={() => setEditDrip(null)}
            existing={editDrip}
          />
        )}
        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          title="Hapus Drip Campaign"
          description="Semua subscriber aktif akan dihentikan."
          confirmLabel="Hapus"
          onConfirm={() => deleteMut.mutate()}
          loading={deleteMut.isPending}
        />
      </div>
    </TierGate>
  )
}
