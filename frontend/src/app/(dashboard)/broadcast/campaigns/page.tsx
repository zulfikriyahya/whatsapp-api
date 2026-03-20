// src/app/(dashboard)/broadcast/campaigns/page.tsx
'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { broadcastApi } from '@/api/broadcast.api'
import { QK } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import { DataTable } from '@/components/common/data-table'
import { PageHeader } from '@/components/common/page-header'
import { CampaignStatusBadge } from '@/components/broadcast/campaign-status-badge'
import { CreateBroadcastDialog } from '@/components/broadcast/create-broadcast-dialog'
import { TierGate } from '@/components/common/tier-gate'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePagination } from '@/hooks/use-pagination'
import { formatDate } from '@/lib/utils'
import type { Campaign, CampaignStatus } from '@/types/broadcast'

const cols: ColumnDef<Campaign>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Campaign',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'totalRecipients',
    header: 'Total',
    cell: ({ row }) => row.original.totalRecipients.toLocaleString(),
  },
  {
    accessorKey: 'successCount',
    header: 'Berhasil',
    cell: ({ row }) => (
      <span className="text-green-600">
        {row.original.successCount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'failedCount',
    header: 'Gagal',
    cell: ({ row }) => (
      <span className="text-red-500">
        {row.original.failedCount.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <CampaignStatusBadge status={row.original.status as CampaignStatus} />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Dibuat',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs whitespace-nowrap">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
]

export default function BroadcastCampaignsPage() {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>(
    'all'
  )
  const { page, setPage } = usePagination()

  const { data, isLoading } = useQuery({
    queryKey: [...QK.CAMPAIGNS, statusFilter, page],
    queryFn: () =>
      broadcastApi.list(
        page,
        20,
        statusFilter !== 'all' ? statusFilter : undefined
      ),
  })

  return (
    <TierGate feature="broadcast">
      <div className="space-y-6">
        <PageHeader
          title="Broadcast Campaign"
          description="Kirim pesan massal ke banyak penerima"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Buat Broadcast
            </Button>
          }
        />
        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as CampaignStatus | 'all')
              setPage(1)
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="processing">Diproses</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={cols}
          data={data?.data ?? []}
          isLoading={isLoading}
          emptyTitle="Belum ada broadcast"
          emptyDescription="Klik 'Buat Broadcast' untuk memulai"
          pageCount={data?.meta.totalPages}
          page={page}
          onPageChange={setPage}
        />
        <CreateBroadcastDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      </div>
    </TierGate>
  )
}
