export type AdminApplicationListItem = {
  id: string
  applicationReference: string
  status: string
  accountType: string
  applicantName: string
  email: string
  nationality: string
  submittedAt: string | null
  createdAt: string
  reviewedAt: string | null
}

export type ListApplicationsParams = {
  page?: number
  limit?: number
  status?: string
  accountType?: string
  email?: string
  submittedFrom?: string
  submittedTo?: string
  sort?: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PaginatedApplicationsResponse = {
  items: AdminApplicationListItem[]
  pagination: PaginationMeta
}

export type AdminApplicationDetailResponse = AdminApplicationListItem & {
  applicantType?: string
  mobilePhone?: string
  dateOfBirth?: string
  countryOfResidence?: string
  taxResidenceCountry?: string
  purposeOfAccount?: string
  preferredBranch?: string
  sourceOfFunds?: {
    sourceType?: string
    description?: string
    monthlyEstimate?: number
    currency?: string
  }
  initialDeposit?: {
    amount?: number
    currency?: string
    method?: string
  }
  employment?: {
    status?: string
    employerName?: string
    jobTitle?: string
  }
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
