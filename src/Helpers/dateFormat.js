import { format } from 'date-fns';

/**
 * Format a JS Date or date string to dd/mm/yyyy
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDateDMY(date) {
  if (!date) return '';
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch {
    return '';
  }
}
