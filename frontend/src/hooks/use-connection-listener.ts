import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket } from '@/lib/socket'
import { SOCKET_EVENTS } from '@/constants/socket-events'
import { useSessionStore } from '@/store/session.store'
import { QK } from '@/constants/query-keys'
import type { ConnectionUpdatePayload } from '@/types/socket'

export function useConnectionListener() {
  const updateStatus = useSessionStore((s) => s.updateStatus)
  const qc = useQueryClient()
  useEffect(() => {
    const socket = getSocket()
    const handler = (data: ConnectionUpdatePayload) => {
      updateStatus(data.sessionId, data.status)
      qc.invalidateQueries({ queryKey: QK.SESSIONS })
    }
    socket.on(SOCKET_EVENTS.CONNECTION_UPDATE, handler)
    return () => {
      socket.off(SOCKET_EVENTS.CONNECTION_UPDATE, handler)
    }
  }, [updateStatus, qc])
}
