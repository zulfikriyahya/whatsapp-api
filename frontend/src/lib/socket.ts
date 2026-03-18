import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(token?: string): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      withCredentials: true,
      auth: token ? { token } : undefined,
      autoConnect: false,
    })
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
