// src/app/(auth)/layout.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Login' }
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      {children}
    </div>
  )
}
