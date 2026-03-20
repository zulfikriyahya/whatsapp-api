export type CampaignStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'

export interface Campaign {
  id: string
  name: string
  message: string
  totalRecipients: number
  successCount: number
  failedCount: number
  status: CampaignStatus
  sessionId?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateBroadcastPayload {
  name: string
  message: string
  sessionId?: string
  recipients?: string[]
  tags?: string[]
  attachment?: File
}

export interface BroadcastRecipient {
  name?: string
  number: string
  tag?: string
}
