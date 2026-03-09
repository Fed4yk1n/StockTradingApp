import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get('/order/admin/all')
            .then(res => setOrders(res.data))
            .catch(() => toast.error('Failed to load orders'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">All Orders</h1>
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
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
                                    <td style={{ color: '#a0a0b0', fontSize: '0.85rem' }}>{o.user}</td>
                                    <td>{o.stock}</td>
                                    <td style={{ fontWeight: 700, color: '#e94560' }}>{o.stockSymbol}</td>
                                    <td><span className={`badge badge-${o.orderType}`}>{o.orderType.toUpperCase()}</span></td>
                                    <td>{o.quantity}</td>
                                    <td>${o.price.toFixed(2)}</td>
                                    <td>${o.totalAmount.toFixed(2)}</td>
                                    <td style={{ color: '#a0a0b0', fontSize: '0.85rem' }}>{new Date(o.time).toLocaleString()}</td>
                                </tr>
                            ))}
                            {orders.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center', color: '#a0a0b0', padding: '2rem' }}>No orders</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllOrders;
