import { Language } from '@/types/translations'

export function formatDate(date: Date, language: Language): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  return new Intl.DateTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', options).format(date)
}

export function formatDateTime(date: Date, language: Language): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }

  return new Intl.DateTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', options).format(date)
}

export function formatCurrency(amount: number, language: Language): string {
  const currency = language === 'ja' ? 'JPY' : 'USD'
  const locale = language === 'ja' ? 'ja-JP' : 'en-US'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatNumber(number: number, language: Language): string {
  const locale = language === 'ja' ? 'ja-JP' : 'en-US'
  return new Intl.NumberFormat(locale).format(number)
}

export function getRelativeTime(date: Date, language: Language): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
    numeric: 'auto'
  })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  }
}
