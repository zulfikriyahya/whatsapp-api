// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/copy-button.tsx
'use client'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { Check, Copy } from 'lucide-react'

interface Props {
  text: string
  className?: string
}
export function CopyButton({ text, className }: Props) {
  const { copied, copy } = useCopyToClipboard()
  return (
    <Button
      size="icon"
      variant="ghost"
      className={className}
      onClick={() => copy(text)}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}
