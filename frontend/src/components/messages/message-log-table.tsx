// ─────────────────────────────────────────────────────────────────────────────
// src/components/messages/message-log-table.tsx
'use client'
import { messagesApi } from '@/api/messages.api'
import { DataTable } from '@/components/common/data-table'
import { ExportPdfButton } from '@/components/common/export-pdf-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QK } from '@/constants/query-keys'
import { usePagination } from '@/hooks/use-pagination'
import { formatDate, truncate } from '@/lib/utils'
import type { MessageLog, MessageStatus } from '@/types/message'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { MessageStatusBadge } from './message-status-badge'

const cols: ColumnDef<MessageLog>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Waktu',
    cell: ({ row }) => (
      <span className="text-xs whitespace-nowrap">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: 'to',
    header: 'Tujuan',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.to}</span>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => (
      <span className="text-xs capitalize">{row.original.type}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <MessageStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'message',
    header: 'Pesan',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.message ? truncate(row.original.message, 50) : '—'}
      </span>
    ),
  },
]

export function MessageLogTable() {
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all')
  const { page, setPage } = usePagination()

  const { data, isLoading } = useQuery({
    queryKey: QK.MESSAGE_LOGS({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page,
    }),
    queryFn: () =>
      messagesApi.getLogs({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
      }),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as MessageStatus | 'all')
            setPage(1)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="success">Berhasil</SelectItem>
            <SelectItem value="failed">Gagal</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
          </SelectContent>
        </Select>
        <ExportPdfButton
          onExport={messagesApi.exportPdf}
          filename="message-logs.pdf"
        />
      </div>
      <DataTable
        columns={cols}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Belum ada log pesan"
        pageCount={data?.meta.totalPages}
        page={page}
        onPageChange={setPage}
      />
    </div>
  )
}
