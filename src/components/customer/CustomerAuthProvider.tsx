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
import { fetchCustomerMe, loginCustomer } from '@/lib/auth/api'
import { clearCustomerTokens, getCustomerToken, setCustomerTokens } from '@/lib/auth/storage'
import type { CustomerUser } from '@/lib/auth/types'

type CustomerAuthContextValue = {
  user: CustomerUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null)

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const storedToken = getCustomerToken()
      if (!storedToken) {
        if (!cancelled) setIsLoading(false)
        return
      }

      try {
        const { user: customerUser } = await fetchCustomerMe(storedToken)
        if (!cancelled) {
          setTokenState(storedToken)
          setUser(customerUser)
        }
      } catch {
        clearCustomerTokens()
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
    const result = await loginCustomer({ email, password })
    setCustomerTokens(result.token, result.refreshToken)
    setTokenState(result.token)
    setUser(result.user)
  }, [])

  const logout = useCallback(() => {
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
