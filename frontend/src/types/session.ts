export type SessionStatus =
  | 'connected'
  | 'authenticating'
  | 'disconnected'
  | 'logged_out'

export interface Session {
  id: string
  name: string
  phoneNumber?: string
  status: SessionStatus
  isDefault: boolean
  pushname?: string
  platform?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateSessionPayload {
  name: string
  usePairingCode?: boolean
  phoneNumber?: string
}

export interface SessionInfo {
  state: string
  version?: string
  pushname?: string
  platform?: string
  phoneNumber?: string
}
