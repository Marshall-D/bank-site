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
import {
  clearCustomerTokens,
  getCustomerToken,
  setCustomerAccessToken,
} from '@/lib/auth/storage'
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
  establishSession: (auth: { token: string }) => Promise<void>
  logout: () => Promise<void>
  /** Re-fetch /me with the current access token. Does not renew expiry. */
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
  const accessToken = getCustomerToken()
  if (!accessToken) {
    return null
  }

  try {
    const me = await loadCustomerMe(accessToken)
    return { token: accessToken, me }
  } catch {
    // Access JWT expired or invalid — match admin: clear and require login.
    clearCustomerTokens()
    return null
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

function clearLocalAuthState(
  setTokenState: (token: string | null) => void,
  setUser: (user: CustomerUser | null) => void,
  setApplication: (application: CustomerApplicationSummary | null) => void,
  setAccounts: (accounts: CustomerAccountSummary[]) => void
) {
  clearCustomerTokens()
  setTokenState(null)
  setUser(null)
  setApplication(null)
  setAccounts([])
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

  const establishSession = useCallback(async (auth: { token: string }) => {
    setCustomerAccessToken(auth.token)
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

      await establishSession({ token: (result as { token: string }).token })
    },
    [establishSession]
  )

  const logout = useCallback(async () => {
    clearLocalAuthState(setTokenState, setUser, setApplication, setAccounts)
    router.replace('/login')
  }, [router])

  const refreshSession = useCallback(async () => {
    const accessToken = getCustomerToken()
    if (!accessToken) return null

    try {
      const me = await loadCustomerMe(accessToken)
      applyMeState(me, setUser, setApplication, setAccounts)
      return accessToken
    } catch {
      clearLocalAuthState(setTokenState, setUser, setApplication, setAccounts)
      return null
    }
  }, [])

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
