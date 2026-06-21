'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { activateAccount } from '@/lib/auth/api'
import { getCustomerAuthErrorMessage } from '@/lib/auth/errors'
import { setCustomerTokens } from '@/lib/auth/storage'
import { BRAND_NAME } from '@/lib/brand'

function ActivateForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    activationToken: searchParams.get('token') ?? '',
    email: searchParams.get('email') ?? '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      activationToken: searchParams.get('token') ?? prev.activationToken,
      email: searchParams.get('email') ?? prev.email,
    }))
  }, [searchParams])

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
      const result = await activateAccount({
        activationToken: formData.activationToken.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      setCustomerTokens(result.token, result.refreshToken)
      router.replace('/dashboard')
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
          <CardTitle className="text-2xl">Activate online banking</CardTitle>
          <CardDescription>
            Set your password to access your new {BRAND_NAME} account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activationToken">Activation token</Label>
              <Input
                id="activationToken"
                name="activationToken"
                value={formData.activationToken}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="From your approval email"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Until email delivery is enabled, use the token from your bank&apos;s activation
                instructions or support.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading} size="lg">
              {isLoading ? 'Activating account...' : 'Activate account'}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Already activated? Sign in
            </Link>
            <Link href="/application/status" className="text-muted-foreground hover:text-foreground">
              Check application status
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ActivateForm />
    </Suspense>
  )
}
