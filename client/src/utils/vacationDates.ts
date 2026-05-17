import dayjs from 'dayjs'

import type { VacationRequest } from '@/api/vacationRequestsApi'

type YmdParts = [year: number, month: number, day: number]

const parseYmd = (ymd: string): YmdParts | null => {
  const numericParts = ymd.split('-').map(Number)

  if (numericParts.length !== 3 || numericParts.some(Number.isNaN)) {
    return null
  }

  return [numericParts[0]!, numericParts[1]!, numericParts[2]!]
}

const createLocalDate = ([year, month, day]: YmdParts): Date => new Date(year, month - 1, day)

export const toYmdLocal = (date: Date): string => dayjs(date).format('YYYY-MM-DD')

export const inclusiveVacationDays = (startYmd: string, endYmd: string): number => {
  const startDateParts = parseYmd(startYmd)
  const endDateParts = parseYmd(endYmd)

  if (!startDateParts || !endDateParts) {
    return 0
  }

  const startDate = dayjs(createLocalDate(startDateParts))
  const endDate = dayjs(createLocalDate(endDateParts))

  return endDate.diff(startDate, 'day') + 1
}

export const rangesOverlapYmd = (
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean => startA <= endB && startB <= endA

export const selectionOverlapsRequest = (
  selectedStartDate: Date,
  selectedEndDate: Date,
  request: Pick<VacationRequest, 'startDate' | 'endDate' | 'status'>,
): boolean => {
  if (request.status !== 'Pending' && request.status !== 'Approved') {
    return false
  }

  return rangesOverlapYmd(
    toYmdLocal(selectedStartDate),
    toYmdLocal(selectedEndDate),
    request.startDate,
    request.endDate,
  )
}

export const pickNextUpcomingApproved = (
  requests: VacationRequest[],
  todayYmd: string,
): VacationRequest | null =>
  [...requests]
    .filter((request) => request.status === 'Approved' && request.startDate >= todayYmd)
    .sort((firstRequest, secondRequest) =>
      firstRequest.startDate.localeCompare(secondRequest.startDate),
    )[0] ?? null
