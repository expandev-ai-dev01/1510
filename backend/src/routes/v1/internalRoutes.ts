import { Router } from 'express';
import * as transactionController from '@/api/v1/internal/transaction/controller';
import * as transactionBalanceController from '@/api/v1/internal/transaction/balance/controller';
import * as categoryController from '@/api/v1/internal/category/controller';

const router = Router();

router.get('/transaction', transactionController.getListHandler);
router.post('/transaction', transactionController.postHandler);
router.get('/transaction/balance', transactionBalanceController.getHandler);
router.get('/transaction/:id', transactionController.getHandler);
router.put('/transaction/:id', transactionController.putHandler);
router.delete('/transaction/:id', transactionController.deleteHandler);

router.get('/category', categoryController.getHandler);

export default router;
