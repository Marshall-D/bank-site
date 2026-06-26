export type InternalTransferPayload = {
  fromAccountId: string
  toAccountId: string
  amount: number
  description?: string
}

export type ExternalTransferPayload = {
  fromAccountId: string
  beneficiaryName: string
  beneficiaryBank: string
  beneficiaryAccountNumber: string
  amount: number
  description?: string
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

export type ApiFieldError = {
  field: string
  message: string
}

export type ApiErrorResponse = {
  success: false
  message: string
  code: string
  reference?: string
  errors?: ApiFieldError[]
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}
