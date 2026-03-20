import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { SOCKET_EVENTS } from '@/constants/socket-events'
import { useSessionStore } from '@/store/session.store'
import type { CodePayload } from '@/types/socket'

export function usePairingListener() {
  const setActivePairing = useSessionStore((s) => s.setActivePairing)
  useEffect(() => {
    const socket = getSocket()
    const handler = (data: CodePayload) => setActivePairing(data)
    socket.on(SOCKET_EVENTS.CODE, handler)
    return () => {
      socket.off(SOCKET_EVENTS.CODE, handler)
    }
  }, [setActivePairing])
}
