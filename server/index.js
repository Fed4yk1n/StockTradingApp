import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoute from './Routes/userRoute.js';
import transactionRoute from './Routes/transactionRoute.js';
import stockRoute from './Routes/stockRoute.js';
import orderRoute from './Routes/orderRoute.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/stock', stockRoute);
app.use('/api/order', orderRoute);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
