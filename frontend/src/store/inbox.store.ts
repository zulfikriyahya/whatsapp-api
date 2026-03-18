import { create } from 'zustand'

interface InboxState {
  unreadTotal: number
  increment: () => void
  reset: () => void
}

export const useInboxStore = create<InboxState>((set) => ({
  unreadTotal: 0,
  increment: () => set((s) => ({ unreadTotal: s.unreadTotal + 1 })),
  reset: () => set({ unreadTotal: 0 }),
}))
