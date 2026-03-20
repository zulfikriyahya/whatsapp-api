// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/error-boundary.tsx
'use client'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import React from 'react'

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  constructor(props: {
    children: React.ReactNode
    fallback?: React.ReactNode
  }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center">
          <div className="bg-destructive/10 rounded-full p-3">
            <AlertTriangle className="text-destructive h-6 w-6" />
          </div>
          <p className="text-sm font-medium">Terjadi kesalahan</p>
          <p className="text-muted-foreground max-w-xs text-xs">
            {this.state.error?.message}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
          >
            Coba Lagi
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
