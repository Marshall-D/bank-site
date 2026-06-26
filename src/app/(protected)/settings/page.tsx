'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Shield, Bell, Lock, Mail } from 'lucide-react'
import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { currentUser } from '@/lib/mock-data'
import { formatPhoneNumber } from '@/lib/utils'

export default function SettingsPage() {
  const { user } = useCustomerAuth()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    weeklyDigest: false,
    smsNotifications: false,
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Personal Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={currentUser.name}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={currentUser.email}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue={formatPhoneNumber(currentUser.phone)}
                    placeholder="Your phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberSince">Member Since</Label>
                  <Input
                    id="memberSince"
                    disabled
                    defaultValue={new Date(currentUser.createdAt).toLocaleDateString()}
                  />
                </div>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* KYC Status */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Your account verification information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
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
                <div className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold">
                  Approved
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Documents Submitted</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                    Passport (Verified)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                    Proof of Address (Verified)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password regularly to keep your account safe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {passwordChanged && (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-100 rounded-lg border border-green-200 dark:border-green-900">
                  Password updated successfully!
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <Button
                onClick={() => {
                  setPasswordChanged(true)
                  setTimeout(() => setPasswordChanged(false), 3000)
                }}
              >
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
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
                      Enabled for {user?.email || currentUser.email}
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

          {/* Trusted Devices */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Trusted Devices</CardTitle>
              <CardDescription>Manage devices that can access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { name: 'Chrome on MacBook Pro', lastUsed: '2 minutes ago', current: true },
                  { name: 'Safari on iPhone 15', lastUsed: '1 hour ago', current: false },
                  { name: 'Chrome on Windows', lastUsed: '3 days ago', current: false },
                ].map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{device.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last used {device.lastUsed}
                        {device.current && ' (Current)'}
                      </p>
                    </div>
                    {!device.current && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Preferences */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how we communicate with you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    id: 'emailNotifications',
                    icon: Mail,
                    title: 'Email Notifications',
                    description: 'Receive updates via email',
                  },
                  {
                    id: 'transactionAlerts',
                    icon: Bell,
                    title: 'Transaction Alerts',
                    description: 'Get notified for every transaction',
                  },
                  {
                    id: 'securityAlerts',
                    icon: Shield,
                    title: 'Security Alerts',
                    description: 'Important security notifications',
                  },
                  {
                    id: 'weeklyDigest',
                    icon: Lock,
                    title: 'Weekly Digest',
                    description: 'Summary of account activity',
                  },
                ].map((pref) => {
                  const Icon = pref.icon
                  return (
                    <div key={pref.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{pref.title}</p>
                          <p className="text-xs text-muted-foreground">{pref.description}</p>
                        </div>
                      </div>
                      <Checkbox
                        checked={preferences[pref.id as keyof typeof preferences]}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({
                            ...prev,
                            [pref.id]: checked,
                          }))
                        }
                      />
                    </div>
                  )
                })}
              </div>

              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
            Close Account
          </Button>
          <p className="text-xs text-muted-foreground">
            Closing your account will permanently delete all data. This action cannot be undone.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
