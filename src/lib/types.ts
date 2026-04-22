export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  kycStatus: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  avatar?: string
}

export interface Account {
  id: string
  userId: string
  type: 'checking' | 'savings' | 'business'
  name: string
  number: string
  balance: number
  currency: string
  status: 'active' | 'frozen' | 'closed'
  createdAt: Date
  lastTransaction?: Date
}

export interface Transaction {
  id: string
  accountId: string
  type: 'debit' | 'credit' | 'transfer'
  amount: number
  currency: string
  description: string
  status: 'completed' | 'pending' | 'failed'
  date: Date
  balanceAfter: number
  reference?: string
  recipientName?: string
}

export interface Transfer {
  id: string
  fromAccountId: string
  toAccountId?: string
  beneficiaryId?: string
  amount: number
  currency: string
  status: 'draft' | 'pending' | 'completed' | 'failed'
  scheduledDate?: Date
  createdAt: Date
  description?: string
}

export interface Beneficiary {
  id: string
  userId: string
  name: string
  accountNumber: string
  bankName: string
  type: 'internal' | 'external'
  createdAt: Date
}

export interface KYCDocument {
  id: string
  userId: string
  type: 'passport' | 'driving_license' | 'national_id' | 'proof_of_address'
  status: 'pending' | 'verified' | 'rejected'
  url: string
  uploadedAt: Date
  verifiedAt?: Date
}

export interface NotificationPreference {
  userId: string
  email: boolean
  sms: boolean
  pushNotification: boolean
  transactionAlerts: boolean
  securityAlerts: boolean
}
