// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/api-keys/page.tsx
'use client'
import { apiKeysApi, type ApiKey } from '@/api/api-keys.api'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { CopyButton } from '@/components/common/copy-button'
import { DataTable } from '@/components/common/data-table'
import { PageHeader } from '@/components/common/page-header'
import { TierGate } from '@/components/common/tier-gate'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { formatDate } from '@/lib/utils'
import {
  createApiKeySchema,
  type CreateApiKeyInput,
} from '@/validators/api-key.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function KeyRevealDialog({
  token,
  onClose,
}: {
  token: string
  onClose: () => void
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key Berhasil Dibuat</DialogTitle>
        </DialogHeader>
        <Alert className="border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-300">
            ⚠️ Simpan API key ini sekarang. Key tidak akan ditampilkan lagi
            setelah dialog ini ditutup.
          </AlertDescription>
        </Alert>
        <div className="bg-muted/50 flex items-center gap-2 rounded-md border p-3">
          <code className="flex-1 text-xs break-all">{token}</code>
          <CopyButton text={token} />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Saya sudah menyimpannya</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateKeyDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (token: string) => void
}) {
  const qc = useQueryClient()
  const form = useForm<CreateApiKeyInput>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
      ipWhitelist: '',
      isSandbox: false,
      expiresAt: '',
    },
  })
  const mut = useMutation({
    mutationFn: (d: CreateApiKeyInput) => apiKeysApi.create(d),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: QK.API_KEYS })
      onCreated(res.token)
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat API Key</DialogTitle>
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
                  <FormLabel>Nama Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Integrasi Tokopedia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ipWhitelist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Whitelist (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.1, 10.0.0.0/24" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Berlaku Sampai (opsional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSandbox"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <Label>Mode Sandbox</Label>
                    <p className="text-muted-foreground text-xs">
                      Pesan tidak akan dikirim ke WhatsApp
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={mut.isPending}>
                {mut.isPending ? 'Membuat...' : 'Buat Key'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function ApiKeysPage() {
  const qc = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [revealToken, setRevealToken] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: keys = [], isLoading } = useQuery({
    queryKey: QK.API_KEYS,
    queryFn: apiKeysApi.list,
  })
  const deleteMut = useMutation({
    mutationFn: () => apiKeysApi.delete(deleteId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.API_KEYS })
      toast.success('Key dihapus')
      setDeleteId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const cols: ColumnDef<ApiKey>[] = [
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'preview',
      header: 'Key',
      cell: ({ row }) => (
        <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
          {row.original.preview}...
        </code>
      ),
    },
    {
      id: 'sandbox',
      header: '',
      cell: ({ row }) =>
        row.original.isSandbox ? (
          <Badge
            variant="outline"
            className="border-0 bg-orange-100 text-xs text-orange-700"
          >
            Sandbox
          </Badge>
        ) : null,
    },
    {
      accessorKey: 'expiresAt',
      header: 'Berlaku',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.expiresAt
            ? formatDate(row.original.expiresAt)
            : 'Selamanya'}
        </span>
      ),
    },
    {
      accessorKey: 'lastUsedAt',
      header: 'Terakhir Digunakan',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.lastUsedAt ? formatDate(row.original.lastUsedAt) : '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500"
          onClick={() => setDeleteId(row.original.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ]

  return (
    <TierGate feature="api_access">
      <div className="space-y-6">
        <PageHeader
          title="API Keys"
          description="Kelola token akses untuk integrasi programmatik"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Buat API Key
            </Button>
          }
        />
        <DataTable
          columns={cols}
          data={keys}
          isLoading={isLoading}
          emptyTitle="Belum ada API key"
        />
        <CreateKeyDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={setRevealToken}
        />
        {revealToken && (
          <KeyRevealDialog
            token={revealToken}
            onClose={() => setRevealToken(null)}
          />
        )}
        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          title="Hapus API Key"
          description="Key ini tidak dapat dipulihkan."
          confirmLabel="Hapus"
          onConfirm={() => deleteMut.mutate()}
          loading={deleteMut.isPending}
        />
      </div>
    </TierGate>
  )
}
