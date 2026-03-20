import { useEffect } from 'react'
import { toast } from 'sonner'
import { getSocket } from '@/lib/socket'
import { SOCKET_EVENTS, SYSTEM_ALERT_TYPES } from '@/constants/socket-events'
import { useNotificationStore } from '@/store/notification.store'
import { useAuthStore } from '@/store/auth.store'
import type { SystemAlertPayload } from '@/types/socket'

export function useSystemAlerts() {
  const add = useNotificationStore((s) => s.add)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  useEffect(() => {
    const socket = getSocket()
    const handler = (data: SystemAlertPayload) => {
      add({ type: data.type, message: data.message, data: data.data })
      const t = data.type
      const SA = SYSTEM_ALERT_TYPES
      if (t === SA.QUOTA_WARNING) toast.warning(data.message)
      else if (t === SA.QUOTA_EXCEEDED) toast.error(data.message)
      else if (t === SA.SESSION_DISCONNECTED) toast.warning(data.message)
      else if (t === SA.SESSION_LOGGED_OUT) toast.error(data.message)
      else if (t === SA.ALL_SESSIONS_DOWN) toast.error(data.message)
      else if (t === SA.AI_DISABLED) toast.warning(data.message)
      else if (t === SA.ANNOUNCEMENT) toast.info(data.message)
      else if (isAdmin()) {
        if (t === SA.DISK_WARNING) toast.warning(data.message)
        else if (t === SA.REDIS_DISCONNECTED) toast.error(data.message)
      }
    }
    socket.on(SOCKET_EVENTS.SYSTEM_ALERT, handler)
    return () => {
      socket.off(SOCKET_EVENTS.SYSTEM_ALERT, handler)
    }
  }, [add, isAdmin])
}
