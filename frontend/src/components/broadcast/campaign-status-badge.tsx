// src/components/broadcast/campaign-status-badge.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CampaignStatus } from '@/types/broadcast'
const cfg: Record<CampaignStatus, { label: string; className: string }> = {
  pending: {
    label: 'Menunggu',
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
  processing: {
    label: 'Diproses',
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  completed: {
    label: 'Selesai',
    className:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  cancelled: {
    label: 'Dibatal',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}
export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const c = cfg[status] ?? cfg.pending
  return (
    <Badge
      variant="outline"
      className={cn('border-0 text-xs font-medium', c.className)}
    >
      {c.label}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// src/components/broadcast/broadcast-stats-cards.tsx
import { StatsCard } from '@/components/common/stats-card'
import { Users, CheckCircle, XCircle } from 'lucide-react'
import type { Campaign } from '@/types/broadcast'
interface Props {
  campaign: Campaign
}
export function BroadcastStatsCards({ campaign: c }: Props) {
  const successPct =
    c.totalRecipients > 0
      ? Math.round((c.successCount / c.totalRecipients) * 100)
      : 0
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatsCard
        label="Total Penerima"
        value={c.totalRecipients.toLocaleString()}
        icon={Users}
      />
      <StatsCard
        label="Berhasil"
        value={`${c.successCount.toLocaleString()} (${successPct}%)`}
        icon={CheckCircle}
      />
      <StatsCard
        label="Gagal"
        value={c.failedCount.toLocaleString()}
        icon={XCircle}
      />
    </div>
  )
}
