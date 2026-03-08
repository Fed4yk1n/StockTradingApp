import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    exchange: { type: String, required: true },
    price: { type: Number, required: true },
    change: { type: Number, default: 0 },
    changePercent: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    marketCap: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

export const Stock = mongoose.model('stocks', stockSchema);
