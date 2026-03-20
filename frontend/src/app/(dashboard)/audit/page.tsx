// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/audit/page.tsx
'use client'
import { auditApi, type AuditLog } from '@/api/audit.api'
import { DataTable } from '@/components/common/data-table'
import { ExportPdfButton } from '@/components/common/export-pdf-button'
import { PageHeader } from '@/components/common/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { QK } from '@/constants/query-keys'
import { usePagination } from '@/hooks/use-pagination'
import { formatDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const ACTION_COLORS: Record<string, string> = {
  LOGIN: 'bg-gray-100 text-gray-600',
  LOGOUT: 'bg-gray-100 text-gray-600',
  CREATE_SESSION: 'bg-blue-100 text-blue-700',
  DELETE_SESSION: 'bg-red-100 text-red-700',
  START_BROADCAST: 'bg-green-100 text-green-700',
  CANCEL_BROADCAST: 'bg-red-100 text-red-700',
  ENABLE_2FA: 'bg-purple-100 text-purple-700',
  DISABLE_2FA: 'bg-purple-100 text-purple-700',
  ASSIGN_TIER: 'bg-yellow-100 text-yellow-700',
  CREATE_USER: 'bg-blue-100 text-blue-700',
  DELETE_USER: 'bg-red-100 text-red-700',
}

function AuditActionBadge({ action }: { action: string }) {
  return (
    <Badge
      variant="outline"
      className={`border-0 text-xs font-medium ${ACTION_COLORS[action] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {action.replace(/_/g, ' ')}
    </Badge>
  )
}

export default function AuditPage() {
  const { page, setPage } = usePagination()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: QK.AUDIT_LOGS({
      page,
      from: from || undefined,
      to: to || undefined,
    }),
    queryFn: () =>
      auditApi.list({ page, from: from || undefined, to: to || undefined }),
  })

  const cols: ColumnDef<AuditLog>[] = [
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
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span className="text-xs">{row.original.email}</span>,
    },
    {
      accessorKey: 'action',
      header: 'Aksi',
      cell: ({ row }) => <AuditActionBadge action={row.original.action} />,
    },
    {
      accessorKey: 'ip',
      header: 'IP',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.ip ?? '—'}</span>
      ),
    },
    {
      id: 'detail',
      header: 'Detail',
      cell: ({ row }) =>
        row.original.detail ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                Detail <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <pre className="max-h-40 overflow-auto text-xs">
                {JSON.stringify(row.original.detail, null, 2)}
              </pre>
            </PopoverContent>
          </Popover>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Riwayat aktivitas akun"
        action={
          <ExportPdfButton
            onExport={auditApi.exportPdf}
            filename="audit-log.pdf"
          />
        }
      />
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Dari</Label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-8 w-36 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Sampai</Label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-8 w-36 text-xs"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => {
            setFrom('')
            setTo('')
          }}
        >
          Reset
        </Button>
      </div>
      <DataTable
        columns={cols}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Tidak ada log"
        pageCount={data?.meta.totalPages}
        page={page}
        onPageChange={setPage}
      />
    </div>
  )
}
