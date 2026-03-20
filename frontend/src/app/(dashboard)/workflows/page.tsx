'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, GripVertical, Play, Pause } from 'lucide-react'
import { toast } from 'sonner'
import {
  workflowApi,
  type Workflow,
  type WorkflowNode,
  type NodeType,
} from '@/api/workflow.api'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { PageHeader } from '@/components/common/page-header'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { EmptyState } from '@/components/common/empty-state'
import { TierGate } from '@/components/common/tier-gate'
import { StatusBadge } from '@/components/common/status-badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GitBranch } from 'lucide-react'

const nodeSchema = z.object({
  type: z.enum(['send_message', 'delay', 'add_tag']),
  message: z.string().optional(),
  delay: z.coerce.number().min(1).max(3600).optional(),
  tag: z.string().optional(),
})

const workflowSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  triggerKeyword: z.string().min(1, 'Keyword wajib diisi'),
  matchType: z.enum(['exact', 'contains', 'regex']),
  nodes: z.array(nodeSchema).min(1, 'Min. 1 node').max(20, 'Maks. 20 node'),
})
type WorkflowForm = z.infer<typeof workflowSchema>

// ── Node Card ─────────────────────────────────────────────────────────────────
function NodeEditor({
  index,
  control,
  remove,
  type,
}: {
  index: number
  control: any
  remove: () => void
  type: NodeType
}) {
  return (
    <div className="bg-muted/30 flex gap-2 rounded-md border p-3">
      <GripVertical className="text-muted-foreground mt-1 h-4 w-4 shrink-0 cursor-grab" />
      <div className="flex-1 space-y-2">
        <FormField
          control={control}
          name={`nodes.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send_message">Kirim Pesan</SelectItem>
                  <SelectItem value="delay">Delay</SelectItem>
                  <SelectItem value="add_tag">Tambah Tag</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {type === 'send_message' && (
          <FormField
            control={control}
            name={`nodes.${index}.message`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="Teks pesan..."
                    className="text-xs"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        {type === 'delay' && (
          <FormField
            control={control}
            name={`nodes.${index}.delay`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={3600}
                    placeholder="Detik (1–3600)"
                    className="h-8 text-xs"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {type === 'add_tag' && (
          <FormField
            control={control}
            name={`nodes.${index}.tag`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nama tag"
                    className="h-8 text-xs"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-7 w-7 shrink-0 text-red-500"
        onClick={remove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

// ── Workflow Dialog ───────────────────────────────────────────────────────────
function WorkflowDialog({
  open,
  onClose,
  existing,
}: {
  open: boolean
  onClose: () => void
  existing?: Workflow
}) {
  const qc = useQueryClient()
  const form = useForm<WorkflowForm>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: existing?.name ?? '',
      triggerKeyword: existing?.triggerKeyword ?? '',
      matchType: existing?.matchType ?? 'contains',
      nodes: existing?.nodes.map((n) => ({
        type: n.type,
        message: (n.config as any).message,
        delay: (n.config as any).seconds,
        tag: (n.config as any).tag,
      })) ?? [{ type: 'send_message', message: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'nodes',
  })
  const nodeTypes = form.watch('nodes')

  const toApiNodes = (d: WorkflowForm): WorkflowNode[] =>
    d.nodes.map((n) => ({
      type: n.type,
      config:
        n.type === 'send_message'
          ? { message: n.message }
          : n.type === 'delay'
            ? { seconds: n.delay }
            : { tag: n.tag },
    }))

  const mut = useMutation({
    mutationFn: (d: WorkflowForm) => {
      const payload = {
        name: d.name,
        triggerKeyword: d.triggerKeyword,
        matchType: d.matchType,
        nodes: toApiNodes(d),
      }
      return existing
        ? workflowApi.update(existing.id, payload)
        : workflowApi.create(payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WORKFLOWS })
      toast.success(existing ? 'Workflow diperbarui' : 'Workflow dibuat')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existing ? 'Edit Workflow' : 'Buat Workflow'}
          </DialogTitle>
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
                  <FormLabel>Nama Workflow</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="triggerKeyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger Keyword</FormLabel>
                    <FormControl>
                      <Input placeholder="order" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="matchType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exact">Exact</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="regex">Regex</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Node ({fields.length}/20)</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={fields.length >= 20}
                  onClick={() => append({ type: 'send_message', message: '' })}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Tambah Node
                </Button>
              </div>
              {fields.map((f, i) => (
                <NodeEditor
                  key={f.id}
                  index={i}
                  control={form.control}
                  remove={() => remove(i)}
                  type={nodeTypes[i]?.type ?? 'send_message'}
                />
              ))}
              {form.formState.errors.nodes?.root && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.nodes.root.message}
                </p>
              )}
            </div>

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
export default function WorkflowsPage() {
  const qc = useQueryClient()
  const [addOpen, setAddOpen] = useState(false)
  const [editWf, setEditWf] = useState<Workflow | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: QK.WORKFLOWS,
    queryFn: workflowApi.list,
  })

  const toggleMut = useMutation({
    mutationFn: (id: string) => workflowApi.toggle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.WORKFLOWS }),
    onError: (e) => toast.error(parseApiError(e)),
  })
  const deleteMut = useMutation({
    mutationFn: () => workflowApi.delete(deleteId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.WORKFLOWS })
      toast.success('Workflow dihapus')
      setDeleteId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <TierGate feature="workflow">
      <div className="space-y-6">
        <PageHeader
          title="Workflow Automation"
          description="Buat alur otomasi multi-step dari trigger pesan"
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Buat Workflow
            </Button>
          }
        />

        {isLoading ? null : workflows.length === 0 ? (
          <EmptyState
            icon={GitBranch}
            title="Belum ada workflow"
            description="Buat workflow untuk otomasi balasan multi-step"
            action={{ label: 'Buat Workflow', onClick: () => setAddOpen(true) }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflows.map((wf) => (
              <Card key={wf.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm leading-tight font-semibold">
                      {wf.name}
                    </CardTitle>
                    <StatusBadge status={wf.isActive ? 'active' : 'inactive'} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="text-muted-foreground">Trigger:</span>
                    <code className="bg-muted rounded px-1">
                      {wf.triggerKeyword}
                    </code>
                    <Badge variant="outline" className="text-xs">
                      {wf.matchType}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {wf.nodes.length} node ·{' '}
                    {wf.executionCount.toLocaleString()} eksekusi
                  </p>
                  <div className="flex gap-1 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 flex-1 text-xs"
                      onClick={() => toggleMut.mutate(wf.id)}
                      disabled={toggleMut.isPending}
                    >
                      {wf.isActive ? (
                        <>
                          <Pause className="mr-1 h-3 w-3" />
                          Nonaktif
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Aktifkan
                        </>
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setEditWf(wf)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500"
                      onClick={() => setDeleteId(wf.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <WorkflowDialog open={addOpen} onClose={() => setAddOpen(false)} />
        {editWf && (
          <WorkflowDialog
            open
            onClose={() => setEditWf(null)}
            existing={editWf}
          />
        )}
        <ConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          title="Hapus Workflow"
          description="Workflow akan dihapus permanen."
          confirmLabel="Hapus"
          onConfirm={() => deleteMut.mutate()}
          loading={deleteMut.isPending}
        />
      </div>
    </TierGate>
  )
}
