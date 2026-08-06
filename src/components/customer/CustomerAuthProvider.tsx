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
  establishSession: (auth: { token: string; refreshToken: string }) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<string | null>
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

  const establishSession = useCallback(async (auth: { token: string; refreshToken: string }) => {
    setCustomerTokens(auth.token, auth.refreshToken)
    setTokenState(auth.token)
    const me = await loadCustomerMe(auth.token)
    applyMeState(me, setUser, setApplication, setAccounts)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginCustomer({ email, password })
      if ('requires2fa' in result && result.requires2fa === true) {
        const error = new Error('TWO_FACTOR_REQUIRED') as Error & {
          challenge: Extract<typeof result, { requires2fa: true }>
        }
        error.name = 'TwoFactorRequired'
        error.challenge = result
        throw error
      }

      const session = result as { token: string; refreshToken: string }
      await establishSession({
        token: session.token,
        refreshToken: session.refreshToken,
      })
    },
    [establishSession]
  )
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

  const refreshSession = useCallback(async () => {
    let accessToken = getCustomerToken()
    if (!accessToken) return null

    try {
      const me = await loadCustomerMe(accessToken)
      applyMeState(me, setUser, setApplication, setAccounts)
      return accessToken
    } catch {
      const refreshedToken = await tryRefreshCustomerSession()
      if (!refreshedToken) return null

      accessToken = refreshedToken
      setTokenState(accessToken)
      const me = await loadCustomerMe(accessToken)
      applyMeState(me, setUser, setApplication, setAccounts)
      return accessToken
    }
  }, [])

  useEffect(() => {
    if (!token) return

    let lastRefreshAt = 0
    const MIN_REFRESH_GAP_MS = 5_000

    const refreshIfStale = () => {
      if (document.visibilityState !== 'visible') return
      const now = Date.now()
      if (now - lastRefreshAt < MIN_REFRESH_GAP_MS) return
      lastRefreshAt = now
      void refreshSession().catch(() => {
        // Keep existing session data if refresh fails.
      })
    }

    const onFocus = () => refreshIfStale()

    document.addEventListener('visibilitychange', refreshIfStale)
    window.addEventListener('focus', onFocus)

    return () => {
      document.removeEventListener('visibilitychange', refreshIfStale)
      window.removeEventListener('focus', onFocus)
    }
  }, [token, refreshSession])

  const value = useMemo(
    () => ({
      user,
      application,
      accounts,
      token,
      isLoading,
      login,
      establishSession,
      logout,
      refreshSession,
    }),
    [user, application, accounts, token, isLoading, login, establishSession, logout, refreshSession]
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
