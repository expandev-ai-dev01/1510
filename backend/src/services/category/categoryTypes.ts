export interface CategoryEntity {
  idCategory: number;
  name: string;
  type: 'despesa' | 'receita' | 'ambos';
  predefined: boolean;
}

export interface CategoryListRequest {
  filterType?: 'todos' | 'despesa' | 'receita';
}
