import type { Balance } from '../../types';

export interface UseBalanceOptions {
  month: number;
  year: number;
}

export interface UseBalanceReturn {
  balance: Balance | null;
  isLoading: boolean;
  error: Error | null;
}
