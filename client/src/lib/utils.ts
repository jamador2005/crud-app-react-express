import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date using date-fns
 * @param date The date to format
 * @param formatString Optional format string (defaults to 'PPP')
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatString: string = 'PPP'): string {
  return format(date, formatString)
}
