// ─────────────────────────────────────────────────────────────────────────────
// src/components/inbox/message-thread.tsx
'use client'
import { inboxApi } from '@/api/inbox.api'
import { Button } from '@/components/ui/button'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import type { InboxMessage } from '@/types/inbox'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCheck, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { MessageBubble } from './message-bubble'
import { ReplyForm } from './reply-form'

interface Props {
  jid: string
  conversationName?: string
}
export function MessageThread({ jid, conversationName }: Props) {
  const [quotedId, setQuotedId] = useState<string | null>(null)
  const [replyTargetId, setReplyTargetId] = useState<string>('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: QK.INBOX(jid),
    queryFn: () => inboxApi.getMessages(jid),
  })

  const markAllMut = useMutation({
    mutationFn: () => inboxApi.markAllRead(jid),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.CONVERSATIONS }),
    onError: (e) => toast.error(parseApiError(e)),
  })

  // scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data?.data?.length])

  const messages: InboxMessage[] = data?.data ?? []
  // The last message id is used as the reply target (most recent)
  const latestId = messages[messages.length - 1]?.id ?? ''

  const handleReply = (id: string) => {
    setQuotedId(id)
    setReplyTargetId(latestId)
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Thread header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-2.5">
        <div>
          <p className="text-sm font-semibold">{conversationName ?? jid}</p>
          <p className="text-muted-foreground font-mono text-xs">{jid}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 gap-1.5 text-xs"
          onClick={() => markAllMut.mutate()}
          disabled={markAllMut.isPending}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Tandai Semua Dibaca
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-3">
        {messages.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            Belum ada pesan
          </p>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              onReply={() => handleReply(m.id)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply form — always use the latest message id as target */}
      {latestId && (
        <ReplyForm
          messageId={latestId}
          jid={jid}
          quotedMessageId={quotedId}
          onClearQuote={() => setQuotedId(null)}
        />
      )}
    </div>
  )
}
