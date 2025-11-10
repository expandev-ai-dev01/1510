export interface Transaction {
  id: string;
  type: 'despesa' | 'receita';
  value: number;
  date: string;
  idCategory: number;
  description: string | null;
  createdAt: string;
}

export interface TransactionFormData {
  type: 'despesa' | 'receita';
  value: number;
  date: string;
  idCategory: number;
  description?: string;
}

export interface TransactionListParams {
  month: number;
  year: number;
  filterType?: 'todos' | 'despesas' | 'receitas';
  filterCategory?: number;
  sortBy?: 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc';
}

export interface Balance {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface Category {
  id: number;
  name: string;
  type: 'despesa' | 'receita' | 'ambos';
  predefined: boolean;
}
