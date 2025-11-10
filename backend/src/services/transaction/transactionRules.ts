import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TransactionListRequest,
  TransactionEntity,
  BalanceSummary,
  TransactionCreateResult,
} from './transactionTypes';

export async function transactionCreate(
  params: TransactionCreateRequest
): Promise<TransactionCreateResult> {
  const result = await dbRequest<TransactionCreateResult>(
    '[functional].[spTransactionCreate]',
    {
      type: params.type,
      value: params.value,
      date: params.date,
      idCategory: params.idCategory,
      description: params.description || null,
    },
    ExpectedReturn.Single
  );

  return result;
}

export async function transactionList(
  params: TransactionListRequest
): Promise<TransactionEntity[]> {
  const result = await dbRequest<TransactionEntity[]>(
    '[functional].[spTransactionList]',
    {
      month: params.month,
      year: params.year,
      filterType: params.filterType || 'todos',
      filterCategory: params.filterCategory || null,
      sortBy: params.sortBy || 'data_desc',
    },
    ExpectedReturn.Single
  );

  return Array.isArray(result) ? result : [];
}

export async function transactionGet(idTransaction: string): Promise<TransactionEntity> {
  const result = await dbRequest<TransactionEntity>(
    '[functional].[spTransactionGet]',
    { idTransaction },
    ExpectedReturn.Single
  );

  return result;
}

export async function transactionUpdate(
  params: TransactionUpdateRequest
): Promise<{ idTransaction: string }> {
  const result = await dbRequest<{ idTransaction: string }>(
    '[functional].[spTransactionUpdate]',
    {
      idTransaction: params.idTransaction,
      type: params.type,
      value: params.value,
      date: params.date,
      idCategory: params.idCategory,
      description: params.description || null,
    },
    ExpectedReturn.Single
  );

  return result;
}

export async function transactionDelete(idTransaction: string): Promise<{ idTransaction: string }> {
  const result = await dbRequest<{ idTransaction: string }>(
    '[functional].[spTransactionDelete]',
    { idTransaction },
    ExpectedReturn.Single
  );

  return result;
}

export async function transactionBalance(month: number, year: number): Promise<BalanceSummary> {
  const result = await dbRequest<BalanceSummary>(
    '[functional].[spTransactionBalance]',
    { month, year },
    ExpectedReturn.Single
  );

  return result;
}
