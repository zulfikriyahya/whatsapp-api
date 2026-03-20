// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/export-pdf-button.tsx
'use client'
import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  onExport: () => Promise<Blob>
  filename?: string
  className?: string
}
export function ExportPdfButton({
  onExport,
  filename = 'export.pdf',
  className,
}: Props) {
  const [loading, setLoading] = useState(false)
  const handle = async () => {
    setLoading(true)
    try {
      const blob = await onExport()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Gagal mengunduh PDF')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handle}
      disabled={loading}
      className={className}
    >
      <FileDown className="mr-2 h-4 w-4" />
      {loading ? 'Mengunduh...' : 'Export PDF'}
    </Button>
  )
}
