'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, LogOut, Menu, Settings, User, X } from 'lucide-react'

import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDashboardNav } from '@/components/layout/dashboard-nav'
import { useOptionalAdminAuth } from '@/components/admin/AdminAuthProvider'
import { useOptionalCustomerAuth } from '@/components/customer/CustomerAuthProvider'

export function DashboardHeader() {
  const pathname = usePathname()
  const { isOpen, toggle } = useDashboardNav()
  const adminAuth = useOptionalAdminAuth()
  const customerAuth = useOptionalCustomerAuth()
  const isAdminPortal =
    pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  const logoHref = isAdminPortal ? '/admin' : '/dashboard'
  const displayUser =
    isAdminPortal && adminAuth?.user
      ? adminAuth.user
      : customerAuth?.user ?? { name: 'Customer', email: '' }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-2 px-4 md:gap-4 md:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={toggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <Logo
          size="xs"
          href={logoHref}
          className="shrink-0 max-w-[7.5rem] sm:max-w-[9rem] lg:hidden"
        />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold md:text-lg">
            Welcome back, {displayUser.name}!
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {displayUser.name.charAt(0)}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{displayUser.name}</p>
                <p className="text-xs text-muted-foreground">{displayUser.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdminPortal ? (
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (isAdminPortal && adminAuth?.logout) {
                    void adminAuth.logout()
                  } else if (!isAdminPortal && customerAuth?.logout) {
                    void customerAuth.logout()
                  }
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
