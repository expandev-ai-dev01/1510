export interface TransactionEntity {
  idTransaction: string;
  type: 'despesa' | 'receita';
  value: number;
  displayValue: number;
  date: Date;
  idCategory: number;
  categoryName: string;
  description: string | null;
  dateCreated: Date;
}

export interface TransactionCreateRequest {
  type: 'despesa' | 'receita';
  value: number;
  date: Date;
  idCategory: number;
  description?: string | null;
}

export interface TransactionUpdateRequest {
  idTransaction: string;
  type: 'despesa' | 'receita';
  value: number;
  date: Date;
  idCategory: number;
  description?: string | null;
}

export interface TransactionListRequest {
  month: number;
  year: number;
  filterType?: 'todos' | 'despesas' | 'receitas';
  filterCategory?: number | null;
  sortBy?: 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc';
}

export interface BalanceSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface TransactionCreateResult {
  idTransaction: string;
}
