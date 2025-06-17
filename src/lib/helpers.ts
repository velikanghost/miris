/**
 * Helper functions for formatting timestamps and time-related utilities
 */

/**
 * Calculate the number of seconds between a timestamp and now
 * @param timestamp - ISO timestamp string or Date object
 * @returns Number of seconds ago (positive number)
 */
export const getSecondsAgo = (timestamp: string | Date): number => {
  const now = new Date().getTime()

  let targetTime: number

  if (typeof timestamp === 'string') {
    // Handle timestamps without timezone info by treating them as UTC
    const timestampWithZ = timestamp.endsWith('Z') ? timestamp : `${timestamp}Z`
    targetTime = new Date(timestampWithZ).getTime()
  } else {
    targetTime = timestamp.getTime()
  }

  return Math.floor((now - targetTime) / 1000)
}

/**
 * Format a timestamp to relative time string
 * @param timestamp - ISO timestamp string or Date object
 * @returns Formatted string like 'now', '9s ago', '2m ago', 'hr:min:s'
 */
export const formatTimeAgo = (timestamp: string | Date): string => {
  const secondsAgo = getSecondsAgo(timestamp)

  // Handle future timestamps or very recent (within 5 seconds)
  if (secondsAgo <= 5) {
    return 'now'
  }

  // Less than 1 minute - show seconds
  if (secondsAgo < 60) {
    return `${secondsAgo}s ago`
  }

  // Less than 1 hour - show minutes ago
  const minutesAgo = Math.floor(secondsAgo / 60)
  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`
  }

  // More than 1 hour - show hours ago
  const hoursAgo = Math.floor(secondsAgo / 3600)
  if (hoursAgo < 24) {
    return `${hoursAgo}h ago`
  }

  // More than 1 day - show days ago
  const daysAgo = Math.floor(secondsAgo / 86400)
  return `${daysAgo}d ago`
}

/**
 * Format timestamp specifically for trading data
 * @param timestamp - ISO timestamp string or Date object
 * @returns Formatted string optimized for trading UI
 */
export const formatTradeTime = (timestamp: string | Date): string => {
  const secondsAgo = getSecondsAgo(timestamp)

  if (secondsAgo <= 2) {
    return 'just now'
  }

  if (secondsAgo < 60) {
    return `${secondsAgo}s`
  }

  if (secondsAgo < 3600) {
    // Less than 1 hour
    const minutes = Math.floor(secondsAgo / 60)
    const seconds = secondsAgo % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // More than 1 hour - show full time
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * Check if a timestamp is from today
 * @param timestamp - ISO timestamp string or Date object
 * @returns Boolean indicating if timestamp is from today
 */
export const isToday = (timestamp: string | Date): boolean => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Get time difference in various units
 * @param timestamp - ISO timestamp string or Date object
 * @returns Object with time differences in different units
 */
export const getTimeDifference = (timestamp: string | Date) => {
  const secondsAgo = getSecondsAgo(timestamp)

  return {
    seconds: secondsAgo,
    minutes: Math.floor(secondsAgo / 60),
    hours: Math.floor(secondsAgo / 3600),
    days: Math.floor(secondsAgo / 86400),
    weeks: Math.floor(secondsAgo / 604800),
  }
}

/**
 * Format duration from seconds to human readable format
 * @param seconds - Number of seconds
 * @returns Human readable duration string
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`
  }

  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    const remainingMinutes = Math.floor((seconds % 3600) / 60)
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const days = Math.floor(seconds / 86400)
  const remainingHours = Math.floor((seconds % 86400) / 3600)
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

/**
 * Create a refresh indicator for real-time data
 * @param lastUpdate - Last update timestamp
 * @param maxAge - Maximum age in seconds before showing stale warning
 * @returns Object with status and formatted time
 */
export const getRefreshStatus = (
  lastUpdate: string | Date,
  maxAge: number = 300,
) => {
  const secondsAgo = getSecondsAgo(lastUpdate)
  const timeAgo = formatTimeAgo(lastUpdate)

  let status: 'fresh' | 'recent' | 'stale' = 'fresh'

  if (secondsAgo > maxAge) {
    status = 'stale'
  } else if (secondsAgo > 60) {
    status = 'recent'
  }

  return {
    status,
    timeAgo,
    secondsAgo,
    isStale: status === 'stale',
  }
}

/**
 * Format a number to a human readable format
 * @param num - Number to format (assumes 18-decimal token value)
 * @param isWei - Whether the number is in wei format (default: true)
 * @param decimals - Number of decimals for the token (default: 18)
 * @returns Formatted string
 */
export const formatNumber = (
  num: number | string,
  isWei: boolean = true,
  decimals: number = 18,
) => {
  // Handle string inputs and convert from wei to token amount
  const numValue = typeof num === 'string' ? parseFloat(num) : num
  const divisor = isWei ? Math.pow(10, decimals) : 1
  const tokenAmount = isWei ? numValue / divisor : numValue

  // Round to avoid floating point precision issues
  const rounded = Math.round(tokenAmount * 100) / 100

  if (rounded >= 1e9) {
    const billions = Math.round((rounded / 1e9) * 100) / 100
    return `${billions}B`
  } else if (rounded >= 1e6) {
    const millions = Math.round((rounded / 1e6) * 100) / 100
    return `${millions}M`
  } else if (rounded >= 1e3) {
    const thousands = Math.round((rounded / 1e3) * 100) / 100
    return `${thousands}K`
  }

  // For smaller numbers, show appropriate decimal places
  if (rounded >= 1) {
    return `${Math.round(rounded * 100) / 100}`
  } else if (rounded >= 0.01) {
    return `${Math.round(rounded * 10000) / 10000}`
  } else if (rounded > 0) {
    return `${rounded.toExponential(2)}`
  }

  return '0'
}

/**
 * Format a number to a price format
 * @param num - Number to format
 * @returns Formatted string
 */
export const formatPrice = (num: number) => {
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })}`
}

/**
 * Format an address to a shortened format
 * @param address - Address to format
 * @returns Formatted string
 */
export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
