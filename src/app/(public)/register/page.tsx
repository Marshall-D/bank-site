'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Logo } from '@/components/brand/Logo'
import { BRAND_NAME } from '@/lib/brand'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  })

  const passwordStrength = {
    hasLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*]/.test(formData.password),
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreeToTerms) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful registration - redirect to login
    router.push('/login')
  }

  const isFormValid = formData.fullName && formData.email && formData.password && formData.agreeToTerms

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted">
      <Logo size="lg" className="mb-8 max-w-[min(100%,54rem)]" />
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Create account</CardTitle>
          <CardDescription>
            Join {BRAND_NAME} and start managing your finances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
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
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-medium text-muted-foreground">Password strength:</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`h-3 w-3 ${
                          passwordStrength.hasLength ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <span className={passwordStrength.hasLength ? 'text-foreground' : 'text-muted-foreground'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`h-3 w-3 ${
                          passwordStrength.hasNumber ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <span className={passwordStrength.hasNumber ? 'text-foreground' : 'text-muted-foreground'}>
                        Contains a number
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`h-3 w-3 ${
                          passwordStrength.hasSpecial ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <span className={passwordStrength.hasSpecial ? 'text-foreground' : 'text-muted-foreground'}>
                        Contains special character (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                }
                disabled={isLoading}
              />
              <Label htmlFor="agreeToTerms" className="font-normal cursor-pointer text-sm">
                I agree to the{' '}
                <Link href="/" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isFormValid}
              size="lg"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
