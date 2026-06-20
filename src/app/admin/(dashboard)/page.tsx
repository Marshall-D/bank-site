import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileCheck, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { pendingKYCUsers, accounts, transactions } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminDashboardPage() {
  const totalUsers = 2450 + pendingKYCUsers.length
  const pendingKYCCount = pendingKYCUsers.length
  const totalTransactions = transactions.length
  const totalVolume = transactions.reduce((sum, txn) => sum + txn.amount, 0)

  const stats = [
    {
      icon: Users,
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      change: '+12% this month',
    },
    {
      icon: FileCheck,
      title: 'Pending KYC',
      value: pendingKYCCount,
      change: 'Requires review',
      highlight: true,
    },
    {
      icon: TrendingUp,
      title: 'Total Volume',
      value: formatCurrency(totalVolume),
      change: 'This month',
    },
    {
      icon: AlertCircle,
      title: 'Flagged Accounts',
      value: '3',
      change: 'Under review',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform activity and manage users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className={`border-border ${
                stat.highlight ? 'ring-2 ring-amber-400' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    stat.highlight
                      ? 'bg-amber-500/10'
                      : 'bg-primary/10'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      stat.highlight
                        ? 'text-amber-600'
                        : 'text-primary'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending KYC Review */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending KYC Reviews</CardTitle>
                <CardDescription>Users awaiting verification</CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/admin/users">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingKYCUsers.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button size="sm" asChild>
                      <Link href="/admin/users">Review</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>High-value transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{txn.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(txn.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCurrency(txn.amount)}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {txn.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/users">Manage Users</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Transactions
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                System Settings
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'API Server', status: 'Healthy' },
                { name: 'Database', status: 'Healthy' },
                { name: 'Authentication', status: 'Healthy' },
                { name: 'Payment Gateway', status: 'Healthy' },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <p className="text-sm">{service.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full" />
                    <span className="text-xs text-muted-foreground">{service.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alert */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-amber-950 dark:text-amber-100 mb-1">
                    High Activity Alert
                  </p>
                  <p className="text-xs text-amber-900/70 dark:text-amber-200/70">
                    Unusual transaction volume detected in Asia-Pacific region
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
