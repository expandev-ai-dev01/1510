import { formatCurrency } from '@/core/utils';
import type { BalanceCardProps } from './types';

export const BalanceCard = (props: BalanceCardProps) => {
  const { balance, isLoading = false } = props;

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">Carregando saldo...</div>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">Nenhum dado disponível</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Receitas</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(balance.totalReceitas)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Despesas</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(Math.abs(balance.totalDespesas))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Saldo</p>
          <p
            className={`text-2xl font-bold ${
              balance.saldo >= 0 ? 'text-blue-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(balance.saldo)}
          </p>
        </div>
      </div>
    </div>
  );
};
