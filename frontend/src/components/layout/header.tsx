// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/header.tsx
'use client'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store/ui.store'
import { Menu } from 'lucide-react'
import { Breadcrumb } from './breadcrumb'
import { NotificationBell } from './notification-bell'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

export function Header() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  return (
    <header className="bg-background flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>
      <div className="min-w-0 flex-1">
        <Breadcrumb />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
