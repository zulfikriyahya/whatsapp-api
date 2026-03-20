// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/admin/tiers/page.tsx
'use client'
import { tiersApi } from '@/api/settings.api'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { PageHeader } from '@/components/common/page-header'
import { RoleGate } from '@/components/common/role-gate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { QK } from '@/constants/query-keys'
import { TIER_FEATURE_LABELS } from '@/constants/tier-features'
import { parseApiError } from '@/lib/api-error'
import type { Tier, TierFeatureKey } from '@/types/tier'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const ALL_FEATURES = Object.keys(TIER_FEATURE_LABELS) as TierFeatureKey[]

const tierSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().optional(),
  maxSessions: z.coerce.number().int().min(1),
  maxDailyMessages: z.coerce.number().int().min(1),
  maxMonthlyBroadcasts: z.coerce.number().int().min(0),
  maxBroadcastRecipients: z.coerce.number().int().min(0),
  maxContacts: z.coerce.number().int().min(0),
  maxTemplates: z.coerce.number().int().min(0),
  maxApiKeys: z.coerce.number().int().min(0),
  rateLimitPerMinute: z.coerce.number().int().min(1),
  maxWorkflows: z.coerce.number().int().min(0),
  maxDripCampaigns: z.coerce.number().int().min(0),
  features: z.array(z.string()),
  isActive: z.boolean().default(true),
})
type TierForm = z.infer<typeof tierSchema>

function TierDialog({
  open,
  onClose,
  existing,
}: {
  open: boolean
  onClose: () => void
  existing?: Tier
}) {
  const qc = useQueryClient()
  const form = useForm<TierForm>({
    resolver: zodResolver(tierSchema),
    defaultValues: existing
      ? {
          ...existing,
          features: existing.features as string[],
        }
      : {
          name: '',
          description: '',
          price: '',
          maxSessions: 1,
          maxDailyMessages: 100,
          maxMonthlyBroadcasts: 10,
          maxBroadcastRecipients: 100,
          maxContacts: 500,
          maxTemplates: 10,
          maxApiKeys: 2,
          rateLimitPerMinute: 30,
          maxWorkflows: 3,
          maxDripCampaigns: 3,
          features: [],
          isActive: true,
        },
  })
  const mut = useMutation({
    mutationFn: (d: TierForm) =>
      existing
        ? tiersApi.update(existing.id, d as any)
        : tiersApi.create(d as any),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.TIERS })
      toast.success(existing ? 'Tier diperbarui' : 'Tier dibuat')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Tier' : 'Buat Tier'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mut.mutate(d))}>
            <ScrollArea className="h-[60vh] pr-3">
              <div className="space-y-4 pb-2">
                <div className="grid grid-cols-2 gap-3">
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga</FormLabel>
                        <FormControl>
                          <Input placeholder="Rp 99.000" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {[
                  ['maxSessions', 'Maks Sesi'],
                  ['maxDailyMessages', 'Pesan/Hari'],
                  ['maxMonthlyBroadcasts', 'Broadcast/Bulan'],
                  ['maxBroadcastRecipients', 'Penerima/Broadcast'],
                  ['maxContacts', 'Maks Kontak'],
                  ['maxTemplates', 'Maks Template'],
                  ['maxApiKeys', 'Maks API Key'],
                  ['rateLimitPerMinute', 'Rate Limit/Menit'],
                  ['maxWorkflows', 'Maks Workflow'],
                  ['maxDripCampaigns', 'Maks Drip'],
                ].map(([key, label]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as keyof TierForm}
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-2 items-center gap-4 space-y-0">
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...(field as any)} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}

                <div>
                  <FormLabel className="mb-2 block">Fitur</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_FEATURES.map((f) => (
                      <FormField
                        key={f}
                        control={form.control}
                        name="features"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(f)}
                                onCheckedChange={(c) =>
                                  field.onChange(
                                    c
                                      ? [...field.value, f]
                                      : field.value.filter((v) => v !== f)
                                  )
                                }
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer text-xs font-normal">
                              {TIER_FEATURE_LABELS[f]}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Tier Aktif</FormLabel>
                    </FormItem>
                  )}
                />
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

export default function AdminTiersPage() {
  const qc = useQueryClient()
  const [addOpen, setAddOpen] = useState(false)
  const [editTier, setEditTier] = useState<Tier | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: QK.TIERS,
    queryFn: tiersApi.list,
  })

  const deleteMut = useMutation({
    mutationFn: () => tiersApi.delete(deleteId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.TIERS })
      toast.success('Tier dihapus')
      setDeleteId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <RoleGate roles={['admin', 'super_admin']}>
      <div className="space-y-6">
        <PageHeader
          title="Kelola Tier"
          description="Paket layanan dan batasan fitur"
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Buat Tier
            </Button>
          }
        />
        {!isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((t) => (
              <Card key={t.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {!t.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Nonaktif
                        </Badge>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setEditTier(t)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500"
                        onClick={() => setDeleteId(t.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {t.price && (
                    <p className="text-primary text-sm font-semibold">
                      {t.price}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span>
                      Sesi: <b className="text-foreground">{t.maxSessions}</b>
                    </span>
                    <span>
                      Pesan/hr:{' '}
                      <b className="text-foreground">{t.maxDailyMessages}</b>
                    </span>
                    <span>
                      Kontak: <b className="text-foreground">{t.maxContacts}</b>
                    </span>
                    <span>
                      Template:{' '}
                      <b className="text-foreground">{t.maxTemplates}</b>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {t.features.map((f) => (
                      <Badge key={f} variant="secondary" className="text-xs">
                        {TIER_FEATURE_LABELS[f] ?? f}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <TierDialog open={addOpen} onClose={() => setAddOpen(false)} />
        {editTier && (
          <TierDialog
            open
            onClose={() => setEditTier(null)}
            existing={editTier}
          />
        )}
        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          title="Hapus Tier"
          description="Tier ini akan dihapus. User yang memakai tier ini tidak akan terpengaruh sampai tier mereka diperbarui."
          confirmLabel="Hapus"
          onConfirm={() => deleteMut.mutate()}
          loading={deleteMut.isPending}
        />
      </div>
    </RoleGate>
  )
}
