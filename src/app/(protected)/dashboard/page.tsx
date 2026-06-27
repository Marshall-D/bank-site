'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownLeft, Send, Download, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { ComingSoonDialog } from '@/components/customer/ComingSoonDialog'
import { ReceiveMoneyModal } from '@/components/customer/ReceiveMoneyModal'
import { APPLICATION_STATUS_LABELS } from '@/lib/application/statusLabels'
import { fetchTransactions } from '@/lib/transactions/api'
import {
  isIncomingTransaction,
  transactionAmountClass,
  transactionAmountPrefix,
  transactionIconClass,
} from '@/lib/transactions/display'
import type { TransactionListItem } from '@/lib/transactions/types'
import { formatCurrency, formatDate } from '@/lib/utils'

function formatAccountStatus(status: string) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function DashboardPage() {
  const { user, application, accounts, token } = useCustomerAuth()
  const primaryAccount = accounts[0]
  const [recentTransactions, setRecentTransactions] = useState<TransactionListItem[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const memberSince = application?.activatedAt || primaryAccount?.openedAt
  const [receiveMoneyOpen, setReceiveMoneyOpen] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setTransactionsLoading(false)
      return
    }

    let cancelled = false

    async function loadRecentTransactions() {
      setTransactionsLoading(true)
      try {
        const result = await fetchTransactions(token!, { page: 1, limit: 5, sort: '-createdAt' })
        if (!cancelled) setRecentTransactions(result.items)
      } catch {
        if (!cancelled) setRecentTransactions([])
      } finally {
        if (!cancelled) setTransactionsLoading(false)
      }
    }

    loadRecentTransactions()

    return () => {
      cancelled = true
    }
  }, [token])

  const handleQuickAction = (label: string) => {
    if (label === 'Request Money') {
      setReceiveMoneyOpen(true)
      return
    }

    if (label === 'Invest' || label === 'Pay Bills') {
      setComingSoonFeature(label)
    }
  }

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
          { icon: Download, label: 'Request Money' },
          { icon: TrendingUp, label: 'Invest' },
          { icon: AlertCircle, label: 'Pay Bills' },
        ].map((action) => {
          const Icon = action.icon
          const isLink = action.label === 'Transfer'

          if (isLink && action.href) {
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
          }

          return (
            <Button
              key={action.label}
              variant="outline"
              className="flex-col gap-2 h-auto py-4"
              onClick={() => handleQuickAction(action.label)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{action.label}</span>
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
              {transactionsLoading ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Loading transactions...</p>
              ) : recentTransactions.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No transactions yet.</p>
              ) : (
              <div className="space-y-4">
                {recentTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${transactionIconClass(txn)}`}>
                        {isIncomingTransaction(txn) ? (
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
                        <p className="text-xs text-muted-foreground">{formatDate(new Date(txn.date))}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${transactionAmountClass(txn)}`}>
                        {transactionAmountPrefix(txn)}
                        {formatCurrency(txn.amount, txn.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{txn.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-green-950 dark:text-green-100 mb-1">
                    Two-factor authentication enabled
                  </p>
                  <p className="text-xs text-green-900/70 dark:text-green-200/70">
                    Sign-in verification codes are sent to{' '}
                    <span className="font-medium text-green-950 dark:text-green-100">
                      {user?.email || 'your email'}
                    </span>
                  </p>
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
                { label: 'Statements', href: '/statements' },
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

      <ReceiveMoneyModal
        open={receiveMoneyOpen}
        onOpenChange={setReceiveMoneyOpen}
        account={primaryAccount ?? null}
        accountHolderName={user?.name || 'Account holder'}
      />

      <ComingSoonDialog
        open={comingSoonFeature !== null}
        onOpenChange={(open) => {
          if (!open) setComingSoonFeature(null)
        }}
        featureName={comingSoonFeature || 'Feature'}
      />
    </div>
  )
}
