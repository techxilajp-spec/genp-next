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

export function formatCurrency(amount: number): string {
  const currency = 'JPY'
  const locale = 'ja-JP'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatNumber(number: number): string {
  const locale = 'ja-JP'
  return new Intl.NumberFormat(locale).format(number)
}

export function formatActivityTime(createdAt: string) {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffMs = now.getTime() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffMs / 604800000);
  const diffMonths = Math.floor(diffMs / 2592000000);
  const diffYears = Math.floor(diffMs / 31536000000);

  if (diffMinutes < 60) { return `${diffMinutes} minutes ago`; }
  if (diffHours < 24) { return `${diffHours} hours ago`; }
  if (diffDays < 7) { return `${diffDays} days ago`; }
  if (diffWeeks < 4) { return `${diffWeeks} weeks ago`; }
  if (diffMonths < 12) { return `${diffMonths} months ago`; }
  return `${diffYears} years ago`;
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
