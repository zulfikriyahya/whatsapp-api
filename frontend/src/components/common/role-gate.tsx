// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/role-gate.tsx
'use client'
import { useAuthStore } from '@/store/auth.store'
import type { Role } from '@/types/user'

interface Props {
  roles: Role[]
  children: React.ReactNode
}
export function RoleGate({ roles, children }: Props) {
  const role = useAuthStore((s) => s.user?.role)
  if (!role || !roles.includes(role as Role)) return null
  return <>{children}</>
}
