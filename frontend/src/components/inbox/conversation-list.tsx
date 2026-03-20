// ─────────────────────────────────────────────────────────────────────────────
// src/components/inbox/conversation-list.tsx
'use client'
import { inboxApi } from '@/api/inbox.api'
import { EmptyState } from '@/components/common/empty-state'
import { SearchInput } from '@/components/common/search-input'
import { QK } from '@/constants/query-keys'
import type { Conversation } from '@/types/inbox'
import { useQuery } from '@tanstack/react-query'
import { Inbox, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { ConversationItem } from './conversation-item'
import { InboxFilters } from './inbox-filters'

interface Props {
  activeJid: string | null
  onSelect: (jid: string) => void
}
export function ConversationList({ activeJid, onSelect }: Props) {
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [search, setSearch] = useState('')

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: QK.CONVERSATIONS,
    queryFn: () => inboxApi.getConversations(false),
    refetchInterval: 30_000,
  })

  const filtered = conversations.filter((c: Conversation) => {
    if (unreadOnly && c.unreadCount === 0) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        (c.name ?? '').toLowerCase().includes(q) || c.phoneNumber.includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex h-full flex-col border-r">
      <div className="border-b p-3">
        <SearchInput placeholder="Cari percakapan..." onSearch={setSearch} />
      </div>
      <InboxFilters unreadOnly={unreadOnly} onToggle={setUnreadOnly} />
      <div className="flex-1 divide-y overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Tidak ada percakapan"
            className="py-10"
          />
        ) : (
          filtered.map((c: Conversation) => (
            <ConversationItem
              key={c.jid}
              conversation={c}
              isActive={c.jid === activeJid}
              onClick={() => onSelect(c.jid)}
            />
          ))
        )}
      </div>
    </div>
  )
}
