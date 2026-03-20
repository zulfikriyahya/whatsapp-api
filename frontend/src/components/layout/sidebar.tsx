// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/sidebar.tsx
'use client'
import { cn } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'
import { SidebarNav } from './sidebar-nav'

interface Props {
  collapsed?: boolean
}
export function Sidebar({ collapsed }: Props) {
  return (
    <aside
      className={cn(
        'bg-background flex h-full flex-col border-r transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b px-4',
          collapsed && 'justify-center px-2'
        )}
      >
        <MessageSquare className="text-primary h-6 w-6 shrink-0" />
        {!collapsed && (
          <span className="ml-2 text-sm font-bold">
            {process.env.NEXT_PUBLIC_APP_NAME ?? 'WA Gateway'}
          </span>
        )}
      </div>
      <SidebarNav collapsed={collapsed} />
    </aside>
  )
}
