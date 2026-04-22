'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md border-border">
          <CardContent className="pt-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Check your email</h2>
              <p className="text-muted-foreground">
                We&apos;ve sent password reset instructions to{' '}
                <span className="font-semibold text-foreground">{email}</span>
              </p>
              <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground space-y-2">
                <p>Follow the link in the email to reset your password.</p>
                <p>If you don&apos;t see the email, check your spam folder.</p>
              </div>
              <Button className="w-full" asChild>
                <Link href="/login">Back to sign in</Link>
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setIsSubmitted(false)}>
                Try another email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email}
              size="lg"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          {/* Back to Sign In */}
          <div className="mt-6">
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
