import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'
import { SOCKET_EVENTS } from '@/constants/socket-events'
import { useSessionStore } from '@/store/session.store'
import type { QrPayload } from '@/types/socket'

export function useQrListener() {
  const setActiveQr = useSessionStore((s) => s.setActiveQr)
  useEffect(() => {
    const socket = getSocket()
    const handler = (data: QrPayload) => setActiveQr(data)
    socket.on(SOCKET_EVENTS.QR, handler)
    return () => {
      socket.off(SOCKET_EVENTS.QR, handler)
    }
  }, [setActiveQr])
}
