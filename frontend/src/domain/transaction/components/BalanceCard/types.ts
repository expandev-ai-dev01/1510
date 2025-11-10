import type { Balance } from '../../types';

export interface BalanceCardProps {
  balance: Balance | null;
  isLoading?: boolean;
}
