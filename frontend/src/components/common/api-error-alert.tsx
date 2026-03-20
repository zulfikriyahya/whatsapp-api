// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/api-error-alert.tsx
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { parseApiError } from '@/lib/api-error'

interface Props {
  error: unknown
  className?: string
}
export function ApiErrorAlert({ error, className }: Props) {
  if (!error) return null
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{parseApiError(error)}</AlertDescription>
    </Alert>
  )
}
