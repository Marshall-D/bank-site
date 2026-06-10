import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { DashboardNavProvider } from '@/components/layout/dashboard-nav'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardNavProvider>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </DashboardNavProvider>
  )
}
