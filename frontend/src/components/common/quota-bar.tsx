// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/quota-bar.tsx
'use client'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface Props {
  used: number
  limit: number
  label?: string
  className?: string
}
export function QuotaBar({ used, limit, label, className }: Props) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0
  const isWarning = pct >= 80
  const isDanger = pct >= 95
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>{label}</span>
          <span>
            {used.toLocaleString()} / {limit.toLocaleString()}
          </span>
        </div>
      )}
      <Progress
        value={pct}
        className={cn(
          'h-2',
          isDanger && '[&>div]:bg-red-500',
          isWarning && !isDanger && '[&>div]:bg-yellow-500'
        )}
      />
    </div>
  )
}
