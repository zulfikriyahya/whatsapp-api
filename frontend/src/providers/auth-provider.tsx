'use client'
import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { PageSkeleton } from '@/components/common/loading-skeleton'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, isLoading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const initialized = useRef(false)

  useEffect(() => {
    // Cegah double-call di React StrictMode / hot reload
    if (initialized.current) return
    initialized.current = true

    const init = async () => {
      try {
        const user = await authApi.me()
        setUser(user)
      } catch (err: any) {
        const status = err?.response?.status
        // Hanya redirect ke login jika 401 (unauthenticated)
        // Jangan redirect jika network error / backend offline
        if (status === 401) {
          setUser(null)
          router.replace('/login')
        } else {
          // Backend offline atau error lain — tetap tampilkan UI
          // agar tidak infinite loop. User bisa retry manual.
          console.warn('Auth check failed (backend offline?):', err?.message)
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) return <PageSkeleton />
  return <>{children}</>
}
