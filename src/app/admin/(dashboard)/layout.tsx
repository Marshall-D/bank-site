import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { DashboardNavProvider } from '@/components/layout/dashboard-nav'
import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider'
import { AdminRouteGuard } from '@/components/admin/AdminRouteGuard'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <AdminRouteGuard>
        <DashboardNavProvider>
          <div className="flex h-screen bg-background">
            <AdminSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <DashboardHeader />
              <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
            </div>
          </div>
        </DashboardNavProvider>
      </AdminRouteGuard>
    </AdminAuthProvider>
  )
}
