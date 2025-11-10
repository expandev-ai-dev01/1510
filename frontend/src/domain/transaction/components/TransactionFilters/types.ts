export interface TransactionFiltersProps {
  month: number;
  year: number;
  filterType: 'todos' | 'despesas' | 'receitas';
  filterCategory?: number;
  sortBy: 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc';
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onFilterTypeChange: (type: 'todos' | 'despesas' | 'receitas') => void;
  onFilterCategoryChange: (categoryId?: number) => void;
  onSortByChange: (sortBy: 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc') => void;
}
