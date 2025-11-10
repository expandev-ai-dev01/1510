import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryListOptions, UseCategoryListReturn } from './types';

export const useCategoryList = (options: UseCategoryListOptions = {}): UseCategoryListReturn => {
  const queryKey = ['categories', options.filterType];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => categoryService.list(options.filterType),
  });

  return {
    categories: data || [],
    isLoading,
    error: error as Error | null,
  };
};
