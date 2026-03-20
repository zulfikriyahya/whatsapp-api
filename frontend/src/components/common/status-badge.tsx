// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/status-badge.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const COLOR_MAP: Record<string, string> = {
  connected:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  active:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  success:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  completed:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  sent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  authenticating:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  disconnected: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  processing:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  logged_out: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const LABEL_MAP: Record<string, string> = {
  connected: 'Terhubung',
  disconnected: 'Terputus',
  authenticating: 'Autentikasi',
  logged_out: 'Logout',
  pending: 'Menunggu',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  success: 'Berhasil',
  failed: 'Gagal',
  sent: 'Terkirim',
  active: 'Aktif',
  inactive: 'Nonaktif',
}

interface Props {
  status: string
  label?: string
  className?: string
}
export function StatusBadge({ status, label, className }: Props) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0 text-xs font-medium',
        COLOR_MAP[status] ?? 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {label ?? LABEL_MAP[status] ?? status}
    </Badge>
  )
}
