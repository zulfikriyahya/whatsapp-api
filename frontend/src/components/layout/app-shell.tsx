'use client'
import { useUiStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { ImpersonationBanner } from './impersonation-banner'
import { MaintenanceBanner } from './maintenance-banner'
import { QuotaWarningBanner } from './quota-warning-banner'
import { GracePeriodBanner } from '@/components/tiers/grace-period-banner'
import { useIsMobile } from '@/hooks/use-media-query'
import { Sheet, SheetContent } from '@/components/ui/sheet'

interface Props {
  children: React.ReactNode
}

export function AppShell({ children }: Props) {
  const { sidebarOpen, setSidebarOpen } = useUiStore()
  const user = useAuthStore((s) => s.user)
  const isMobile = useIsMobile()

  // Impersonation state from sessionStorage
  const impersonationUser =
    typeof window !== 'undefined'
      ? (() => {
          try {
            return JSON.parse(
              sessionStorage.getItem('impersonation_user') ?? 'null'
            )
          } catch {
            return null
          }
        })()
      : null

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      {!isMobile && <Sidebar collapsed={!sidebarOpen} />}

      {/* Mobile sidebar as Sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-60 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        {/* Contextual banners */}
        {impersonationUser && (
          <ImpersonationBanner
            targetName={impersonationUser.name}
            targetUserId={impersonationUser.id}
          />
        )}
        {(user as any)?.globalSettings?.maintenanceMode && (
          <MaintenanceBanner />
        )}
        <GracePeriodBanner />
        <QuotaWarningBanner />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
