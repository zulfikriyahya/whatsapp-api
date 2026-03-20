'use client'
import { forwardRef, type InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { normalizePhone } from '@/lib/utils'

interface Props extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  onChange?: (value: string) => void
}

export const PhoneInput = forwardRef<HTMLInputElement, Props>(
  ({ onChange, onBlur, ...props }, ref) => (
    <Input
      ref={ref}
      placeholder="628xxxxxxxx"
      inputMode="tel"
      {...props}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={(e) => {
        onChange?.(normalizePhone(e.target.value))
        onBlur?.(e)
      }}
    />
  )
)
PhoneInput.displayName = 'PhoneInput'
