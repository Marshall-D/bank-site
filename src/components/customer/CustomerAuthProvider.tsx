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
import { fetchCustomerMe, loginCustomer, logoutCustomerSession, revokeCustomerSession } from '@/lib/auth/api'
import { tryRefreshCustomerSession } from '@/lib/auth/session'
import { clearCustomerTokens, getCustomerRefreshToken, getCustomerToken, setCustomerTokens } from '@/lib/auth/storage'
import type { CustomerUser } from '@/lib/auth/types'

type CustomerAuthContextValue = {
  user: CustomerUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null)

async function bootstrapCustomerSession(): Promise<{
  token: string
  user: CustomerUser
} | null> {
  let accessToken = getCustomerToken()
  if (!accessToken) {
    return null
  }

  try {
    const { user } = await fetchCustomerMe(accessToken)
    return { token: accessToken, user }
  } catch {
    const refreshedToken = await tryRefreshCustomerSession()
    if (!refreshedToken) {
      clearCustomerTokens()
      return null
    }

    accessToken = refreshedToken
    const { user } = await fetchCustomerMe(accessToken)
    return { token: accessToken, user }
  }
}

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      try {
        const session = await bootstrapCustomerSession()
        if (!cancelled && session) {
          setTokenState(session.token)
          setUser(session.user)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadSession()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginCustomer({ email, password })
    setCustomerTokens(result.token, result.refreshToken)
    setTokenState(result.token)
    setUser(result.user)
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = getCustomerRefreshToken()

    if (refreshToken) {
      try {
        await logoutCustomerSession({ refreshToken })
      } catch {
        try {
          await revokeCustomerSession({ refreshToken })
        } catch {
          // Best-effort server revoke.
        }
      }
    }

    clearCustomerTokens()
    setTokenState(null)
    setUser(null)
    router.replace('/login')
  }, [router])

  const value = useMemo(
    () => ({ user, token, isLoading, login, logout }),
    [user, token, isLoading, login, logout]
  )

  return (
    <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext)
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider')
  }
  return context
}

export function useOptionalCustomerAuth() {
  return useContext(CustomerAuthContext)
}
