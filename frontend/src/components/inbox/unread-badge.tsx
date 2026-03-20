// src/components/inbox/unread-badge.tsx
import { cn } from '@/lib/utils'
interface Props {
  count: number
  className?: string
}
export function UnreadBadge({ count, className }: Props) {
  if (count <= 0) return null
  return (
    <span
      className={cn(
        'flex h-5 min-w-5 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-white',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
