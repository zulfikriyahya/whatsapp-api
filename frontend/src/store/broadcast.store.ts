import { create } from 'zustand'

export interface BroadcastProgress {
  campaignId: string
  current: number
  total: number
  percentage: number
  successCount: number
  failedCount: number
  done: boolean
}

interface BroadcastState {
  progress: Record<string, BroadcastProgress>
  setProgress: (campaignId: string, data: Omit<BroadcastProgress, 'done'>) => void
  setDone: (campaignId: string, successCount: number, failedCount: number) => void
  clear: (campaignId: string) => void
}

export const useBroadcastStore = create<BroadcastState>((set) => ({
  progress: {},
  setProgress: (campaignId, data) =>
    set((s) => ({ progress: { ...s.progress, [campaignId]: { ...data, done: false } } })),
  setDone: (campaignId, successCount, failedCount) =>
    set((s) => ({
      progress: {
        ...s.progress,
        [campaignId]: { ...s.progress[campaignId], successCount, failedCount, done: true },
      },
    })),
  clear: (campaignId) =>
    set((s) => {
      const { [campaignId]: _, ...rest } = s.progress
      return { progress: rest }
    }),
}))
