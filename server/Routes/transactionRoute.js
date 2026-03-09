import express from 'express';
import { deposit, withdraw, getUserTransactions, getAllTransactions } from '../controllers/transactionController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/deposit', authenticate, deposit);
router.post('/withdraw', authenticate, withdraw);
router.get('/all', authenticate, getUserTransactions);
router.get('/admin/all', authenticate, isAdmin, getAllTransactions);

export default router;
