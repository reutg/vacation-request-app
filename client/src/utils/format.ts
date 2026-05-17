import dayjs from 'dayjs'

export const formatDisplayDate = (value: string): string =>
  dayjs(value).isValid() ? dayjs(value).format('DD.MM.YYYY') : value
