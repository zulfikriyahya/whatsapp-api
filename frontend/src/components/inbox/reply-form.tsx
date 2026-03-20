// ─────────────────────────────────────────────────────────────────────────────
// src/components/inbox/reply-form.tsx
'use client'
import { inboxApi } from '@/api/inbox.api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { QK } from '@/constants/query-keys'
import { parseApiError } from '@/lib/api-error'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  messageId: string
  jid: string
  quotedMessageId?: string | null
  onClearQuote?: () => void
}
export function ReplyForm({
  messageId,
  jid,
  quotedMessageId,
  onClearQuote,
}: Props) {
  const [text, setText] = useState('')
  const qc = useQueryClient()

  const mut = useMutation({
    mutationFn: () =>
      inboxApi.reply(messageId, {
        message: text,
        quotedMessageId: quotedMessageId ?? undefined,
      }),
    onSuccess: () => {
      setText('')
      onClearQuote?.()
      qc.invalidateQueries({ queryKey: QK.INBOX(jid) })
    },
    onError: (e) => toast.error(parseApiError(e)),
  })

  const submit = () => {
    if (text.trim()) mut.mutate()
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="bg-background border-t p-3">
      {quotedMessageId && (
        <div className="bg-muted text-muted-foreground mb-2 flex items-center justify-between rounded-md px-3 py-1.5 text-xs">
          <span>Membalas pesan</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={onClearQuote}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder="Tulis balasan... (Enter untuk kirim)"
          className="max-h-32 min-h-[44px] resize-none"
          rows={1}
        />
        <Button
          size="icon"
          className="h-10 w-10 shrink-0"
          disabled={!text.trim() || mut.isPending}
          onClick={submit}
        >
          <Send className={cn('h-4 w-4', mut.isPending && 'animate-pulse')} />
        </Button>
      </div>
    </div>
  )
}
