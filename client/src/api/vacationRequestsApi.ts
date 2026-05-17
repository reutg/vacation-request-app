import { apiRequest } from '@/api/apiRequest'

export type VacationRequestStatus = 'Pending' | 'Approved' | 'Rejected'

export type VacationRequest = {
  id: number
  userId: number
  startDate: string
  endDate: string
  reason: string
  status: VacationRequestStatus
  comments: string | null
  createdAt: string
}

export type CreateVacationRequestInput = {
  userId: number
  startDate: Date | string
  endDate: Date | string
  reason?: string
  comments?: string | null
}

function toApiDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }
  return typeof value === 'string' ? value.trim() : ''
}

export type GetVacationRequestsParams = {
  status?: VacationRequestStatus
}

export function getVacationRequests(params?: GetVacationRequestsParams) {
  return apiRequest<VacationRequest[]>({
    method: 'GET',
    url: '/api/vacation-requests',
    params: params?.status ? { status: params.status } : undefined,
  })
}

export type VacationRequestStats = {
  total: number
  approved: number
  pending: number
  rejected: number
}

export function getVacationRequestStats() {
  return apiRequest<VacationRequestStats>({
    method: 'GET',
    url: '/api/vacation-requests/stats',
  })
}

export function getVacationRequestById(id: number) {
  return apiRequest<VacationRequest>({
    method: 'GET',
    url: `/api/vacation-requests/${id}`,
  })
}

export type ApproveVacationRequestInput = {
  comments?: string | null
}

export function approveVacationRequest(id: number, input: ApproveVacationRequestInput = {}) {
  const data: { comments?: string } = {}
  const trimmed = input.comments?.trim()
  if (trimmed) {
    data.comments = trimmed
  }
  return apiRequest<VacationRequest>({
    method: 'POST',
    url: `/api/vacation-requests/${id}/approve`,
    data,
  })
}

export type RejectVacationRequestInput = {
  comments: string
}

export function rejectVacationRequest(id: number, input: RejectVacationRequestInput) {
  return apiRequest<VacationRequest>({
    method: 'POST',
    url: `/api/vacation-requests/${id}/reject`,
    data: { comments: input.comments.trim() },
  })
}

export function createVacationRequest(input: CreateVacationRequestInput) {
  const startDateStr = toApiDate(input.startDate)
  const endDateStr = toApiDate(input.endDate)
  const wireBody = {
    user_id: input.userId,
    start_date: startDateStr,
    end_date: endDateStr,
    reason: (input.reason ?? '').trim(),
    comments: input.comments ?? null,
  }

  return apiRequest<VacationRequest>({
    method: 'POST',
    url: '/api/vacation-requests',
    data: wireBody,
  })
}
