import { authenticatedClient } from '@/core/lib/api';
import type { Category } from '../types';
import type { ApiResponse } from '@/core/types';

export const categoryService = {
  async list(filterType?: 'todos' | 'despesa' | 'receita'): Promise<Category[]> {
    const response = await authenticatedClient.get<ApiResponse<Category[]>>('/category', {
      params: { filterType },
    });
    return response.data.data;
  },
};
