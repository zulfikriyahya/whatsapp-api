// ─────────────────────────────────────────────────────────────────────────────
// src/components/inbox/inbox-filters.tsx
'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  unreadOnly: boolean
  onToggle: (v: boolean) => void
}
export function InboxFilters({ unreadOnly, onToggle }: Props) {
  return (
    <div className="flex gap-1 p-2">
      <Button
        size="sm"
        variant="ghost"
        className={cn('h-7 text-xs', !unreadOnly && 'bg-muted')}
        onClick={() => onToggle(false)}
      >
        Semua
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className={cn('h-7 text-xs', unreadOnly && 'bg-muted')}
        onClick={() => onToggle(true)}
      >
        Belum Dibaca
      </Button>
    </div>
  )
}
