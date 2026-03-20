// src/components/common/stats-card.tsx
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: { value: number; label?: string }
  className?: string
}
export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: Props) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {trend && (
            <p
              className={cn(
                'mt-1 text-xs',
                trend.value >= 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className="bg-primary/10 rounded-full p-3">
            <Icon className="text-primary h-5 w-5" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
