'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/brand/Logo'
import { BRAND_NAME } from '@/lib/brand'
import { CustomerAuthProvider, useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { resendLoginOtp, verifyLoginOtp } from '@/lib/auth/api'
import { getCustomerAuthErrorMessage } from '@/lib/auth/errors'
import type { Login2faChallenge } from '@/lib/auth/types'

function LoginForm() {
  const router = useRouter()
  const { login, establishSession, user, isLoading: authLoading } = useCustomerAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [challenge, setChallenge] = useState<Login2faChallenge | null>(null)
  const [otpCode, setOtpCode] = useState('')
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  const resendSeconds =
    resendAvailableAt != null ? Math.max(0, Math.ceil((resendAvailableAt - now) / 1000)) : 0

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (resendSeconds <= 0) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [resendSeconds])

  if (!authLoading && user) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(formData.email, formData.password)
      router.replace('/dashboard')
    } catch (err) {
      if (
        err instanceof Error &&
        err.name === 'TwoFactorRequired' &&
        'challenge' in err
      ) {
        const next = (err as Error & { challenge: Login2faChallenge }).challenge
        setChallenge(next)
        setResendAvailableAt(
          next.resendAvailableAt ? new Date(next.resendAvailableAt).getTime() : null
        )
        setOtpCode('')
        setError(null)
      } else {
        setError(getCustomerAuthErrorMessage(err))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!challenge) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await verifyLoginOtp({
        loginChallengeId: challenge.loginChallengeId,
        code: otpCode,
      })
      await establishSession({ token: result.token })
      router.replace('/dashboard')
    } catch (err) {
      setError(getCustomerAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!challenge) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await resendLoginOtp({
        loginChallengeId: challenge.loginChallengeId,
      })
      setChallenge({
        requires2fa: true,
        loginChallengeId: result.loginChallengeId,
        expiresAt: result.expiresAt,
        resendAvailableAt: result.resendAvailableAt,
      })
      setResendAvailableAt(new Date(result.resendAvailableAt).getTime())
    } catch (err) {
      setError(getCustomerAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-light/10 via-background to-muted px-4 py-12">
      <Logo size="lg" className="mb-8 max-w-[min(100%,54rem)]" />
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">
            {challenge ? 'Enter sign-in code' : 'Welcome back'}
          </CardTitle>
          <CardDescription>
            {challenge
              ? `We sent a 6-digit code to ${formData.email}. Enter it to finish signing in.`
              : `Sign in to your ${BRAND_NAME} account to manage your finances`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {challenge ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={isLoading || authLoading}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || authLoading || otpCode.length !== 6}
                size="lg"
              >
                {isLoading ? 'Verifying...' : 'Verify and sign in'}
              </Button>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading || resendSeconds > 0}
                  onClick={handleResendOtp}
                >
                  {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : 'Resend code'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => {
                    setChallenge(null)
                    setOtpCode('')
                    setError(null)
                  }}
                >
                  Back
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading || authLoading}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading || authLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || authLoading}
                size="lg"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          )}

          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Don&apos;t have online banking access?
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/register">Apply for an account</Link>
          </Button>

          <div className="mt-6 text-center">
            <Link
              href="/application/status"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Check application status
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CustomerAuthProvider>
        <LoginForm />
      </CustomerAuthProvider>
    </Suspense>
  )
}
