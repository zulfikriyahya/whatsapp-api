// src/hooks/use-copy-to-clipboard.ts
import { useState } from 'react'
export function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false)
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), timeout)
  }
  return { copied, copy }
}
