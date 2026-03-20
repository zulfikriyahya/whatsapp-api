// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/drip-campaigns/[id]/subscribers/page.tsx
'use client'
import {
  dripApi,
  type DripSubscriber,
  type SubscriptionStatus,
} from '@/api/drip.api'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { DataTable } from '@/components/common/data-table'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QK } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { usePagination } from '@/hooks/use-pagination'
import { parseApiError } from '@/lib/api-error'
import { formatDate } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { toast } from 'sonner'

const STATUS_CFG: Record<
  SubscriptionStatus,
  { label: string; className: string }
> = {
  active: { label: 'Aktif', className: 'bg-green-100 text-green-700' },
  completed: { label: 'Selesai', className: 'bg-blue-100 text-blue-700' },
  paused: { label: 'Dijeda', className: 'bg-yellow-100 text-yellow-700' },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-700' },
}

export default function DripSubscribersPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const qc = useQueryClient()
  const { page, setPage } = usePagination()
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>(
    'all'
  )
  const [cancelId, setCancelId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: QK.DRIP_SUBSCRIBERS(id),
    queryFn: () =>
      dripApi.getSubscribers(
        id,
        statusFilter !== 'all' ? statusFilter : undefined,
        page
      ),
  })
  const cancelMut = useMutation({
    mutationFn: () => dripApi.cancelSubscription(cancelId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.DRIP_SUBSCRIBERS(id) })
      toast.success('Subscription dibatalkan')
      setCancelId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const cols: ColumnDef<DripSubscriber>[] = [
    {
      accessorKey: 'contactName',
      header: 'Nama',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.contactName ?? '—'}</span>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Nomor',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.phoneNumber}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const c = STATUS_CFG[row.original.status] ?? STATUS_CFG.active
        return (
          <Badge
            variant="outline"
            className={`border-0 text-xs ${c.className}`}
          >
            {c.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'lastStepDay',
      header: 'Step Terakhir',
      cell: ({ row }) => (
        <span className="text-xs">Hari ke-{row.original.lastStepDay}</span>
      ),
    },
    {
      accessorKey: 'startedAt',
      header: 'Mulai',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(row.original.startedAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        row.original.status === 'active' ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-red-500"
            onClick={() => setCancelId(row.original.id)}
          >
            Batalkan
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(ROUTES.DRIP_CAMPAIGNS)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Subscriber Drip Campaign"
          description="Daftar kontak yang sedang mengikuti drip campaign ini"
        />
      </div>
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
            {Object.entries(STATUS_CFG).map(([v, c]) => (
              <SelectItem key={v} value={v}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={cols}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Belum ada subscriber"
        pageCount={data?.meta.totalPages}
        page={page}
        onPageChange={setPage}
      />
      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={() => setCancelId(null)}
        title="Batalkan Subscription"
        description="Kontak ini tidak akan menerima pesan drip selanjutnya."
        confirmLabel="Batalkan"
        onConfirm={() => cancelMut.mutate()}
        loading={cancelMut.isPending}
      />
    </div>
  )
}
