'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin, fetchAdminMe } from '@/lib/admin/api'
import { clearAdminToken, getAdminToken, setAdminToken } from '@/lib/admin/storage'
import type { AdminUser } from '@/lib/admin/types'

type AdminAuthContextValue = {
  user: AdminUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const storedToken = getAdminToken()
      if (!storedToken) {
        if (!cancelled) setIsLoading(false)
        return
      }

      try {
        const { user: adminUser } = await fetchAdminMe(storedToken)
        if (!cancelled) {
          setTokenState(storedToken)
          setUser(adminUser)
        }
      } catch {
        clearAdminToken()
        if (!cancelled) {
          setTokenState(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await adminLogin(email, password)
    setAdminToken(result.token)
    setTokenState(result.token)
    setUser(result.user)
  }, [])

  const logout = useCallback(() => {
    clearAdminToken()
    setTokenState(null)
    setUser(null)
    router.replace('/admin/login')
  }, [router])

  const value = useMemo(
    () => ({ user, token, isLoading, login, logout }),
    [user, token, isLoading, login, logout]
  )

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}

export function useOptionalAdminAuth() {
  return useContext(AdminAuthContext)
}
