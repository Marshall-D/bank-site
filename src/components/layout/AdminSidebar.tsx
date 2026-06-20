'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileCheck, LayoutDashboard, LogOut, Settings } from 'lucide-react'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { useDashboardNav } from '@/components/layout/dashboard-nav'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'

export function AdminSidebar() {
  const pathname = usePathname()
  const { isOpen, close } = useDashboardNav()
  const { logout } = useAdminAuth()

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/applications', icon: FileCheck, label: 'Applications' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (href: string) =>
    href === '/admin' ? pathname === href : pathname.startsWith(href)

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar transition-transform lg:relative lg:z-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="hidden border-b border-sidebar-border p-6 lg:flex">
            <Logo size="sm" href="/admin" suffix="Admin" className="max-w-full" />
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto p-4 pt-4 lg:pt-0">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => {
                close()
                logout()
              }}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close navigation menu"
          onClick={close}
        />
      )}
    </>
  )
}
