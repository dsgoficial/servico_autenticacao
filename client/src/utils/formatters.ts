// Path: utils\formatters.ts
/**
 * Utility functions for formatting data
 */

/**
 * Formats a date string or Date object to a localized date string (DD/MM/YYYY)
 *
 * @param dateString String date or Date object to format
 * @param options Optional Intl.DateTimeFormatOptions for customizing the output
 * @returns Formatted date string or empty string if input is invalid
 */
export const formatDate = (
  dateString?: string | Date | null,
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (!dateString) return '';

  try {
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;

    // Default options for date formatting
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    // Use provided options or default
    const finalOptions = options || defaultOptions;

    return new Intl.DateTimeFormat('pt-BR', finalOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
