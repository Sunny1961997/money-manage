type DateInput = Date | string | number | null | undefined

const DATE_LOCALE = "en-GB"

const dateFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

const dateTimeFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
})

function toValidDate(value: DateInput): Date | null {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value: DateInput, fallback = "-"): string {
  const date = toValidDate(value)
  return date ? dateFormatter.format(date) : fallback
}

export function formatDateTime(value: DateInput, fallback = "-"): string {
  const date = toValidDate(value)
  return date ? dateTimeFormatter.format(date) : fallback
}
