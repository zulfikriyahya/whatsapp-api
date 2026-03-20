// ─────────────────────────────────────────────────────────────────────────────
// src/components/layout/breadcrumb.tsx
'use client'
import { ROUTE_LABELS } from '@/constants/routes'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    // skip UUIDs
    const isId = /^[0-9a-f-]{8,}$/i.test(seg) || seg.length > 20
    const label = ROUTE_LABELS[seg] ?? (isId ? 'Detail' : seg)
    return { href, label, isLast: i === segments.length - 1 }
  })

  if (crumbs.length <= 1) return null

  return (
    <nav className="text-muted-foreground flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
