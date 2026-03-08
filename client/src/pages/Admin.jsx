import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';
import { FaUsers, FaShoppingCart, FaExchangeAlt, FaChartLine } from 'react-icons/fa';

const Admin = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, transactions: 0, stocks: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const [usersRes, ordersRes, txRes, stocksRes] = await Promise.all([
                axiosInstance.get('/user/all'),
                axiosInstance.get('/order/admin/all'),
                axiosInstance.get('/transaction/admin/all'),
                axiosInstance.get('/stock/all')
            ]);
            setStats({
                users: usersRes.data.length,
                orders: ordersRes.data.length,
                transactions: txRes.data.length,
                stocks: stocksRes.data.length
            });
        } catch (err) {
            toast.error('Failed to load admin stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading admin dashboard...</div>;

    const cards = [
        { icon: <FaUsers />, label: 'Total Users', value: stats.users, color: '#533483' },
        { icon: <FaShoppingCart />, label: 'Total Orders', value: stats.orders, color: '#e94560' },
        { icon: <FaExchangeAlt />, label: 'Transactions', value: stats.transactions, color: '#00c853' },
        { icon: <FaChartLine />, label: 'Listed Stocks', value: stats.stocks, color: '#0f3460' },
    ];

    return (
        <div className="page-container">
            <h1 className="page-title">Admin Dashboard</h1>
            <div className="stats-grid">
                {cards.map((c, i) => (
                    <div key={i} className="stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
                        <div style={{ fontSize: '2rem', color: c.color, marginBottom: '0.75rem' }}>{c.icon}</div>
                        <div className="stat-value" style={{ color: c.color }}>{c.value}</div>
                        <div className="stat-label">{c.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;
