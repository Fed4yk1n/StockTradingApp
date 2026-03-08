import { Stock } from '../Schemas.js';

export const getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStockBySymbol = async (req, res) => {
    try {
        const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
        if (!stock) return res.status(404).json({ message: 'Stock not found' });
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addStock = async (req, res) => {
    try {
        const { symbol, name, exchange, price, change, changePercent, volume, marketCap } = req.body;
        const existing = await Stock.findOne({ symbol: symbol.toUpperCase() });
        if (existing) {
            return res.status(400).json({ message: 'Stock already exists' });
        }
        const stock = new Stock({
            symbol: symbol.toUpperCase(),
            name,
            exchange,
            price,
            change: change || 0,
            changePercent: changePercent || 0,
            volume: volume || 0,
            marketCap: marketCap || 0,
            lastUpdated: new Date()
        });
        await stock.save();
        res.status(201).json({ message: 'Stock added successfully', stock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStock = async (req, res) => {
    try {
        const stock = await Stock.findOneAndUpdate(
            { symbol: req.params.symbol.toUpperCase() },
            { ...req.body, lastUpdated: new Date() },
            { new: true }
        );
        if (!stock) return res.status(404).json({ message: 'Stock not found' });
        res.json({ message: 'Stock updated successfully', stock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
