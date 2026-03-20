export interface InboxMessage {
  id: string
  jid: string
  sessionId: string
  from: string
  body: string
  type: string
  mediaUrl?: string
  isRead: boolean
  timestamp: string
  quotedMessageId?: string
}

export interface Conversation {
  jid: string
  name?: string
  phoneNumber: string
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
  sessionId: string
}

export interface ReplyPayload {
  message: string
  quotedMessageId?: string
}

export interface InboxFilter {
  unreadOnly?: boolean
  page?: number
  limit?: number
}
