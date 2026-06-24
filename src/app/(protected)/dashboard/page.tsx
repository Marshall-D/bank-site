'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownLeft, Send, Download, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { transactions } from '@/lib/mock-data'
import { APPLICATION_STATUS_LABELS } from '@/lib/application/statusLabels'
import { formatCurrency, formatDate } from '@/lib/utils'

function formatAccountStatus(status: string) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function DashboardPage() {
  const { user, application, accounts } = useCustomerAuth()
  const primaryAccount = accounts[0]
  const recentTransactions = transactions.slice(0, 5)
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const memberSince = application?.activatedAt || primaryAccount?.openedAt

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage and monitor your finances</p>
      </div>

      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
        <CardContent className="pt-6">
          <p className="text-primary-foreground/80 text-sm mb-2">Total Balance</p>
          <h2 className="text-4xl font-bold mb-4">
            {accounts.length > 0 ? formatCurrency(totalBalance, primaryAccount?.currency) : '—'}
          </h2>
          {accounts.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>{accounts.length} linked account{accounts.length === 1 ? '' : 's'}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Send, label: 'Transfer', href: '/transfer' },
          { icon: Download, label: 'Request Money', href: '#' },
          { icon: TrendingUp, label: 'Invest', href: '#' },
          { icon: AlertCircle, label: 'Pay Bills', href: '#' },
        ].map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              variant="outline"
              className="flex-col gap-2 h-auto py-4"
              asChild
            >
              <Link href={action.href}>
                <Icon className="h-5 w-5" />
                <span className="text-xs">{action.label}</span>
              </Link>
            </Button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Primary Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {primaryAccount ? (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{primaryAccount.displayName}</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(primaryAccount.balance, primaryAccount.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Account {primaryAccount.accountNumberMasked}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded text-xs font-semibold">
                      {formatAccountStatus(primaryAccount.status)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" asChild>
                      <Link href="/transfer">Transfer</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/accounts">View Details</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No accounts are linked to your profile yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/transactions">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          txn.type === 'credit' || txn.type === 'transfer'
                            ? 'bg-green-500/10'
                            : 'bg-red-500/10'
                        }`}
                      >
                        {txn.type === 'credit' || txn.type === 'transfer' ? (
                          <ArrowDownLeft
                            className={`h-5 w-5 ${
                              txn.type === 'credit' ? 'text-green-600' : 'text-blue-600'
                            }`}
                          />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{txn.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(txn.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-sm ${
                          txn.type === 'credit' || txn.type === 'transfer'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {txn.type === 'credit' || txn.type === 'transfer' ? '+' : '-'}
                        {formatCurrency(txn.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{txn.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-amber-950 dark:text-amber-100 mb-1">
                    Enable 2FA
                  </p>
                  <p className="text-xs text-amber-900/70 dark:text-amber-200/70 mb-3">
                    Protect your account with two-factor authentication
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-200 hover:bg-amber-100 dark:border-amber-900 dark:hover:bg-amber-900/30"
                    asChild
                  >
                    <Link href="/settings">Enable Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Account Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Accounts</p>
                <p className="text-2xl font-bold">{accounts.length}</p>
              </div>
              {application && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Application</p>
                  <p className="text-sm font-medium font-mono">{application.applicationReference}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                <p className="text-sm font-medium">
                  {memberSince ? formatDate(new Date(memberSince)) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Application Status</p>
                <div className="inline-block px-2 py-1 bg-green-500/10 text-green-700 rounded text-xs font-semibold">
                  {application
                    ? APPLICATION_STATUS_LABELS[application.status] || application.status
                    : '—'}
                </div>
              </div>
              {user && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Online Banking</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Statements', href: '#' },
                { label: 'Card Settings', href: '#' },
                { label: 'Limits & Fees', href: '#' },
                { label: 'Security Center', href: '/settings' },
              ].map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto py-2"
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
