// ─────────────────────────────────────────────────────────────────────────────
// src/app/(dashboard)/layout.tsx
import { AuthProvider } from '@/providers/auth-provider'
import { SocketProvider } from '@/providers/socket-provider'
import { AppShell } from '@/components/layout/app-shell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppShell>{children}</AppShell>
      </SocketProvider>
    </AuthProvider>
  )
}
