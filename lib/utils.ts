import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely format a date string to prevent RangeError crashes
 * @param date - Date string, Date object, or any value
 * @param fallback - Fallback string if date is invalid (default: "N/A")
 * @param formatStr - Optional format string (uses date-fns if provided)
 * @returns Formatted date string or fallback
 */
export function formatDate(
  date: string | Date | undefined | null, 
  fallback: string = "N/A",
  formatStr?: string
): string {
  if (!date) return fallback;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return fallback;
  }
  
  if (formatStr) {
    try {
      return new Intl.DateTimeFormat('en-IN', { 
        day: '2-digit', 
        month: formatStr === 'MMM' ? 'short' : formatStr === 'MMMM' ? 'long' : 'numeric', 
        year: 'numeric' 
      }).format(dateObj);
    } catch {
      return fallback;
    }
  }
  
  return dateObj.toLocaleDateString();
}

/**
 * Format date with time for detailed displays
 */
export function formatDateTime(date: string | Date | undefined | null, fallback: string = "N/A"): string {
  if (!date) return fallback;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return fallback;
  }
  
  return dateObj.toLocaleString();
}