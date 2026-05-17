export const REASON_DISPLAY_MAX_LENGTH = 50
const ELLIPSIS = '...'

export function truncate(value: string, maxLength: number): string {
  const text = value.trim()
  if (maxLength <= 0) return ''
  if (text.length <= maxLength) return text
  if (maxLength <= ELLIPSIS.length) return ELLIPSIS.slice(0, maxLength)
  return `${text.slice(0, maxLength - ELLIPSIS.length)}${ELLIPSIS}`
}
