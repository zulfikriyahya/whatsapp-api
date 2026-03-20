// src/hooks/use-session-status.ts
import { useSessionStore } from '@/store/session.store'
import type { SessionStatus } from '@/store/session.store'
export function useSessionStatus(sessionId: string): SessionStatus {
  return useSessionStore((s) => s.sessionStatuses[sessionId] ?? 'disconnected')
}
