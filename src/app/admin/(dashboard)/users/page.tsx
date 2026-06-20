'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, XCircle, Clock, Search } from 'lucide-react'
import { pendingKYCUsers } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

type User = typeof pendingKYCUsers[0]

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')

  const filteredUsers = pendingKYCUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || user.kycStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleApprove = () => {
    if (selectedUser) {
      setReviewAction('approve')
      setReviewNotes('')
    }
  }

  const handleReject = () => {
    if (selectedUser) {
      setReviewAction('reject')
      setReviewNotes('')
    }
  }

  const confirmReview = () => {
    setSelectedUser(null)
    setReviewAction(null)
    setReviewNotes('')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Review and manage user accounts</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Clock, label: 'Pending Reviews', value: pendingKYCUsers.length, color: 'amber' },
          { icon: CheckCircle2, label: 'Approved', value: '2,341', color: 'green' },
          { icon: XCircle, label: 'Rejected', value: '89', color: 'red' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm">
                KYC Status
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>KYC Reviews</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {pendingKYCUsers.length} pending reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {filteredUsers.length > 0 ? (
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Phone</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Submitted</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium">{user.name}</td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{user.email}</td>
                        <td className="py-4 px-4 text-sm">{user.phone}</td>
                        <td className="py-4 px-4 text-sm">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full text-xs font-semibold">
                            Pending
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-700 rounded-full text-xs font-semibold">
                      Pending
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>{user.phone}</span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedUser(user)}
                  >
                    Review KYC
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedUser && !reviewAction && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl border-border">
            <DialogHeader>
              <DialogTitle>KYC Review</DialogTitle>
              <DialogDescription>
                Review documents and approve/reject the application
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* User Info */}
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Name</p>
                    <p className="font-semibold">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="font-semibold">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                    <p className="font-semibold">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Documents Submitted</h4>
                <div className="space-y-2">
                  {['Passport', 'Proof of Address'].map((doc) => (
                    <div key={doc} className="p-3 border border-border rounded-lg flex items-center justify-between">
                      <span className="text-sm">{doc}</span>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Decision</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="border-green-200 hover:bg-green-50 dark:border-green-900 dark:hover:bg-green-950/30"
                    onClick={handleApprove}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
                    onClick={handleReject}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Approve/Reject Modal */}
      {reviewAction && selectedUser && (
        <Dialog open={!!reviewAction} onOpenChange={() => setReviewAction(null)}>
          <DialogContent className="border-border">
            <DialogHeader>
              <DialogTitle>
                {reviewAction === 'approve' ? 'Approve Application' : 'Reject Application'}
              </DialogTitle>
              <DialogDescription>
                {selectedUser.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="notes">
                  {reviewAction === 'approve' ? 'Approval Notes' : 'Rejection Reason'}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={
                    reviewAction === 'approve'
                      ? 'Add any notes (optional)...'
                      : 'Explain why the application is being rejected...'
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewAction(null)}>
                Cancel
              </Button>
              <Button
                onClick={confirmReview}
                variant={reviewAction === 'approve' ? 'default' : 'destructive'}
              >
                {reviewAction === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
