import { Order } from '../Schemas.js';
import { Stock } from '../Schemas.js';
import { User } from '../Schemas.js';

export const buyOrder = async (req, res) => {
    try {
        const { stockSymbol, quantity } = req.body;
        const stock = await Stock.findOne({ symbol: stockSymbol.toUpperCase() });
        if (!stock) return res.status(404).json({ message: 'Stock not found' });
        const totalAmount = stock.price * quantity;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.balance < totalAmount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        user.balance -= totalAmount;
        await user.save();
        const order = new Order({
            user: req.user.id,
            stock: stock.name,
            stockSymbol: stock.symbol,
            quantity: Number(quantity),
            price: stock.price,
            totalAmount,
            orderType: 'buy',
            status: 'completed',
            time: new Date().toISOString()
        });
        await order.save();
        res.status(201).json({ message: 'Buy order placed successfully', order, balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sellOrder = async (req, res) => {
    try {
        const { stockSymbol, quantity } = req.body;
        const stock = await Stock.findOne({ symbol: stockSymbol.toUpperCase() });
        if (!stock) return res.status(404).json({ message: 'Stock not found' });

        // Check if user has enough shares
        const buyOrders = await Order.find({ user: req.user.id, stockSymbol: stockSymbol.toUpperCase(), orderType: 'buy', status: 'completed' });
        const sellOrders = await Order.find({ user: req.user.id, stockSymbol: stockSymbol.toUpperCase(), orderType: 'sell', status: 'completed' });
        const totalBought = buyOrders.reduce((sum, o) => sum + o.quantity, 0);
        const totalSold = sellOrders.reduce((sum, o) => sum + o.quantity, 0);
        const available = totalBought - totalSold;
        if (available < quantity) {
            return res.status(400).json({ message: 'Insufficient shares to sell' });
        }

        const totalAmount = stock.price * quantity;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.balance += totalAmount;
        await user.save();

        const order = new Order({
            user: req.user.id,
            stock: stock.name,
            stockSymbol: stock.symbol,
            quantity: Number(quantity),
            price: stock.price,
            totalAmount,
            orderType: 'sell',
            status: 'completed',
            time: new Date().toISOString()
        });
        await order.save();
        res.status(201).json({ message: 'Sell order placed successfully', order, balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ time: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ time: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPortfolio = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id, status: 'completed' });
        const portfolio = {};
        orders.forEach(order => {
            const sym = order.stockSymbol;
            if (!portfolio[sym]) {
                portfolio[sym] = { stockSymbol: sym, stock: order.stock, quantity: 0, totalInvested: 0, avgPrice: 0 };
            }
            if (order.orderType === 'buy') {
                portfolio[sym].totalInvested += order.totalAmount;
                portfolio[sym].quantity += order.quantity;
            } else {
                // Reduce totalInvested proportionally using average cost basis, not sell price
                const avgCost = portfolio[sym].quantity > 0 ? portfolio[sym].totalInvested / portfolio[sym].quantity : 0;
                portfolio[sym].quantity -= order.quantity;
                portfolio[sym].totalInvested -= avgCost * order.quantity;
            }
        });
        // Remove stocks with 0 or negative quantity
        const result = Object.values(portfolio).filter(p => p.quantity > 0);
        // Calculate avg price
        result.forEach(p => {
            p.avgPrice = p.quantity > 0 ? p.totalInvested / p.quantity : 0;
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
