import { create } from 'zustand'

export type SessionStatus = 'disconnected' | 'authenticating' | 'connected' | 'logged_out'

interface SessionState {
  activeQr: { sessionId: string; qr: string } | null
  activePairing: { sessionId: string; code: string } | null
  sessionStatuses: Record<string, SessionStatus>
  setActiveQr: (data: { sessionId: string; qr: string } | null) => void
  setActivePairing: (data: { sessionId: string; code: string } | null) => void
  updateStatus: (sessionId: string, status: SessionStatus) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  activeQr: null,
  activePairing: null,
  sessionStatuses: {},
  setActiveQr: (activeQr) => set({ activeQr }),
  setActivePairing: (activePairing) => set({ activePairing }),
  updateStatus: (sessionId, status) =>
    set((s) => ({ sessionStatuses: { ...s.sessionStatuses, [sessionId]: status } })),
}))
