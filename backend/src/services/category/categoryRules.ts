import { dbRequest, ExpectedReturn } from '@/utils/database';
import { CategoryEntity, CategoryListRequest } from './categoryTypes';

export async function categoryList(params: CategoryListRequest): Promise<CategoryEntity[]> {
  const result = await dbRequest<CategoryEntity[]>(
    '[config].[spCategoryList]',
    {
      filterType: params.filterType || 'todos',
    },
    ExpectedReturn.Single
  );

  return Array.isArray(result) ? result : [];
}
