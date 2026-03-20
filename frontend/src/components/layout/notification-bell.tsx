// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/notification-bell.tsx
'use client'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatRelative } from '@/lib/utils'
import { useNotificationStore } from '@/store/notification.store'
import { Bell } from 'lucide-react'

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, clear } =
    useNotificationStore()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifikasi</p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={markAllRead}
            >
              Tandai semua
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={clear}
            >
              Hapus
            </Button>
          </div>
        </div>
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <div className="text-muted-foreground flex items-center justify-center py-10 text-sm">
              Tidak ada notifikasi
            </div>
          ) : (
            notifications.slice(0, 10).map((n) => (
              <button
                key={n.id}
                className={cn(
                  'hover:bg-muted w-full px-4 py-3 text-left text-sm transition-colors',
                  !n.read && 'bg-blue-50/50 dark:bg-blue-900/10'
                )}
                onClick={() => markRead(n.id)}
              >
                <p className={cn('leading-snug', !n.read && 'font-medium')}>
                  {n.message}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {formatRelative(n.timestamp)}
                </p>
              </button>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
