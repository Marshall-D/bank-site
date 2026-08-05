export type InternalTransferPayload = {
  fromAccountId: string
  toAccountId: string
  amount: number
  transferPin: string
  description?: string
}

export type ExternalTransferPayload = {
  fromAccountId: string
  beneficiaryName: string
  beneficiaryBank: string
  beneficiaryAccountNumber: string
  amount: number
  transferPin: string
  description?: string
}

export type SameBankTransferPayload = {
  fromAccountId: string
  toAccountNumber: string
  amount: number
  transferPin: string
  description?: string
}

export type ResolvedBrcbAccount = {
  accountNumberMasked: string
  displayName: string
  accountHolderName: string
  currency: string
  accountType: string
}

export type TransferResult = {
  reference: string
  amount: number
  currency: string
  status: string
  fromAccount: {
    id: string
    displayName: string
    balance: number
  }
  toAccount: {
    id: string
    displayName: string
    balance: number
  }
  submittedAt: string
}

export type SameBankTransferResult = {
  reference: string
  amount: number
  currency: string
  description: string
  transferKind: 'same_bank'
  status: string
  fromAccount: {
    id: string
    accountNumberMasked: string
    balance: number
  }
  toAccount: {
    accountNumberMasked: string
    accountHolderName: string
  }
  submittedAt: string
}

export type ApiFieldError = {
  field: string
  message: string
}

export type ApiErrorResponse = {
  success: false
  message: string
  code: string
  reference?: string
  lockedUntil?: string
  attemptsRemaining?: number
  errors?: ApiFieldError[]
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}
