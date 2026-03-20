import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type MsgStatus = 'success' | 'failed' | 'pending'

const cfg: Record<MsgStatus, { label: string; className: string }> = {
  success: {
    label: 'Berhasil',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  failed: {
    label: 'Gagal',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  pending: {
    label: 'Menunggu',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
}

export function MessageStatusBadge({ status }: { status: string }) {
  const c = cfg[status as MsgStatus] ?? cfg.pending
  return (
    <Badge
      variant="outline"
      className={cn('border-0 text-xs font-medium', c.className)}
    >
      {c.label}
    </Badge>
  )
}

export function SandboxBadge() {
  return (
    <Badge
      variant="outline"
      className="border-orange-300 bg-orange-100 text-xs text-orange-700"
    >
      Sandbox — Pesan tidak dikirim
    </Badge>
  )
}
