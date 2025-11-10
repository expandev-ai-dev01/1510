import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  transactionCreate,
  transactionList,
  transactionGet,
  transactionUpdate,
  transactionDelete,
} from '@/services/transaction';
import { zString, zNumeric, zDateString, zFK, zNullableString } from '@/utils/zodValidation';

const securable = 'TRANSACTION';

const createSchema = z.object({
  type: z.enum(['despesa', 'receita']),
  value: zNumeric.positive(),
  date: zDateString,
  idCategory: zFK,
  description: zNullableString(100),
});

const listSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1900).max(2100),
  filterType: z.enum(['todos', 'despesas', 'receitas']).optional(),
  filterCategory: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(['data_desc', 'data_asc', 'valor_desc', 'valor_asc']).optional(),
});

const getSchema = z.object({
  id: zString,
});

const updateSchema = z.object({
  id: zString,
  type: z.enum(['despesa', 'receita']),
  value: zNumeric.positive(),
  date: zDateString,
  idCategory: zFK,
  description: zNullableString(100),
});

const deleteSchema = z.object({
  id: zString,
});

export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, createSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as z.infer<typeof createSchema>;
    const result = await transactionCreate({
      type: data.type,
      value: data.value,
      date: new Date(data.date),
      idCategory: data.idCategory,
      description: data.description,
    });

    res.status(201).json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

export async function getListHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, listSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as z.infer<typeof listSchema>;
    const result = await transactionList({
      month: data.month,
      year: data.year,
      filterType: data.filterType,
      filterCategory: data.filterCategory,
      sortBy: data.sortBy,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, getSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as z.infer<typeof getSchema>;
    const result = await transactionGet(data.id);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const [validated, error] = await operation.update(req, updateSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as z.infer<typeof updateSchema>;
    const result = await transactionUpdate({
      idTransaction: data.id,
      type: data.type,
      value: data.value,
      date: new Date(data.date),
      idCategory: data.idCategory,
      description: data.description,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const [validated, error] = await operation.delete(req, deleteSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as z.infer<typeof deleteSchema>;
    const result = await transactionDelete(data.id);

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
