import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';

const AllTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get('/transaction/admin/all')
            .then(res => setTransactions(res.data))
            .catch(() => toast.error('Failed to load transactions'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Loading transactions...</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">All Transactions</h1>
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Payment Mode</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t._id}>
                                    <td style={{ color: '#a0a0b0', fontSize: '0.85rem' }}>{t.user}</td>
                                    <td><span className={`badge badge-${t.type}`}>{t.type.toUpperCase()}</span></td>
                                    <td style={{ fontWeight: 600 }}>${t.amount.toFixed(2)}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{t.paymentMode}</td>
                                    <td style={{ color: '#a0a0b0', fontSize: '0.85rem' }}>{new Date(t.time).toLocaleString()}</td>
                                </tr>
                            ))}
                            {transactions.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#a0a0b0', padding: '2rem' }}>No transactions</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllTransactions;
