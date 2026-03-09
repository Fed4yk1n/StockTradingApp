import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

const History = () => {
    const [orders, setOrders] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('orders');

    useEffect(() => { fetchHistory(); }, []);

    const fetchHistory = async () => {
        try {
            const [ordersRes, txRes] = await Promise.all([
                axiosInstance.get('/order/all'),
                axiosInstance.get('/transaction/all')
            ]);
            setOrders(ordersRes.data);
            setTransactions(txRes.data);
        } catch (err) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading history...</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Trade History</h1>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={() => setTab('orders')} className={tab === 'orders' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.6rem 1.5rem' }}>Orders ({orders.length})</button>
                <button onClick={() => setTab('transactions')} className={tab === 'transactions' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.6rem 1.5rem' }}>Transactions ({transactions.length})</button>
            </div>

            {tab === 'orders' && (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Stock</th>
                                    <th>Symbol</th>
                                    <th>Type</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o._id}>
                                        <td>{o.stock}</td>
                                        <td style={{ fontWeight: 700, color: '#e94560' }}>{o.stockSymbol}</td>
                                        <td><span className={`badge badge-${o.orderType}`}>{o.orderType.toUpperCase()}</span></td>
                                        <td>{o.quantity}</td>
                                        <td>${o.price.toFixed(2)}</td>
                                        <td>${o.totalAmount.toFixed(2)}</td>
                                        <td style={{ color: '#a0a0b0', fontSize: '0.85rem' }}>{new Date(o.time).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {orders.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', color: '#a0a0b0', padding: '2rem' }}>No orders yet</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'transactions' && (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Payment Mode</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t._id}>
                                        <td><span className={`badge badge-${t.type}`}>{t.type.toUpperCase()}</span></td>
                                        <td style={{ fontWeight: 600 }}>${t.amount.toFixed(2)}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{t.paymentMode}</td>
                                        <td style={{ color: '#a0a0b0', fontSize: '0.85rem' }}>{new Date(t.time).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: '#a0a0b0', padding: '2rem' }}>No transactions yet</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
