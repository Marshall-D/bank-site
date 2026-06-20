'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, LogOut, RefreshCw, Server, Shield, User } from 'lucide-react'

import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { API_BASE_URL, fetchHealth, type HealthResponse } from '@/lib/api'
import { BRAND_NAME } from '@/lib/brand'

type HealthState = {
  data: HealthResponse | null
  error: string | null
  checkedAt: Date | null
}

export default function AdminSettingsPage() {
  const { user, logout } = useAdminAuth()
  const [health, setHealth] = useState<HealthState>({
    data: null,
    error: null,
    checkedAt: null,
  })
  const [isCheckingHealth, setIsCheckingHealth] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [reviewReminders, setReviewReminders] = useState(true)

  const checkHealth = useCallback(async () => {
    setIsCheckingHealth(true)
    try {
      const data = await fetchHealth()
      setHealth({ data, error: null, checkedAt: new Date() })
    } catch (err) {
      setHealth({
        data: null,
        error: err instanceof Error ? err.message : 'Health check failed',
        checkedAt: new Date(),
      })
    } finally {
      setIsCheckingHealth(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  const apiHealthy = health.data?.status?.toLowerCase() === 'ok' || health.data?.status?.toLowerCase() === 'healthy'
  const dbHealthy =
    health.data?.database?.toLowerCase() === 'connected' ||
    health.data?.database?.toLowerCase() === 'ok' ||
    health.data?.database?.toLowerCase() === 'healthy'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your admin account and portal preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Admin account
            </CardTitle>
            <CardDescription>Your signed-in staff profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Name</Label>
              <Input id="admin-name" value={user?.name ?? ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" value={user?.email ?? ''} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div>
                <Badge variant="secondary" className="capitalize">
                  {user?.role ?? 'admin'}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Profile updates are managed by your organization. Contact IT to change account details.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Session and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
              <p className="font-medium">Active session</p>
              <p className="mt-1 text-muted-foreground">
                You are signed in to the {BRAND_NAME} admin portal on this device.
              </p>
            </div>
            <Button variant="destructive" className="w-full justify-start gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
            <p className="text-xs text-muted-foreground">
              Password changes are handled outside this portal until staff account management is
              available.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Local preferences for this browser</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">New application alerts</p>
                <p className="text-xs text-muted-foreground">
                  Highlight when new applications enter the queue
                </p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Review reminders</p>
                <p className="text-xs text-muted-foreground">
                  Remind you about pending KYC reviews on dashboard load
                </p>
              </div>
              <Switch checked={reviewReminders} onCheckedChange={setReviewReminders} />
            </div>
            <p className="text-xs text-muted-foreground">
              These preferences are stored locally in your browser for now.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System
              </CardTitle>
              <CardDescription>API connectivity and environment</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={checkHealth} disabled={isCheckingHealth}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isCheckingHealth ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API base URL</Label>
              <Input value={API_BASE_URL} readOnly className="font-mono text-xs" />
            </div>

            {health.error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {health.error}
              </div>
            ) : health.data ? (
              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{health.data.service}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">API status</span>
                  <Badge variant={apiHealthy ? 'default' : 'destructive'}>{health.data.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Database</span>
                  <Badge variant={dbHealthy ? 'default' : 'secondary'}>{health.data.database}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Checking system health...</p>
            )}

            {health.checkedAt && (
              <p className="text-xs text-muted-foreground">
                Last checked {health.checkedAt.toLocaleString()}
              </p>
            )}

            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/applications">Go to applications queue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
