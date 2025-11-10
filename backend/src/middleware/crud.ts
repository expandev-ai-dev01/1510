import { Request } from 'express';
import { z } from 'zod';
import { ApiError } from './error';

export interface CrudPermission {
  securable: string;
  permission: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export interface ValidatedRequest<T = any> {
  credential: {
    idAccount: number;
    idUser: number;
  };
  params: T;
}

export class CrudController {
  private permissions: CrudPermission[];

  constructor(permissions: CrudPermission[]) {
    this.permissions = permissions;
  }

  async create<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | undefined, ApiError | undefined]> {
    return this.validateRequest(req, schema, 'CREATE');
  }

  async read<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | undefined, ApiError | undefined]> {
    return this.validateRequest(req, schema, 'READ');
  }

  async update<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | undefined, ApiError | undefined]> {
    return this.validateRequest(req, schema, 'UPDATE');
  }

  async delete<T>(
    req: Request,
    schema: z.ZodSchema<T>
  ): Promise<[ValidatedRequest<T> | undefined, ApiError | undefined]> {
    return this.validateRequest(req, schema, 'DELETE');
  }

  private async validateRequest<T>(
    req: Request,
    schema: z.ZodSchema<T>,
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'
  ): Promise<[ValidatedRequest<T> | undefined, ApiError | undefined]> {
    try {
      const params = await schema.parseAsync({ ...req.params, ...req.body, ...req.query });

      const validated: ValidatedRequest<T> = {
        credential: {
          idAccount: 1,
          idUser: 1,
        },
        params: params as T,
      };

      return [validated, undefined];
    } catch (error: any) {
      const apiError: ApiError = {
        name: 'ValidationError',
        message: 'Validation failed',
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        details: error.errors,
      };
      return [undefined, apiError];
    }
  }
}

export const successResponse = <T>(data: T, metadata?: any) => ({
  success: true,
  data,
  ...(metadata && { metadata }),
  timestamp: new Date().toISOString(),
});

export const errorResponse = (message: string, code?: string) => ({
  success: false,
  error: {
    code: code || 'ERROR',
    message,
  },
  timestamp: new Date().toISOString(),
});

export const StatusGeneralError: ApiError = {
  name: 'GeneralError',
  message: 'An unexpected error occurred',
  statusCode: 500,
  code: 'GENERAL_ERROR',
};
