// ─────────────────────────────────────────────────────────────────────────────
// src/components/inbox/conversation-item.tsx
'use client'
import { cn, formatRelative, truncate } from '@/lib/utils'
import type { Conversation } from '@/types/inbox'
import { UnreadBadge } from './unread-badge'

interface Props {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}
export function ConversationItem({
  conversation: c,
  isActive,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'hover:bg-muted/50 w-full px-4 py-3 text-left transition-colors',
        isActive && 'bg-muted'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate text-sm',
              c.unreadCount > 0 ? 'font-semibold' : 'font-medium'
            )}
          >
            {c.name ?? c.phoneNumber}
          </p>
          {c.lastMessage && (
            <p className="text-muted-foreground mt-0.5 truncate text-xs">
              {truncate(c.lastMessage, 40)}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {c.lastMessageAt && (
            <span className="text-muted-foreground text-[10px]">
              {formatRelative(c.lastMessageAt)}
            </span>
          )}
          <UnreadBadge count={c.unreadCount} />
        </div>
      </div>
    </button>
  )
}
