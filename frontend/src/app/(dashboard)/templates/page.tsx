// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/templates/page.tsx
'use client'
import { templatesApi, type Template } from '@/api/templates.api'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { EmptyState } from '@/components/common/empty-state'
import { PageHeader } from '@/components/common/page-header'
import { SearchInput } from '@/components/common/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import { QK } from '@/constants/query-keys'
import { useDebounce } from '@/hooks/use-debounce'
import { parseApiError } from '@/lib/api-error'
import { truncate } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const templateSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  content: z.string().min(1, 'Konten wajib diisi'),
  category: z.string().min(1, 'Kategori wajib diisi'),
})
type TemplateForm = z.infer<typeof templateSchema>

function TemplateDialog({
  open,
  onClose,
  existing,
}: {
  open: boolean
  onClose: () => void
  existing?: Template
}) {
  const qc = useQueryClient()
  const form = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: existing?.name ?? '',
      content: existing?.content ?? '',
      category: existing?.category ?? '',
    },
  })
  const mut = useMutation({
    mutationFn: (d: TemplateForm) =>
      existing ? templatesApi.update(existing.id, d) : templatesApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.TEMPLATES() })
      toast.success(existing ? 'Template diperbarui' : 'Template dibuat')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existing ? 'Edit Template' : 'Buat Template'}
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
                  <FormLabel>Nama Template</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="promosi, sapaan, notifikasi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Halo {name}, pesanan Anda pada {date} telah..."
                      {...field}
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    Gunakan{' '}
                    <code className="bg-muted rounded px-1">{'{name}'}</code>,{' '}
                    <code className="bg-muted rounded px-1">{'{date}'}</code>{' '}
                    sebagai placeholder
                  </p>
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

export default function TemplatesPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const dSearch = useDebounce(search)
  const [addOpen, setAddOpen] = useState(false)
  const [editTpl, setEditTpl] = useState<Template | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: templates = [], isLoading } = useQuery({
    queryKey: QK.TEMPLATES({ search: dSearch }),
    queryFn: () => templatesApi.list(dSearch),
  })
  const deleteMut = useMutation({
    mutationFn: () => templatesApi.delete(deleteId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.TEMPLATES() })
      toast.success('Template dihapus')
      setDeleteId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Template Pesan"
        description="Template pesan siap pakai untuk dikirim ulang"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Template
          </Button>
        }
      />
      <SearchInput
        placeholder="Cari template..."
        onSearch={setSearch}
        className="w-64"
      />
      {!isLoading && templates.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Belum ada template"
          action={{ label: 'Buat Template', onClick: () => setAddOpen(true) }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id} className="group relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm">{t.name}</CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {t.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {truncate(t.content, 100)}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 flex-1 text-xs"
                    onClick={() => setEditTpl(t)}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => setDeleteId(t.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <TemplateDialog open={addOpen} onClose={() => setAddOpen(false)} />
      {editTpl && (
        <TemplateDialog
          open
          onClose={() => setEditTpl(null)}
          existing={editTpl}
        />
      )}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Hapus Template"
        description="Template akan dihapus permanen."
        confirmLabel="Hapus"
        onConfirm={() => deleteMut.mutate()}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
