// src/components/session/session-status-badge.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { SessionStatus } from '@/types/session'

const cfg: Record<SessionStatus, { label: string; className: string }> = {
  connected: {
    label: 'Terhubung',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  authenticating: {
    label: 'Autentikasi',
    className:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  disconnected: {
    label: 'Terputus',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
  logged_out: {
    label: 'Logout',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

interface Props {
  status: SessionStatus
  className?: string
}
export function SessionStatusBadge({ status, className }: Props) {
  const { label, className: colorCls } = cfg[status] ?? cfg.disconnected
  return (
    <Badge
      variant="outline"
      className={cn('border-0 text-xs font-medium', colorCls, className)}
    >
      <span
        className={cn(
          'mr-1.5 inline-block h-1.5 w-1.5 rounded-full',
          status === 'connected'
            ? 'bg-green-500'
            : status === 'authenticating'
              ? 'bg-yellow-500'
              : status === 'logged_out'
                ? 'bg-red-500'
                : 'bg-gray-400'
        )}
      />
      {label}
    </Badge>
  )
}
