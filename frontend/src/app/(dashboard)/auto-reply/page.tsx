'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  autoReplyApi,
  type AutoReplyRule,
  type MatchType,
} from '@/api/auto-reply.api'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import {
  autoReplySchema,
  type AutoReplyInput,
} from '@/validators/auto-reply.schema'
import { DataTable } from '@/components/common/data-table'
import { PageHeader } from '@/components/common/page-header'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { TierGate } from '@/components/common/tier-gate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
import type { ColumnDef } from '@tanstack/react-table'
import { truncate } from '@/lib/utils'

const MATCH_TYPE_CFG: Record<MatchType, { label: string; className: string }> =
  {
    exact: {
      label: 'Exact',
      className:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    contains: {
      label: 'Contains',
      className:
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    regex: {
      label: 'Regex',
      className:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    ai_smart: {
      label: 'AI Smart',
      className:
        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    },
  }

function MatchTypeBadge({ type }: { type: MatchType }) {
  const c = MATCH_TYPE_CFG[type] ?? MATCH_TYPE_CFG.exact
  return (
    <Badge
      variant="outline"
      className={`border-0 text-xs font-medium ${c.className}`}
    >
      {c.label}
    </Badge>
  )
}

// ── Rule Form Dialog ──────────────────────────────────────────────────────────
function RuleDialog({
  open,
  onClose,
  existing,
}: {
  open: boolean
  onClose: () => void
  existing?: AutoReplyRule
}) {
  const qc = useQueryClient()
  const form = useForm<AutoReplyInput>({
    resolver: zodResolver(autoReplySchema),
    defaultValues: {
      keyword: existing?.keyword ?? '',
      response: existing?.response ?? '',
      matchType: existing?.matchType ?? 'contains',
      priority: existing?.priority ?? 10,
    },
  })
  const matchType = form.watch('matchType')

  const mut = useMutation({
    mutationFn: (d: AutoReplyInput) =>
      existing ? autoReplyApi.update(existing.id, d) : autoReplyApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.AUTO_REPLY_RULES })
      toast.success(existing ? 'Rule diperbarui' : 'Rule ditambahkan')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? 'Edit Rule' : 'Tambah Rule'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((d) => mut.mutate(d))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="matchType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Match</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MATCH_TYPE_CFG).map(([v, c]) => (
                        <SelectItem key={v} value={v}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {matchType === 'regex' ? 'Pola Regex' : 'Keyword'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={matchType === 'regex' ? '^halo.*$' : 'halo'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {matchType === 'ai_smart'
                      ? 'Persona / Instruksi AI'
                      : 'Respons'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder={
                        matchType === 'ai_smart'
                          ? 'Kamu adalah asisten ramah yang membantu...'
                          : 'Halo! Ada yang bisa saya bantu?'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioritas</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={999} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
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
export default function AutoReplyPage() {
  const qc = useQueryClient()
  const [addOpen, setAddOpen] = useState(false)
  const [editRule, setEditRule] = useState<AutoReplyRule | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: rules = [], isLoading } = useQuery({
    queryKey: QK.AUTO_REPLY_RULES,
    queryFn: autoReplyApi.list,
  })

  const toggleMut = useMutation({
    mutationFn: (id: string) => autoReplyApi.toggle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.AUTO_REPLY_RULES }),
    onError: (e) => toast.error(parseApiError(e)),
  })
  const deleteMut = useMutation({
    mutationFn: () => autoReplyApi.delete(deleteId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.AUTO_REPLY_RULES })
      toast.success('Rule dihapus')
      setDeleteId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const cols: ColumnDef<AutoReplyRule>[] = [
    {
      accessorKey: 'priority',
      header: 'Prio',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.priority}
        </span>
      ),
    },
    {
      accessorKey: 'keyword',
      header: 'Keyword',
      cell: ({ row }) => (
        <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
          {row.original.keyword}
        </code>
      ),
    },
    {
      accessorKey: 'matchType',
      header: 'Tipe',
      cell: ({ row }) => <MatchTypeBadge type={row.original.matchType} />,
    },
    {
      accessorKey: 'response',
      header: 'Respons',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {truncate(row.original.response, 60)}
        </span>
      ),
    },
    {
      id: 'toggle',
      header: 'Aktif',
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => toggleMut.mutate(row.original.id)}
          disabled={toggleMut.isPending}
        />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setEditRule(row.original)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-500"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  // Sort by priority asc
  const sorted = [...rules].sort((a, b) => a.priority - b.priority)

  return (
    <TierGate feature="auto_reply">
      <div className="space-y-6">
        <PageHeader
          title="Auto Reply"
          description="Balas pesan masuk secara otomatis berdasarkan keyword"
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Rule
            </Button>
          }
        />
        <DataTable
          columns={cols}
          data={sorted}
          isLoading={isLoading}
          emptyTitle="Belum ada rule"
          emptyDescription="Tambah rule untuk membalas pesan otomatis"
        />
        <RuleDialog open={addOpen} onClose={() => setAddOpen(false)} />
        {editRule && (
          <RuleDialog
            open
            onClose={() => setEditRule(null)}
            existing={editRule}
          />
        )}
        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          title="Hapus Rule"
          description="Rule ini akan dihapus permanen."
          confirmLabel="Hapus"
          onConfirm={() => deleteMut.mutate()}
          loading={deleteMut.isPending}
        />
      </div>
    </TierGate>
  )
}
