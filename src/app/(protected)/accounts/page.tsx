'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomerAuth } from '@/components/customer/CustomerAuthProvider'
import { ReceiveMoneyModal } from '@/components/customer/ReceiveMoneyModal'
import { formatCurrency, formatDate } from '@/lib/utils'

function formatAccountStatus(status: string) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function AccountsPage() {
  const { accounts, user } = useCustomerAuth()
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const primaryCurrency = accounts[0]?.currency ?? 'USD'
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Accounts</h1>
        <p className="text-muted-foreground">Manage your accounts</p>
      </div>

      <Card className="bg-gradient-to-br from-secondary to-secondary/50 border-0">
        <CardContent className="pt-6">
          <p className="text-secondary-foreground/70 text-sm mb-2">Total Balance (All Accounts)</p>
          <h2 className="text-4xl font-bold text-secondary-foreground">
            {accounts.length > 0 ? formatCurrency(totalBalance, primaryCurrency) : '—'}
          </h2>
        </CardContent>
      </Card>

      {accounts.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-10 text-center text-muted-foreground">
            No accounts are linked to your profile yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{account.displayName}</CardTitle>
                <CardDescription className="capitalize">
                  {account.accountType.replace(/_/g, ' ')} Account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(account.balance, account.currency)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                    <p className="text-sm font-mono font-semibold">{account.accountNumberMasked}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <div className="inline-block px-2 py-1 bg-green-500/10 text-green-700 rounded text-xs font-semibold">
                      {formatAccountStatus(account.status)}
                    </div>
                  </div>
                </div>

                {account.openedAt && (
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Opened</span>
                      <span>{formatDate(new Date(account.openedAt))}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="default" className="flex-1" asChild>
                    <Link href="/transfer">Transfer</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedAccountId(account.id)}>
                    Deposit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Account Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Checking</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Unlimited transfers</li>
                <li>✓ Bill pay included</li>
                <li>✓ No monthly fees</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Savings</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ 4.5% APY</li>
                <li>✓ Daily compounding</li>
                <li>✓ FDIC insured</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Business</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ API integration</li>
                <li>✓ Team access</li>
                <li>✓ Tax reports</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReceiveMoneyModal
        open={selectedAccountId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedAccountId(null)
        }}
        account={selectedAccount}
        accountHolderName={user?.name || 'Account holder'}
      />
    </div>
  )
}
