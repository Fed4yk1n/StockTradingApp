import { Transaction } from '../Schemas.js';
import { User } from '../Schemas.js';

export const deposit = async (req, res) => {
    try {
        const { amount, paymentMode } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.balance += Number(amount);
        await user.save();
        const transaction = new Transaction({
            user: req.user.id,
            type: 'deposit',
            paymentMode: paymentMode || 'card',
            amount: Number(amount),
            time: new Date().toISOString()
        });
        await transaction.save();
        res.json({ message: 'Deposit successful', balance: user.balance, transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const withdraw = async (req, res) => {
    try {
        const { amount, paymentMode } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        user.balance -= Number(amount);
        await user.save();
        const transaction = new Transaction({
            user: req.user.id,
            type: 'withdraw',
            paymentMode: paymentMode || 'card',
            amount: Number(amount),
            time: new Date().toISOString()
        });
        await transaction.save();
        res.json({ message: 'Withdrawal successful', balance: user.balance, transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ time: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ time: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
