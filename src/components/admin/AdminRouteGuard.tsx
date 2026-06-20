'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAdminAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/admin/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading admin session...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
