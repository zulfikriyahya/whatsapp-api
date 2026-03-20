// src/app/(dashboard)/scheduler/page.tsx
'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, XCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  schedulerApi,
  type Scheduled,
  type ScheduledStatus,
} from '@/api/scheduler.api'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import {
  createSchedulerSchema,
  type CreateSchedulerInput,
} from '@/validators/scheduler.schema'
import { normalizePhone, formatDate } from '@/lib/utils'
import { usePagination } from '@/hooks/use-pagination'
import { DataTable } from '@/components/common/data-table'
import { PageHeader } from '@/components/common/page-header'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { StatusBadge } from '@/components/common/status-badge'
import { TierGate } from '@/components/common/tier-gate'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SessionSelector } from '@/components/common/session-selector'
import type { ColumnDef } from '@tanstack/react-table'

function CreateScheduledDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const form = useForm<CreateSchedulerInput>({
    resolver: zodResolver(createSchedulerSchema),
    defaultValues: {
      to: '',
      message: '',
      sessionId: '',
      scheduledTime: '',
      recurrenceType: 'none',
    },
  })
  const mut = useMutation({
    mutationFn: (d: CreateSchedulerInput) =>
      schedulerApi.create({ ...d, to: normalizePhone(d.to) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.SCHEDULED() })
      toast.success('Jadwal dibuat')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jadwalkan Pesan</DialogTitle>
        </DialogHeader>
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
                    <Input
                      placeholder="628xxxxxxxxx"
                      inputMode="tel"
                      {...field}
                    />
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
                  <FormMessage />
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
            <FormField
              control={form.control}
              name="scheduledTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Kirim</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recurrenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pengulangan</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak berulang</SelectItem>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={mut.isPending}>
                {mut.isPending ? 'Menjadwalkan...' : 'Jadwalkan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function SchedulerPage() {
  const qc = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<ScheduledStatus | 'all'>(
    'all'
  )
  const { page, setPage } = usePagination()

  const { data, isLoading } = useQuery({
    queryKey: QK.SCHEDULED({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page,
    }),
    queryFn: () =>
      schedulerApi.list({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
      }),
  })
  const cancelMut = useMutation({
    mutationFn: (id: string) => schedulerApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.SCHEDULED() })
      toast.success('Jadwal dibatalkan')
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const deleteMut = useMutation({
    mutationFn: () => schedulerApi.delete(deleteId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.SCHEDULED() })
      toast.success('Jadwal dihapus')
      setDeleteId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const RECUR_LABELS: Record<string, string> = {
    none: 'Sekali',
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
  }

  const cols: ColumnDef<Scheduled>[] = [
    {
      accessorKey: 'to',
      header: 'Tujuan',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.to}</span>
      ),
    },
    {
      accessorKey: 'message',
      header: 'Pesan',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.message.slice(0, 40)}...
        </span>
      ),
    },
    {
      accessorKey: 'scheduledTime',
      header: 'Waktu',
      cell: ({ row }) => (
        <span className="text-xs whitespace-nowrap">
          {formatDate(row.original.scheduledTime)}
        </span>
      ),
    },
    {
      accessorKey: 'recurrenceType',
      header: 'Ulang',
      cell: ({ row }) => (
        <span className="text-xs">
          {RECUR_LABELS[row.original.recurrenceType]}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.status === 'pending' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-yellow-600"
              title="Batalkan"
              onClick={() => cancelMut.mutate(row.original.id)}
            >
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <TierGate feature="scheduler">
      <div className="space-y-6">
        <PageHeader
          title="Scheduler"
          description="Jadwalkan pengiriman pesan pada waktu tertentu"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Jadwalkan Pesan
            </Button>
          }
        />
        <div className="flex gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as any)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="sent">Terkirim</SelectItem>
              <SelectItem value="failed">Gagal</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={cols}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyTitle="Belum ada jadwal"
          pageCount={data?.meta.totalPages}
          page={page}
          onPageChange={setPage}
        />
        <CreateScheduledDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          title="Hapus Jadwal"
          description="Jadwal ini akan dihapus permanen."
          confirmLabel="Hapus"
          onConfirm={() => deleteMut.mutate()}
          loading={deleteMut.isPending}
        />
      </div>
    </TierGate>
  )
}
