// ── Send Media Form ───────────────────────────────────────────────────────────
// src/components/messages/send-media-form.tsx
'use client'
import { messagesApi } from '@/api/messages.api'
import { PhoneInput } from '@/components/common/phone-input'
import { SessionSelector } from '@/components/common/session-selector'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { parseApiError } from '@/lib/api-error'
import { normalizePhone } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { SandboxBadge } from './message-status-badge'

const schema = z.object({
  to: z.string().min(8, 'Nomor tidak valid'),
  caption: z.string().optional(),
  sessionId: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const MAX = 50 * 1024 * 1024
const ALLOWED = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'application/pdf',
]

export function SendMediaForm() {
  const [file, setFile] = useState<File | null>(null)
  const [fileErr, setFileErr] = useState('')
  const [sandbox, setSandbox] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { to: '', caption: '', sessionId: 'auto' },
  })

  const handleFile = (f: File) => {
    setFileErr('')
    if (f.size > MAX) {
      setFileErr('File melebihi 50MB')
      return
    }
    if (!ALLOWED.includes(f.type)) {
      setFileErr('Tipe file tidak diizinkan')
      return
    }
    setFile(f)
  }

  const mut = useMutation({
    mutationFn: (d: FormData) =>
      messagesApi.sendMedia({ ...d, to: normalizePhone(d.to), file: file! }),
    onSuccess: (res) => {
      setSandbox(res.sandbox)
      toast.success('Media berhasil dikirim')
      form.reset()
      setFile(null)
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) => mut.mutate(d))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Tujuan</FormLabel>
              <FormControl>
                <PhoneInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sessionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sesi</FormLabel>
              <FormControl>
                <SessionSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* File drop zone */}
        <div>
          <p className="mb-1.5 text-sm font-medium">File</p>
          {file ? (
            <div className="flex items-center gap-2 rounded-md border p-3 text-sm">
              <span className="flex-1 truncate">{file.name}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setFile(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div
              className="text-muted-foreground hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed py-8 transition-colors"
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault()
                const f = e.dataTransfer.files[0]
                if (f) handleFile(f)
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="h-6 w-6" />
              <p className="text-sm">Klik atau drag & drop file</p>
              <p className="text-xs">Maks. 50MB</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
          {fileErr && <p className="mt-1 text-xs text-red-500">{fileErr}</p>}
        </div>

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption (opsional)</FormLabel>
              <FormControl>
                <Input placeholder="Keterangan media..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {sandbox && <SandboxBadge />}
        <Button
          type="submit"
          disabled={mut.isPending || !file}
          className="w-full"
        >
          {mut.isPending ? 'Mengunggah...' : 'Kirim Media'}
        </Button>
      </form>
    </Form>
  )
}
