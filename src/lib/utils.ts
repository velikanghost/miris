import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const MONAD_TESTNET_SCAN_URL = 'https://monad-testnet.socialscan.io'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
