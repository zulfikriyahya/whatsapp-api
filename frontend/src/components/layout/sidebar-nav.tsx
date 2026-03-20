// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/sidebar-nav.tsx
'use client'
import { NAV_SECTIONS } from '@/constants/nav-items'
import { useAuthStore } from '@/store/auth.store'
import { SidebarNavItem } from './sidebar-nav-item'

interface Props {
  collapsed?: boolean
}
export function SidebarNav({ collapsed }: Props) {
  const { hasFeature, isAdmin } = useAuthStore()
  const admin = isAdmin()
  return (
    <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-2">
      {NAV_SECTIONS.filter((s) => !s.adminOnly || admin).map((section) => {
        const visibleItems = section.items.filter(
          (item) => !item.feature || hasFeature(item.feature)
        )
        if (visibleItems.length === 0) return null
        return (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-muted-foreground/60 mb-1 px-3 text-xs font-semibold tracking-wider uppercase">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {visibleItems.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  {...item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
