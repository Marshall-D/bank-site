import { User, Account, Transaction, Beneficiary, KYCDocument } from './types'

// Current logged-in user (mock)
export const currentUser: User = {
  id: 'usr_001',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 123-4567',
  role: 'customer',
  kycStatus: 'approved',
  createdAt: new Date('2023-01-15'),
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
}

// Accounts
export const accounts: Account[] = [
  {
    id: 'acc_001',
    userId: 'usr_001',
    type: 'checking',
    name: 'Personal Checking',
    number: '****5467',
    balance: 12543.50,
    currency: 'USD',
    status: 'active',
    createdAt: new Date('2023-01-15'),
    lastTransaction: new Date(),
  },
  {
    id: 'acc_002',
    userId: 'usr_001',
    type: 'savings',
    name: 'Emergency Fund',
    number: '****7891',
    balance: 25000.00,
    currency: 'USD',
    status: 'active',
    createdAt: new Date('2023-02-20'),
    lastTransaction: new Date('2024-04-10'),
  },
  {
    id: 'acc_003',
    userId: 'usr_001',
    type: 'business',
    name: 'Business Operations',
    number: '****2345',
    balance: 45678.25,
    currency: 'USD',
    status: 'active',
    createdAt: new Date('2023-06-01'),
    lastTransaction: new Date('2024-04-15'),
  },
]

// Transactions
export const transactions: Transaction[] = [
  {
    id: 'txn_001',
    accountId: 'acc_001',
    type: 'debit',
    amount: 89.99,
    currency: 'USD',
    description: 'Whole Foods Market',
    status: 'completed',
    date: new Date('2024-04-19'),
    balanceAfter: 12543.50,
    reference: 'TXN-240419-001',
  },
  {
    id: 'txn_002',
    accountId: 'acc_001',
    type: 'credit',
    amount: 2500.00,
    currency: 'USD',
    description: 'Salary Deposit',
    status: 'completed',
    date: new Date('2024-04-18'),
    balanceAfter: 12633.49,
    reference: 'TXN-240418-002',
  },
  {
    id: 'txn_003',
    accountId: 'acc_001',
    type: 'debit',
    amount: 150.00,
    currency: 'USD',
    description: 'Spotify Subscription',
    status: 'completed',
    date: new Date('2024-04-17'),
    balanceAfter: 12133.49,
    reference: 'TXN-240417-003',
  },
  {
    id: 'txn_004',
    accountId: 'acc_001',
    type: 'transfer',
    amount: 1000.00,
    currency: 'USD',
    description: 'Transfer to Savings',
    status: 'completed',
    date: new Date('2024-04-16'),
    balanceAfter: 11133.49,
    reference: 'TXN-240416-004',
    recipientName: 'Emergency Fund',
  },
  {
    id: 'txn_005',
    accountId: 'acc_001',
    type: 'debit',
    amount: 45.50,
    currency: 'USD',
    description: 'Gas Station',
    status: 'completed',
    date: new Date('2024-04-15'),
    balanceAfter: 11178.99,
    reference: 'TXN-240415-005',
  },
  {
    id: 'txn_006',
    accountId: 'acc_002',
    type: 'credit',
    amount: 500.00,
    currency: 'USD',
    description: 'Interest Payment',
    status: 'completed',
    date: new Date('2024-04-01'),
    balanceAfter: 25500.00,
    reference: 'TXN-240401-006',
  },
]

// Beneficiaries
export const beneficiaries: Beneficiary[] = [
  {
    id: 'ben_001',
    userId: 'usr_001',
    name: 'Alex Chen',
    accountNumber: '9876543210',
    bankName: 'Bank of America',
    type: 'external',
    createdAt: new Date('2023-03-10'),
  },
  {
    id: 'ben_002',
    userId: 'usr_001',
    name: 'Michael Rodriguez',
    accountNumber: '1234567890',
    bankName: 'Chase Bank',
    type: 'external',
    createdAt: new Date('2023-05-22'),
  },
]

// KYC Documents
export const kycDocuments: KYCDocument[] = [
  {
    id: 'doc_001',
    userId: 'usr_001',
    type: 'passport',
    status: 'verified',
    url: '/documents/passport.pdf',
    uploadedAt: new Date('2023-01-15'),
    verifiedAt: new Date('2023-01-20'),
  },
  {
    id: 'doc_002',
    userId: 'usr_001',
    type: 'proof_of_address',
    status: 'verified',
    url: '/documents/proof_of_address.pdf',
    uploadedAt: new Date('2023-01-15'),
    verifiedAt: new Date('2023-01-20'),
  },
]

// Admin users
export const adminUsers: User[] = [
  {
    id: 'admin_001',
    name: 'Emma Wilson',
    email: 'emma.wilson@bank.com',
    phone: '+1 (555) 987-6543',
    role: 'admin',
    kycStatus: 'approved',
    createdAt: new Date('2022-01-01'),
  },
]

// Users for KYC review (pending)
export const pendingKYCUsers: User[] = [
  {
    id: 'usr_002',
    name: 'James Mitchell',
    email: 'james.mitchell@example.com',
    phone: '+1 (555) 234-5678',
    role: 'customer',
    kycStatus: 'pending',
    createdAt: new Date('2024-04-10'),
  },
  {
    id: 'usr_003',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+1 (555) 345-6789',
    role: 'customer',
    kycStatus: 'pending',
    createdAt: new Date('2024-04-12'),
  },
  {
    id: 'usr_004',
    name: 'David Liu',
    email: 'david.liu@example.com',
    phone: '+1 (555) 456-7890',
    role: 'customer',
    kycStatus: 'pending',
    createdAt: new Date('2024-04-14'),
  },
]

export const chartData = [
  {
    month: 'Jan',
    spending: 400,
    income: 2400,
  },
  {
    month: 'Feb',
    spending: 300,
    income: 1398,
  },
  {
    month: 'Mar',
    spending: 200,
    income: 9800,
  },
  {
    month: 'Apr',
    spending: 278,
    income: 3908,
  },
]
