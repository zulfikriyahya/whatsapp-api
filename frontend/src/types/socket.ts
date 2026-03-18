export interface QrPayload { sessionId: string; qr: string }
export interface CodePayload { sessionId: string; code: string }
export interface ConnectionUpdatePayload {
  sessionId: string
  status: 'connected' | 'disconnected' | 'authenticating' | 'logged_out'
  phoneNumber?: string
}
export interface NewMessagePayload {
  message: { id: string; from: string; body: string; type: string; sessionId: string }
}
export interface MessageAckPayload { sessionId: string; msgId: string; ack: 'sent' | 'delivered' | 'read' }
export interface GroupNotificationPayload { sessionId: string; notification: unknown }
export interface IncomingCallPayload {
  sessionId: string
  call: { id: string; from: string; isVideo: boolean; timestamp: number }
}
export interface BroadcastProgressPayload {
  campaignId: string; current: number; total: number
  percentage: number; successCount: number; failedCount: number
}
export interface BroadcastCompletePayload { campaignId: string; successCount: number; failedCount: number }
export interface SystemAlertPayload { type: string; message: string; data?: unknown }
