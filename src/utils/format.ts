/**
 * Format a date string for display (e.g., "Fri 11/07/2025").
 * @param {string} dateString - The date string to format (YYYY-MM-DD).
 * @returns {string} The formatted date string.
 */
export const formatDateForDisplay = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) return null;

  // Parse date in local timezone by appending time to prevent UTC interpretation
  const date = new Date(dateString + "T00:00:00");
  if (isNaN(date.getTime())) return null;

  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    date
  );
  const dateStr = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return `${weekday} ${dateStr}`;
};

/**
 * Format a date string for datetime attribute (ISO format).
 * @param {string} dateString - The date string to format (YYYY-MM-DD).
 * @returns {string} The ISO formatted date string.
 */
export const formatDateForDateTime = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) return null;

  // Return the date string as-is since it's already in YYYY-MM-DD format
  return dateString;
};

/**
 * Format a price number as currency.
 * @param {number} price - The price to format.
 * @returns {string} The formatted price string.
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
