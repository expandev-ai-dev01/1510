import { authenticatedClient } from '@/core/lib/api';
import type { Transaction, TransactionFormData, TransactionListParams, Balance } from '../types';
import type { ApiResponse } from '@/core/types';

export const transactionService = {
  async list(params: TransactionListParams): Promise<Transaction[]> {
    const response = await authenticatedClient.get<ApiResponse<Transaction[]>>('/transaction', {
      params,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Transaction> {
    const response = await authenticatedClient.get<ApiResponse<Transaction>>(`/transaction/${id}`);
    return response.data.data;
  },

  async create(data: TransactionFormData): Promise<Transaction> {
    const response = await authenticatedClient.post<ApiResponse<Transaction>>('/transaction', data);
    return response.data.data;
  },

  async update(id: string, data: TransactionFormData): Promise<Transaction> {
    const response = await authenticatedClient.put<ApiResponse<Transaction>>(
      `/transaction/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await authenticatedClient.delete(`/transaction/${id}`);
  },

  async getBalance(month: number, year: number): Promise<Balance> {
    const response = await authenticatedClient.get<ApiResponse<Balance>>('/transaction/balance', {
      params: { month, year },
    });
    return response.data.data;
  },
};
