// src/components/common/loading-spinner.tsx
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
export function LoadingSpinner({ size = 'md', className }: Props) {
  const sz = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-5 w-5'
  return (
    <Loader2
      className={cn(sz, 'text-muted-foreground animate-spin', className)}
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex h-full min-h-64 items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
