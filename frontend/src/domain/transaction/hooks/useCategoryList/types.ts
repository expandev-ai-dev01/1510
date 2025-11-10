import type { Category } from '../../types';

export interface UseCategoryListOptions {
  filterType?: 'todos' | 'despesa' | 'receita';
}

export interface UseCategoryListReturn {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
}
