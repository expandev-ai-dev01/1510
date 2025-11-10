import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../../services/transactionService';
import type { UseBalanceOptions, UseBalanceReturn } from './types';

export const useBalance = (options: UseBalanceOptions): UseBalanceReturn => {
  const queryKey = ['balance', options.month, options.year];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => transactionService.getBalance(options.month, options.year),
  });

  return {
    balance: data || null,
    isLoading,
    error: error as Error | null,
  };
};
