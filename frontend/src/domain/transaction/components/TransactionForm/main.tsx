import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategoryList } from '../../hooks/useCategoryList';
import type { TransactionFormProps } from './types';
import type { TransactionFormData } from '../../types';

const transactionSchema = z.object({
  type: z.enum(['despesa', 'receita']),
  value: z.number().positive('Valor deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  idCategory: z.number().positive('Selecione uma categoria'),
  description: z.string().max(100, 'Máximo de 100 caracteres').optional(),
});

export const TransactionForm = (props: TransactionFormProps) => {
  const { transaction, onSubmit, onCancel, isSubmitting = false } = props;
  const { categories, isLoading: loadingCategories } = useCategoryList();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          value: Math.abs(transaction.value),
          date: transaction.date.split('T')[0],
          idCategory: transaction.idCategory,
          description: transaction.description || '',
        }
      : {
          type: 'despesa',
          value: 0,
          date: new Date().toISOString().split('T')[0],
          idCategory: 0,
          description: '',
        },
  });

  const transactionType = watch('type');

  const filteredCategories = categories.filter(
    (cat) => cat.type === transactionType || cat.type === 'ambos'
  );

  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
        <select
          {...register('type')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>
        {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
        <input
          type="number"
          step="0.01"
          {...register('value', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.value && <p className="text-red-600 text-sm mt-1">{errors.value.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
        <input
          type="date"
          {...register('date')}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
        <select
          {...register('idCategory', { valueAsNumber: true })}
          disabled={loadingCategories}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        >
          <option value={0}>Selecione uma categoria</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.idCategory && (
          <p className="text-red-600 text-sm mt-1">{errors.idCategory.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
        <input
          type="text"
          {...register('description')}
          maxLength={100}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Salvando...' : transaction ? 'Atualizar' : 'Cadastrar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
