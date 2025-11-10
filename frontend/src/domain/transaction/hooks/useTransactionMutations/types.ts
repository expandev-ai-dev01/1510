import type { Transaction, TransactionFormData } from '../../types';

export interface UseTransactionMutationsReturn {
  create: (data: TransactionFormData) => Promise<Transaction>;
  update: (id: string, data: TransactionFormData) => Promise<Transaction>;
  remove: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
}
