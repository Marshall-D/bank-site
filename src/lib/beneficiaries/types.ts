export type Beneficiary = {
  id: string
  name: string
  bankName: string
  accountNumber: string
  accountNumberMasked: string
  routingNumber: string | null
  swiftOrIban: string | null
  createdAt: string
}

export type CreateBeneficiaryPayload = {
  name: string
  bankName: string
  accountNumber: string
  routingNumber: string
  swiftOrIban?: string
}

export type ApiErrorResponse = {
  success: false
  message: string
  code: string
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}
