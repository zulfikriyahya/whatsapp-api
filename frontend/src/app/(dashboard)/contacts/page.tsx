'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Upload, Download, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import Papa from 'papaparse'
import { contactsApi, type Contact } from '@/api/contacts.api'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { normalizePhone, formatDate } from '@/lib/utils'
import { usePagination } from '@/hooks/use-pagination'
import { useDebounce } from '@/hooks/use-debounce'
import { DataTable } from '@/components/common/data-table'
import { PageHeader } from '@/components/common/page-header'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { SearchInput } from '@/components/common/search-input'
import { TierGate } from '@/components/common/tier-gate'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import type { ColumnDef } from '@tanstack/react-table'

// ── Contact Form Dialog ───────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  phoneNumber: z.string().min(8, 'Nomor tidak valid'),
  tags: z.string().optional(),
})
type ContactForm = z.infer<typeof contactSchema>

function ContactFormDialog({
  open,
  onClose,
  existing,
}: {
  open: boolean
  onClose: () => void
  existing?: Contact
}) {
  const qc = useQueryClient()
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: existing?.name ?? '',
      phoneNumber: existing?.phoneNumber ?? '',
      tags: existing?.tags.join(', ') ?? '',
    },
  })
  const mut = useMutation({
    mutationFn: (d: ContactForm) => {
      const payload = {
        name: d.name,
        phoneNumber: normalizePhone(d.phoneNumber),
        tags: d.tags
          ? d.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      }
      return existing
        ? contactsApi.update(existing.id, payload)
        : contactsApi.create(payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.CONTACTS() })
      toast.success(existing ? 'Kontak diperbarui' : 'Kontak ditambahkan')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existing ? 'Edit Kontak' : 'Tambah Kontak'}
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
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor WhatsApp</FormLabel>
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="pelanggan, vip" {...field} />
                  </FormControl>
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

// ── Note Dialog ───────────────────────────────────────────────────────────────
function NoteDialog({
  contact,
  open,
  onClose,
}: {
  contact: Contact
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [note, setNote] = useState(contact.note ?? '')
  const saveMut = useMutation({
    mutationFn: () => contactsApi.upsertNote(contact.id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.CONTACTS() })
      toast.success('Catatan disimpan')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const delMut = useMutation({
    mutationFn: () => contactsApi.deleteNote(contact.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.CONTACTS() })
      toast.success('Catatan dihapus')
      onClose()
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catatan — {contact.name}</DialogTitle>
        </DialogHeader>
        <Textarea
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tulis catatan internal..."
        />
        <DialogFooter className="gap-2">
          {contact.note && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => delMut.mutate()}
              disabled={delMut.isPending}
            >
              Hapus Catatan
            </Button>
          )}
          <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Import CSV Dialog ─────────────────────────────────────────────────────────
function ImportCsvDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const qc = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{ name?: string; number: string }[]>(
    []
  )
  const mut = useMutation({
    mutationFn: () => contactsApi.importCsv(file!),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: QK.CONTACTS() })
      toast.success(
        `Import selesai: ${res.imported} berhasil, ${res.skipped} dilewati`
      )
      onClose()
      setFile(null)
      setPreview([])
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const handleFile = (f: File) => {
    setFile(f)
    Papa.parse<{ name?: string; number: string }>(f, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => setPreview(r.data.slice(0, 5)),
    })
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Kontak via CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs">
            Format kolom:{' '}
            <code className="bg-muted rounded px-1">name,number,tag</code>
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('csv-input')?.click()}
          >
            <Upload className="mr-2 h-3.5 w-3.5" /> Pilih File CSV
          </Button>
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
          {preview.length > 0 && (
            <div className="overflow-auto rounded-md border text-xs">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-3 py-1.5 text-left">Nama</th>
                    <th className="px-3 py-1.5 text-left">Nomor</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-1.5">{r.name ?? '—'}</td>
                      <td className="px-3 py-1.5 font-mono">{r.number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {file && (
                <p className="text-muted-foreground px-3 py-1.5">
                  Menampilkan 5 baris pertama dari file
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            disabled={!file || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? 'Mengimpor...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ContactsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const dSearch = useDebounce(search)
  const { page, setPage, reset } = usePagination()
  const [addOpen, setAddOpen] = useState(false)
  const [editContact, setEditContact] = useState<Contact | null>(null)
  const [noteContact, setNoteContact] = useState<Contact | null>(null)
  const [importOpen, setImportOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Contact[]>([])

  const { data, isLoading } = useQuery({
    queryKey: QK.CONTACTS({ search: dSearch, page }),
    queryFn: () => contactsApi.list({ search: dSearch, page }),
  })

  const deleteMut = useMutation({
    mutationFn: () => contactsApi.delete(deleteId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.CONTACTS() })
      toast.success('Kontak dihapus')
      setDeleteId(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const bulkDeleteMut = useMutation({
    mutationFn: () => contactsApi.bulkDelete(selected.map((c) => c.id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.CONTACTS() })
      toast.success(`${selected.length} kontak dihapus`)
      setSelected([])
    },
    onError: (e) => toast.error(parseApiError(e)),
  })
  const exportFn = async () => {
    const blob = await contactsApi.exportCsv()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contacts.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const cols: ColumnDef<Contact>[] = [
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
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
      accessorKey: 'tags',
      header: 'Tag',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'note',
      header: 'Catatan',
      cell: ({ row }) => (
        <TierGate
          feature="customer_note"
          fallback={<span className="text-muted-foreground text-xs">—</span>}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => setNoteContact(row.original)}
          >
            <FileText className="h-3 w-3" />
            {row.original.note ? 'Lihat' : 'Tambah'}
          </Button>
        </TierGate>
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
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setEditContact(row.original)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-red-500 hover:text-red-500"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kontak"
        description="Kelola phonebook untuk broadcast dan drip campaign"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportFn}>
              <Download className="mr-2 h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportOpen(true)}
            >
              <Upload className="mr-2 h-3.5 w-3.5" />
              Import CSV
            </Button>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              Tambah
            </Button>
          </div>
        }
      />

      {selected.length > 0 && (
        <div className="bg-muted/50 flex items-center gap-3 rounded-lg border px-4 py-2">
          <span className="text-sm font-medium">
            {selected.length} kontak dipilih
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => bulkDeleteMut.mutate()}
            disabled={bulkDeleteMut.isPending}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Hapus Terpilih
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Cari nama atau nomor..."
          onSearch={(v) => {
            setSearch(v)
            reset()
          }}
          className="w-64"
        />
      </div>

      <DataTable
        columns={cols}
        data={data?.data ?? []}
        isLoading={isLoading}
        emptyTitle="Belum ada kontak"
        emptyDescription="Tambah kontak secara manual atau import dari CSV"
        onRowSelectionChange={setSelected}
        pageCount={data?.meta.totalPages}
        page={page}
        onPageChange={setPage}
      />

      <ContactFormDialog open={addOpen} onClose={() => setAddOpen(false)} />
      {editContact && (
        <ContactFormDialog
          open
          onClose={() => setEditContact(null)}
          existing={editContact}
        />
      )}
      {noteContact && (
        <NoteDialog
          contact={noteContact}
          open
          onClose={() => setNoteContact(null)}
        />
      )}
      <ImportCsvDialog open={importOpen} onClose={() => setImportOpen(false)} />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Hapus Kontak"
        description="Kontak akan dihapus permanen."
        confirmLabel="Hapus"
        onConfirm={() => deleteMut.mutate()}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
