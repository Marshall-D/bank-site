'use client'

import Link from 'next/link'
import { KeyRound, Mail, Shield } from 'lucide-react'

import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APPLICATION_STATUS_LABELS } from '@/lib/application/statusLabels'
import { formatDate } from '@/lib/utils'

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

export default function SettingsPage() {
  const { user, application, accounts } = useCustomerAuth()

  const memberSince = application?.activatedAt || accounts[0]?.openedAt
  const applicationStatus = application
    ? APPLICATION_STATUS_LABELS[application.status] || application.status
    : '—'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">View your account and security details</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your profile details on file with us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ProfileField label="Full name" value={user?.name || '—'} />
                <ProfileField label="Email address" value={user?.email || '—'} />
                <ProfileField
                  label="Member since"
                  value={memberSince ? formatDate(new Date(memberSince)) : '—'}
                />
                <ProfileField label="Application reference" value={application?.applicationReference || '—'} />
                <ProfileField label="Application status" value={applicationStatus} />
                <ProfileField
                  label="Account type"
                  value={
                    application?.accountType
                      ? application.accountType.replace(/_/g, ' ')
                      : '—'
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Your account verification information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Account Verified
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-200">
                      Your identity has been verified
                    </p>
                  </div>
                </div>
                <div className="rounded bg-green-600 px-3 py-1 text-sm font-semibold text-white">
                  Approved
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Documents Submitted</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                    Passport (Verified)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                    Proof of Address (Verified)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Password changes are handled by our support team for your security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To reset your password, submit a request and our support team will verify your
                identity and follow up with you.
              </p>
              <Button asChild>
                <Link href="/forgot-password">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Request password reset
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Email verification is required when signing in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold">Email verification</p>
                    <p className="text-xs text-muted-foreground">
                      Enabled for {user?.email || 'your email'}
                    </p>
                  </div>
                </div>
                <div className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                  Enabled
                </div>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
                <p className="text-sm text-green-900 dark:text-green-100">
                  Two-factor authentication is active. Sign-in verification codes are sent to your
                  registered email address.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
