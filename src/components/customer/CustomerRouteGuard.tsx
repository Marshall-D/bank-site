'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'

export function CustomerRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useCustomerAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading your session...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
