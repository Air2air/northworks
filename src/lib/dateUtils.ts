/**
 * Date formatting utilities for consistent date display across the application
 */

/**
 * Format an ISO date string (YYYY-MM-DD) to human-readable format
 * @param isoDate - ISO date string like "1995-11-18"
 * @param format - Display format: "long" (November 18, 1995) or "short" (Nov 18, 1995)
 * @returns Formatted date string or null if invalid
 */
export function formatDate(isoDate: string | null | undefined, format: 'long' | 'short' = 'long'): string | null {
  if (!isoDate || isoDate === 'null') {
    return null;
  }

  try {
    // Parse ISO date string (YYYY-MM-DD)
    const date = new Date(isoDate + 'T00:00:00.000Z'); // Add time to avoid timezone issues
    
    if (isNaN(date.getTime())) {
      return null;
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: format === 'long' ? 'long' : 'short',
      day: 'numeric',
      timeZone: 'UTC' // Ensure consistent formatting regardless of user timezone
    };

    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.warn('Error formatting date:', isoDate, error);
    return null;
  }
}

/**
 * Format just the year from an ISO date
 * @param isoDate - ISO date string like "1995-11-18"
 * @returns Year string like "1995" or null if invalid
 */
export function formatYear(isoDate: string | null | undefined): string | null {
  if (!isoDate || isoDate === 'null') {
    return null;
  }

  try {
    const date = new Date(isoDate + 'T00:00:00.000Z');
    
    if (isNaN(date.getTime())) {
      return null;
    }

    return date.getUTCFullYear().toString();
  } catch (error) {
    console.warn('Error formatting year:', isoDate, error);
    return null;
  }
}

/**
 * Format date for sorting or comparison (keeps ISO format)
 * @param isoDate - ISO date string
 * @returns ISO date string or empty string for null dates
 */
export function formatDateForSorting(isoDate: string | null | undefined): string {
  return isoDate && isoDate !== 'null' ? isoDate : '';
}

/**
 * Check if a date string is valid
 * @param isoDate - ISO date string
 * @returns boolean indicating if the date is valid
 */
export function isValidDate(isoDate: string | null | undefined): boolean {
  if (!isoDate || isoDate === 'null') {
    return false;
  }

  try {
    const date = new Date(isoDate + 'T00:00:00.000Z');
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}
