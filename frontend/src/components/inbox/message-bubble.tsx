// ─────────────────────────────────────────────────────────────────────────────
// src/components/inbox/message-bubble.tsx
'use client'
import { cn, formatDate } from '@/lib/utils'
import type { InboxMessage } from '@/types/inbox'
import { Check } from 'lucide-react'

interface Props {
  message: InboxMessage
  onReply?: (id: string) => void
}
export function MessageBubble({ message: m, onReply }: Props) {
  return (
    <div className="group flex items-end gap-2 px-4 py-1">
      <div
        className={cn(
          'relative max-w-xs rounded-2xl px-3 py-2 text-sm shadow-sm lg:max-w-md',
          'bg-muted text-foreground rounded-bl-sm'
        )}
      >
        {m.body && (
          <p className="leading-relaxed break-words whitespace-pre-wrap">
            {m.body}
          </p>
        )}
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-[10px]">
            {formatDate(m.timestamp)}
          </span>
          {m.isRead && <Check className="text-muted-foreground h-3 w-3" />}
        </div>
        {onReply && (
          <button
            className="bg-muted absolute top-1/2 -right-7 hidden -translate-y-1/2 rounded-full p-1.5 shadow group-hover:flex"
            onClick={() => onReply(m.id)}
            title="Balas"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v6" />
              <path d="M14 21l-4-4 4-4" />
              <path d="M10 17h8" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
