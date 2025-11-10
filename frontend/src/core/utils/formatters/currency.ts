/**
 * @utility formatCurrency
 * @summary Formats a number as Brazilian Real currency.
 * @domain core
 * @type formatter-utility
 * @category formatting
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
