import { getPool } from '@/instances/database';
import sql from 'mssql';

export enum ExpectedReturn {
  None = 'None',
  Single = 'Single',
  Multi = 'Multi',
}

export interface IRecordSet<T = any> {
  recordset: T[];
}

export interface ICreateObjectResult {
  id: number;
}

export async function dbRequest<T = any>(
  routine: string,
  parameters: Record<string, any>,
  expectedReturn: ExpectedReturn.Single,
  transaction?: sql.Transaction
): Promise<T>;

export async function dbRequest(
  routine: string,
  parameters: Record<string, any>,
  expectedReturn: ExpectedReturn.Multi,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<IRecordSet<any>[] | Record<string, IRecordSet<any>>>;

export async function dbRequest(
  routine: string,
  parameters: Record<string, any>,
  expectedReturn: ExpectedReturn.None,
  transaction?: sql.Transaction
): Promise<void>;

export async function dbRequest(
  routine: string,
  parameters: Record<string, any> = {},
  expectedReturn: ExpectedReturn = ExpectedReturn.Single,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> {
  const pool = await getPool();
  const request = transaction ? new sql.Request(transaction) : pool.request();

  Object.entries(parameters).forEach(([key, value]) => {
    request.input(key, value);
  });

  const result = await request.execute(routine);

  switch (expectedReturn) {
    case ExpectedReturn.None:
      return;
    case ExpectedReturn.Single:
      return result.recordset[0];
    case ExpectedReturn.Multi:
      if (resultSetNames && resultSetNames.length > 0) {
        const namedResults: Record<string, IRecordSet<any>> = {};
        resultSetNames.forEach((name, index) => {
          if (Array.isArray(result.recordsets)) {
            namedResults[name] = { recordset: result.recordsets[index] || [] };
          }
        });
        return namedResults;
      }
      if (Array.isArray(result.recordsets)) {
        return result.recordsets.map((rs: any) => ({ recordset: rs }));
      }
      return [];
    default:
      throw new Error('Invalid ExpectedReturn type');
  }
}

export async function beginTransaction(): Promise<sql.Transaction> {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  return transaction;
}

export async function commitTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.commit();
}

export async function rollbackTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.rollback();
}
