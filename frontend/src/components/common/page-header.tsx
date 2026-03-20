// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/page-header.tsx
import { cn } from '@/lib/utils'

interface Props {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}
export function PageHeader({ title, description, action, className }: Props) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
