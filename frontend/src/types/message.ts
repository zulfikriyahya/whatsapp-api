export type MessageStatus = 'pending' | 'success' | 'failed'
export type MessageType =
  | 'text'
  | 'media'
  | 'location'
  | 'live_location'
  | 'poll'
  | 'contact'
  | 'voice_note'

export interface MessageLog {
  id: string
  sessionId: string
  to: string
  type: MessageType
  message?: string
  status: MessageStatus
  sandbox: boolean
  errorMessage?: string
  createdAt: string
}

export interface SendMessagePayload {
  to: string
  message: string
  sessionId?: string
  quotedMessageId?: string
}

export interface SendMediaPayload {
  to: string
  caption?: string
  sessionId?: string
  file: File
}

export interface SendLocationPayload {
  to: string
  latitude: number
  longitude: number
  description?: string
  sessionId?: string
}

export interface SendLiveLocationPayload extends SendLocationPayload {
  duration: number
}

export interface SendPollPayload {
  to: string
  question: string
  options: string[]
  multiselect?: boolean
  sessionId?: string
}

export interface SendContactPayload {
  to: string
  contacts: string[]
  sessionId?: string
}

export interface SendVoiceNotePayload {
  to: string
  file: File
  sessionId?: string
}

export interface SendMessageResponse {
  messageId?: string
  sandbox: boolean
}

export interface CheckNumberResponse {
  exists: boolean
  jid?: string
}

export interface MessageLogsFilter {
  status?: MessageStatus
  sessionId?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}
