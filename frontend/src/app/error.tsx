// ─────────────────────────────────────────────────────────────────────────────
// src/app/error.tsx
'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <div className="bg-destructive/10 rounded-full p-6">
        <AlertTriangle className="text-destructive h-10 w-10" />
      </div>
      <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
      <p className="text-muted-foreground max-w-md text-sm">{error.message}</p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  )
}
