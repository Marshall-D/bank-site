export type DocumentMetadata = {
  fileId: string
  label: string
  availability: 'placeholder' | 'ready' | 'unavailable'
  url: string | null
  originalFilename: string | null
}

export type Address = {
  line1: string
  line2: string | null
  cityOrIsland: string
  postalCode: string | null
  country: string
}

export type StatusHistoryEntry = {
  from: string
  to: string
  changedAt: string
  changedBy: string
  note: string | null
}

export type ReviewedBy = {
  id: string
  name?: string
  email?: string
}

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

export type AdminApplicationDetail = AdminApplicationListItem & {
  applicantType: string
  firstName: string
  middleName: string | null
  lastName: string
  preferredName: string | null
  maidenName: string | null
  dateOfBirth: string | null
  countryOfResidence: string
  taxResidenceCountry: string
  mobilePhone: string
  secondaryPhone: string | null
  residentialAddress: Address | null
  mailingAddress: Address | null
  idDocument: {
    type: string
    number: string
    issuingCountry: string
    expiryDate: string | null
    front: DocumentMetadata
    back: DocumentMetadata | null
  } | null
  proofOfAddressDocument: {
    type: string
    issueDate: string | null
    file: DocumentMetadata
  } | null
  sourceOfFunds: {
    sourceType: string
    description: string | null
    monthlyEstimate: number | null
    currency: string | null
  } | null
  initialDeposit: {
    amount: number
    currency: string
    method: string
  } | null
  employment: {
    status: string | null
    employerName: string | null
    jobTitle: string | null
    occupation: string | null
    workPhone: string | null
  } | null
  pepDeclaration: boolean
  purposeOfAccount: string | null
  expectedMonthlyDeposit: number | null
  expectedMonthlyWithdrawal: number | null
  preferredBranch: string | null
  referralCode: string | null
  notes: string | null
  consents: {
    termsAccepted: boolean
    privacyAccepted: boolean
    amlAccepted: boolean
    dataProcessingAccepted: boolean
    marketingConsent: boolean
  } | null
  reviewNotes: string | null
  reviewedBy: ReviewedBy | null
  statusHistory: StatusHistoryEntry[]
  approvedAt: string | null
  activatedAt: string | null
  applicationDate: string | null
  updatedAt: string
}

/** @deprecated Use AdminApplicationDetail */
export type AdminApplicationDetailResponse = AdminApplicationDetail

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

export type ApiErrorResponse = {
  success: false
  message: string
  code: string
}

export type ApiSuccessResponse<T> = {
  success: true
  data: T
}
