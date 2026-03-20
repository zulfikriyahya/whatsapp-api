// ─────────────────────────────────────────────────────────────────────────────
// src/components/common/search-input.tsx
'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  placeholder?: string
  onSearch: (value: string) => void
  className?: string
}
export function SearchInput({
  placeholder = 'Cari...',
  onSearch,
  className,
}: Props) {
  const [value, setValue] = useState('')
  const debounced = useDebounce(value)
  useEffect(() => {
    onSearch(debounced)
  }, [debounced, onSearch])
  return (
    <div className={cn('relative', className)}>
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pr-9 pl-9"
      />
      {value && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
          onClick={() => setValue('')}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
