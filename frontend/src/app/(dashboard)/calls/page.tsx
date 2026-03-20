// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/calls/page.tsx
'use client'
import { callsApi, type CallLog } from '@/api/calls.api'
import { CopyButton } from '@/components/common/copy-button'
import { DataTable } from '@/components/common/data-table'
import { PageHeader } from '@/components/common/page-header'
import { SessionSelector } from '@/components/common/session-selector'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { QK } from '@/constants/query-keys'
import { usePagination } from '@/hooks/use-pagination'
import { parseApiError } from '@/lib/api-error'
import { formatDate } from '@/lib/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Link, Phone, Video } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function CallLinkDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [sessionId, setSessionId] = useState('')
  const [link, setLink] = useState<string | null>(null)
  const mut = useMutation({
    mutationFn: () => callsApi.createLink(sessionId),
    onSuccess: (r) => setLink(r.link),
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose()
        setLink(null)
        setSessionId('')
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Buat Call Link</DialogTitle>
        </DialogHeader>
        {!link ? (
          <>
            <SessionSelector value={sessionId} onChange={setSessionId} />
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button
                disabled={!sessionId || mut.isPending}
                onClick={() => mut.mutate()}
              >
                {mut.isPending ? 'Membuat...' : 'Buat'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Link panggilan berhasil dibuat:
            </p>
            <div className="bg-muted/50 flex items-center gap-2 rounded-md border p-3">
              <span className="flex-1 text-xs break-all">{link}</span>
              <CopyButton text={link} />
            </div>
            <Button className="w-full" onClick={onClose}>
              Selesai
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function CallsPage() {
  const { page, setPage } = usePagination()
  const [linkOpen, setLinkOpen] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: [...QK.CALLS, page],
    queryFn: () => callsApi.list(page),
  })
  const cols: ColumnDef<CallLog>[] = [
    {
      accessorKey: 'from',
      header: 'Dari',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.from}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Tipe',
      cell: ({ row }) => (
        <Badge variant="outline" className="gap-1 border-0 text-xs">
          {row.original.type === 'video' ? (
            <Video className="h-3 w-3" />
          ) : (
            <Phone className="h-3 w-3" />
          )}
          {row.original.type === 'video' ? 'Video' : 'Suara'}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`border-0 text-xs ${row.original.status === 'missed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {row.original.status === 'missed' ? 'Tidak Dijawab' : 'Diterima'}
        </Badge>
      ),
    },
    {
      accessorKey: 'sessionId',
      header: 'Sesi',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.sessionId}
        </span>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Waktu',
      cell: ({ row }) => (
        <span className="text-xs whitespace-nowrap">
          {formatDate(row.original.timestamp)}
        </span>
      ),
    },
  ]
  return (
    <div className="space-y-6">
      <PageHeader
        title="Panggilan"
        description="Log panggilan masuk WhatsApp"
        action={
          <Button size="sm" onClick={() => setLinkOpen(true)}>
            <Link className="mr-2 h-3.5 w-3.5" />
            Buat Call Link
          </Button>
        }
      />
      <DataTable
        columns={cols}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Belum ada log panggilan"
        pageCount={data?.meta.totalPages}
        page={page}
        onPageChange={setPage}
      />
      <CallLinkDialog open={linkOpen} onClose={() => setLinkOpen(false)} />
    </div>
  )
}
