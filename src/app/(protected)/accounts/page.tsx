import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MoreVertical, Plus, EyeOff, Eye } from 'lucide-react'
import { accounts } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AccountsPage() {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Accounts</h1>
          <p className="text-muted-foreground">Manage your accounts</p>
        </div>
        <Button asChild>
          <a href="#" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Account
          </a>
        </Button>
      </div>

      {/* Total Balance Summary */}
      <Card className="bg-gradient-to-br from-secondary to-secondary/50 border-0">
        <CardContent className="pt-6">
          <p className="text-secondary-foreground/70 text-sm mb-2">Total Balance (All Accounts)</p>
          <h2 className="text-4xl font-bold text-secondary-foreground">{formatCurrency(totalBalance)}</h2>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{account.name}</CardTitle>
                <CardDescription className="capitalize">{account.type} Account</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Download Statement</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Close Account</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Balance */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
              </div>

              {/* Account Info */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                  <p className="text-sm font-mono font-semibold">{account.number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <div className="inline-block px-2 py-1 bg-green-500/10 text-green-700 rounded text-xs font-semibold capitalize">
                    {account.status}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>{formatDate(account.createdAt)}</span>
                </div>
                {account.lastTransaction && (
                  <div className="flex justify-between">
                    <span>Last Transaction</span>
                    <span>{formatDate(account.lastTransaction)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="default" className="flex-1">
                  Transfer
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Deposit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Features Info */}
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
    </div>
  )
}
