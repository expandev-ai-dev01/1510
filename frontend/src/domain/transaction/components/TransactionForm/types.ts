import type { Transaction, TransactionFormData } from '../../types';

export interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
