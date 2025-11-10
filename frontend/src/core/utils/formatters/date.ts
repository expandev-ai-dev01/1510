import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * @utility formatDate
 * @summary Formats a date string or Date object to Brazilian format.
 * @domain core
 * @type formatter-utility
 * @category formatting
 */
export const formatDate = (date: string | Date, pattern: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, pattern, { locale: ptBR });
};

/**
 * @utility formatDateTime
 * @summary Formats a date string or Date object to Brazilian datetime format.
 * @domain core
 * @type formatter-utility
 * @category formatting
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};
