'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { inboxApi } from '@/api/inbox.api'
import { QK } from '@/constants/query-keys'
import { useInboxStore } from '@/store/inbox.store'
import { ConversationList } from '@/components/inbox/conversation-list'
import { MessageThread } from '@/components/inbox/message-thread'
import { MessageSquare } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function InboxPage() {
  const params = useSearchParams()
  const router = useRouter()
  const isMobile = useIsMobile()
  const reset = useInboxStore((s) => s.reset)

  const [activeJid, setActiveJid] = useState<string | null>(params.get('jid'))

  // Reset unread count when on inbox page
  useEffect(() => {
    reset()
  }, [reset])

  // Fetch conversations to get active conversation name
  const { data: conversations = [] } = useQuery({
    queryKey: QK.CONVERSATIONS,
    queryFn: () => inboxApi.getConversations(false),
  })
  const activeConversation = conversations.find((c) => c.jid === activeJid)

  const selectJid = (jid: string) => {
    setActiveJid(jid)
    router.replace(`/inbox?jid=${jid}`, { scroll: false })
  }

  // Mobile: show thread if a jid is selected, else show list
  if (isMobile) {
    return (
      <div className="h-[calc(100vh-7rem)]">
        {activeJid ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={() => setActiveJid(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="truncate text-sm font-medium">
                {activeConversation?.name ??
                  activeConversation?.phoneNumber ??
                  activeJid}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <MessageThread
                jid={activeJid}
                conversationName={activeConversation?.name}
              />
            </div>
          </div>
        ) : (
          <ConversationList activeJid={activeJid} onSelect={selectJid} />
        )}
      </div>
    )
  }

  // Desktop: 2-column layout
  return (
    <div className="bg-background -m-6 flex h-[calc(100vh-7rem)] overflow-hidden rounded-xl border shadow-sm">
      {/* Left: conversation list */}
      <div className="w-80 shrink-0 overflow-hidden">
        <ConversationList activeJid={activeJid} onSelect={selectJid} />
      </div>

      {/* Right: message thread */}
      <div className="flex-1 overflow-hidden">
        {activeJid ? (
          <MessageThread
            jid={activeJid}
            conversationName={activeConversation?.name}
          />
        ) : (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3">
            <div className="bg-muted rounded-full p-5">
              <MessageSquare className="h-8 w-8" />
            </div>
            <p className="font-medium">Pilih percakapan</p>
            <p className="text-sm">
              Klik salah satu percakapan di sebelah kiri untuk memulai
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
