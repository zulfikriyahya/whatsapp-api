// src/components/layout/impersonation-banner.tsx
'use client'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { adminApi } from '@/api/admin.api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  targetName: string
  targetUserId: string
}
export function ImpersonationBanner({ targetName, targetUserId }: Props) {
  const router = useRouter()
  const end = async () => {
    try {
      await adminApi.endImpersonate(targetUserId)
      sessionStorage.removeItem('impersonation_token')
      sessionStorage.removeItem('impersonation_user')
      router.push('/admin/users')
      router.refresh()
    } catch {
      toast.error('Gagal mengakhiri impersonation')
    }
  }
  return (
    <div className="flex items-center gap-3 bg-yellow-400 px-4 py-2 text-sm font-medium text-yellow-900">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span className="flex-1">
        Anda sedang melihat akun <strong>{targetName}</strong>
      </span>
      <Button
        size="sm"
        variant="outline"
        className="h-7 border-yellow-700 text-yellow-900 hover:bg-yellow-500"
        onClick={end}
      >
        <X className="mr-1 h-3 w-3" /> Akhiri Sesi
      </Button>
    </div>
  )
}
