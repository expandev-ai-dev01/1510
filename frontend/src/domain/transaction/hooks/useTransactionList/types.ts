import type { Transaction, TransactionListParams } from '../../types';

export interface UseTransactionListOptions {
  month: number;
  year: number;
  filterType?: 'todos' | 'despesas' | 'receitas';
  filterCategory?: number;
  sortBy?: 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc';
}

export interface UseTransactionListReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
