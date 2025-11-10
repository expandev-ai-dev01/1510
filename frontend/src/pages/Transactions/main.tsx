import { useState } from 'react';
import { useTransactionList } from '@/domain/transaction/hooks/useTransactionList';
import { useTransactionMutations } from '@/domain/transaction/hooks/useTransactionMutations';
import { useBalance } from '@/domain/transaction/hooks/useBalance';
import { TransactionForm } from '@/domain/transaction/components/TransactionForm';
import { TransactionList } from '@/domain/transaction/components/TransactionList';
import { BalanceCard } from '@/domain/transaction/components/BalanceCard';
import { TransactionFilters } from '@/domain/transaction/components/TransactionFilters';
import type { Transaction, TransactionFormData } from '@/domain/transaction/types';

export const TransactionsPage = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [filterType, setFilterType] = useState<'todos' | 'despesas' | 'receitas'>('todos');
  const [filterCategory, setFilterCategory] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc'>(
    'data_desc'
  );
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

  const { transactions, isLoading: loadingTransactions } = useTransactionList({
    month,
    year,
    filterType,
    filterCategory,
    sortBy,
  });

  const { balance, isLoading: loadingBalance } = useBalance({ month, year });

  const { create, update, remove, isCreating, isUpdating, isRemoving } = useTransactionMutations();

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      if (editingTransaction) {
        await update(editingTransaction.id, data);
      } else {
        await create(data);
      }
      setShowForm(false);
      setEditingTransaction(undefined);
    } catch (error: unknown) {
      console.error('Error submitting transaction:', error);
      alert('Erro ao salvar transação. Tente novamente.');
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
    } catch (error: unknown) {
      console.error('Error deleting transaction:', error);
      alert('Erro ao excluir transação. Tente novamente.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transações Financeiras</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nova Transação
          </button>
        )}
      </div>

      <BalanceCard balance={balance} isLoading={loadingBalance} />

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isCreating || isUpdating}
          />
        </div>
      ) : (
        <>
          <TransactionFilters
            month={month}
            year={year}
            filterType={filterType}
            filterCategory={filterCategory}
            sortBy={sortBy}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onFilterTypeChange={setFilterType}
            onFilterCategoryChange={setFilterCategory}
            onSortByChange={setSortBy}
          />

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lista de Transações</h2>
            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={loadingTransactions || isRemoving}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsPage;
