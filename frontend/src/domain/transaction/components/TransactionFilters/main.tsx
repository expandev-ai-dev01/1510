import { useCategoryList } from '../../hooks/useCategoryList';
import type { TransactionFiltersProps } from './types';

export const TransactionFilters = (props: TransactionFiltersProps) => {
  const {
    month,
    year,
    filterType,
    filterCategory,
    sortBy,
    onMonthChange,
    onYearChange,
    onFilterTypeChange,
    onFilterCategoryChange,
    onSortByChange,
  } = props;

  const { categories } = useCategoryList();

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
          <select
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={filterType}
            onChange={(e) =>
              onFilterTypeChange(e.target.value as 'todos' | 'despesas' | 'receitas')
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos</option>
            <option value="despesas">Despesas</option>
            <option value="receitas">Receitas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            value={filterCategory || ''}
            onChange={(e) =>
              onFilterCategoryChange(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortByChange(
                e.target.value as 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc'
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="data_desc">Data (mais recente)</option>
            <option value="data_asc">Data (mais antiga)</option>
            <option value="valor_desc">Valor (maior)</option>
            <option value="valor_asc">Valor (menor)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
