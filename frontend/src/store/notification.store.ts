import { create } from 'zustand'

export interface AppNotification {
  id: string
  type: string
  message: string
  data?: unknown
  timestamp: Date
  read: boolean
}

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: number
  add: (n: Pick<AppNotification, 'type' | 'message' | 'data'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clear: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  add: (n) => {
    const notif: AppNotification = {
      ...n, id: crypto.randomUUID(), timestamp: new Date(), read: false,
    }
    set((s) => ({
      notifications: [notif, ...s.notifications].slice(0, 50),
      unreadCount: s.unreadCount + 1,
    }))
  },
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })), unreadCount: 0 })),
  clear: () => set({ notifications: [], unreadCount: 0 }),
}))
