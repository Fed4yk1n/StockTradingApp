import express from 'express';
import { getAllStocks, getStockBySymbol, addStock, updateStock } from '../controllers/stockController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/all', getAllStocks);
router.get('/:symbol', getStockBySymbol);
router.post('/add', authenticate, isAdmin, addStock);
router.put('/update/:symbol', authenticate, isAdmin, updateStock);

export default router;
