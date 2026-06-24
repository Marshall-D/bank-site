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
import type {
  CustomerAccountSummary,
  CustomerApplicationSummary,
  CustomerMeResponse,
  CustomerUser,
} from '@/lib/auth/types'

type CustomerAuthContextValue = {
  user: CustomerUser | null
  application: CustomerApplicationSummary | null
  accounts: CustomerAccountSummary[]
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null)

async function loadCustomerMe(accessToken: string): Promise<CustomerMeResponse> {
  return fetchCustomerMe(accessToken)
}

async function bootstrapCustomerSession(): Promise<{
  token: string
  me: CustomerMeResponse
} | null> {
  let accessToken = getCustomerToken()
  if (!accessToken) {
    return null
  }

  try {
    const me = await loadCustomerMe(accessToken)
    return { token: accessToken, me }
  } catch {
    const refreshedToken = await tryRefreshCustomerSession()
    if (!refreshedToken) {
      clearCustomerTokens()
      return null
    }

    accessToken = refreshedToken
    const me = await loadCustomerMe(accessToken)
    return { token: accessToken, me }
  }
}

function applyMeState(
  me: CustomerMeResponse,
  setUser: (user: CustomerUser) => void,
  setApplication: (application: CustomerApplicationSummary | null) => void,
  setAccounts: (accounts: CustomerAccountSummary[]) => void
) {
  setUser(me.user)
  setApplication(me.application)
  setAccounts(me.accounts)
}

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<CustomerUser | null>(null)
  const [application, setApplication] = useState<CustomerApplicationSummary | null>(null)
  const [accounts, setAccounts] = useState<CustomerAccountSummary[]>([])
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      try {
        const session = await bootstrapCustomerSession()
        if (!cancelled && session) {
          setTokenState(session.token)
          applyMeState(session.me, setUser, setApplication, setAccounts)
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

    const me = await loadCustomerMe(result.token)
    applyMeState(me, setUser, setApplication, setAccounts)
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
    setApplication(null)
    setAccounts([])
    router.replace('/login')
  }, [router])

  const value = useMemo(
    () => ({ user, application, accounts, token, isLoading, login, logout }),
    [user, application, accounts, token, isLoading, login, logout]
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
