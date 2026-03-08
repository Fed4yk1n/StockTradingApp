import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: String, required: true },
    stock: { type: String, required: true },
    stockSymbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    orderType: { type: String, required: true },
    status: { type: String, default: 'completed' },
    time: { type: String }
});

export const Order = mongoose.model('orders', orderSchema);
