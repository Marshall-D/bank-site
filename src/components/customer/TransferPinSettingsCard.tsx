'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'

import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import {
  changeTransferPin,
  getTransferPinErrorMessage,
  setTransferPin,
} from '@/lib/transferPin/api'

const PIN_LENGTH = 6

export function TransferPinSettingsCard() {
  const { user, token, refreshSession } = useCustomerAuth()
  const hasPin = Boolean(user?.hasTransferPin)

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmNewPin, setConfirmNewPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForms = () => {
    setPassword('')
    setShowPassword(false)
    setPin('')
    setConfirmPin('')
    setCurrentPin('')
    setNewPin('')
    setConfirmNewPin('')
  }

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError(null)
    setSuccess(null)

    if (pin.length !== PIN_LENGTH || confirmPin.length !== PIN_LENGTH) {
      setError(`Enter a ${PIN_LENGTH}-digit PIN`)
      return
    }
    if (pin !== confirmPin) {
      setError('PIN confirmation does not match')
      return
    }

    setIsSubmitting(true)
    try {
      await setTransferPin(token, { password, pin, confirmPin })
      await refreshSession()
      resetForms()
      setSuccess('Transfer PIN set successfully')
    } catch (err) {
      setError(getTransferPinErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError(null)
    setSuccess(null)

    if (
      currentPin.length !== PIN_LENGTH ||
      newPin.length !== PIN_LENGTH ||
      confirmNewPin.length !== PIN_LENGTH
    ) {
      setError(`Enter a ${PIN_LENGTH}-digit PIN in each field`)
      return
    }
    if (newPin !== confirmNewPin) {
      setError('New PIN confirmation does not match')
      return
    }

    setIsSubmitting(true)
    try {
      await changeTransferPin(token, { currentPin, newPin, confirmNewPin })
      await refreshSession()
      resetForms()
      setSuccess('Transfer PIN updated successfully')
    } catch (err) {
      setError(getTransferPinErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Transfer PIN</CardTitle>
        <CardDescription>
          {hasPin
            ? 'Required to confirm transfers. You can change it anytime.'
            : 'Set a 6-digit PIN before you can send money.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-4">
          <Lock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">
              {hasPin ? 'Transfer PIN is set' : 'No transfer PIN yet'}
            </p>
            <p className="text-xs text-muted-foreground">
              This PIN is separate from your login password.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/20 dark:text-green-100">
            {success}
          </div>
        )}

        {!hasPin ? (
          <form onSubmit={handleSetPin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin-password">Login password</Label>
              <div className="relative">
                <Input
                  id="pin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>New transfer PIN</Label>
              <InputOTP maxLength={PIN_LENGTH} value={pin} onChange={setPin} disabled={isSubmitting}>
                <InputOTPGroup>
                  {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="space-y-2">
              <Label>Confirm transfer PIN</Label>
              <InputOTP
                maxLength={PIN_LENGTH}
                value={confirmPin}
                onChange={setConfirmPin}
                disabled={isSubmitting}
              >
                <InputOTPGroup>
                  {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" disabled={isSubmitting || !token}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Set transfer PIN'
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="space-y-4">
            <div className="space-y-2">
              <Label>Current PIN</Label>
              <InputOTP
                maxLength={PIN_LENGTH}
                value={currentPin}
                onChange={setCurrentPin}
                disabled={isSubmitting}
              >
                <InputOTPGroup>
                  {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="space-y-2">
              <Label>New PIN</Label>
              <InputOTP
                maxLength={PIN_LENGTH}
                value={newPin}
                onChange={setNewPin}
                disabled={isSubmitting}
              >
                <InputOTPGroup>
                  {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="space-y-2">
              <Label>Confirm new PIN</Label>
              <InputOTP
                maxLength={PIN_LENGTH}
                value={confirmNewPin}
                onChange={setConfirmNewPin}
                disabled={isSubmitting}
              >
                <InputOTPGroup>
                  {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" disabled={isSubmitting || !token}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Change transfer PIN'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
