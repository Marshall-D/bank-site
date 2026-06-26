export type Beneficiary = {
  id: string
  name: string
  bankName: string
  accountNumber: string
  accountNumberMasked: string
  createdAt: string
}

export type CreateBeneficiaryPayload = {
  name: string
  bankName: string
  accountNumber: string
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
