'use client'
import { createContext, useContext, useEffect, useRef } from 'react'
import type { Socket } from 'socket.io-client'
import { getSocket, disconnectSocket } from '@/lib/socket'
import { useAuthStore } from '@/store/auth.store'
import { useQrListener } from '@/hooks/use-qr-listener'
import { usePairingListener } from '@/hooks/use-pairing-listener'
import { useConnectionListener } from '@/hooks/use-connection-listener'
import { useBroadcastProgress } from '@/hooks/use-broadcast-progress'
import { useInboxRealtime } from '@/hooks/use-inbox-realtime'
import { useSystemAlerts } from '@/hooks/use-system-alerts'
import { useIncomingCall } from '@/hooks/use-incoming-call'

const SocketContext = createContext<Socket | null>(null)

export function useSocket() {
  return useContext(SocketContext)
}

function SocketListeners() {
  useQrListener()
  usePairingListener()
  useConnectionListener()
  useBroadcastProgress()
  useInboxRealtime()
  useSystemAlerts()
  useIncomingCall()
  return null
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!user) return
    const socket = getSocket()
    socketRef.current = socket
    socket.connect()
    return () => {
      disconnectSocket()
    }
  }, [user])

  return (
    <SocketContext.Provider value={socketRef.current}>
      {user && <SocketListeners />}
      {children}
    </SocketContext.Provider>
  )
}
