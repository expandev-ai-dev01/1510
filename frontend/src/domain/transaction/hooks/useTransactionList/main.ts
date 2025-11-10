import { useQuery } from '@tanstack/react-query';
import { transactionService } from '../../services/transactionService';
import type { UseTransactionListOptions, UseTransactionListReturn } from './types';

export const useTransactionList = (
  options: UseTransactionListOptions
): UseTransactionListReturn => {
  const queryKey = ['transactions', options];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => transactionService.list(options),
  });

  return {
    transactions: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
