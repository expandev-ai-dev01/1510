import { formatCurrency, formatDate } from '@/core/utils';
import type { TransactionListProps } from './types';

export const TransactionList = (props: TransactionListProps) => {
  const { transactions, onEdit, onDelete, isLoading = false } = props;

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Carregando transações...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhuma transação encontrada para o período selecionado.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-lg font-semibold ${
                    transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(Math.abs(transaction.value))}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
              {transaction.description && (
                <p className="text-sm text-gray-700 mt-1">{transaction.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(transaction)}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Deseja realmente excluir esta transação?')) {
                    onDelete(transaction.id);
                  }
                }}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
