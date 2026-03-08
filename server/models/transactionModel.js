import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    user: { type: String, required: true },
    type: { type: String, required: true },
    paymentMode: { type: String, required: true },
    amount: { type: Number, required: true },
    time: { type: String }
});

export const Transaction = mongoose.model('transactions', transactionSchema);
