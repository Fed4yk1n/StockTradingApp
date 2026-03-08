import express from 'express';
import { buyOrder, sellOrder, getUserOrders, getAllOrders, getPortfolio } from '../controllers/orderController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/buy', authenticate, buyOrder);
router.post('/sell', authenticate, sellOrder);
router.get('/all', authenticate, getUserOrders);
router.get('/admin/all', authenticate, isAdmin, getAllOrders);
router.get('/portfolio', authenticate, getPortfolio);

export default router;
