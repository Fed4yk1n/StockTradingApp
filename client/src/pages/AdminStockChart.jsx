import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateChartData = (basePrice) => {
    const data = [];
    let price = basePrice * 0.9;
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        price = price + (Math.random() - 0.48) * basePrice * 0.03;
        price = Math.max(price, basePrice * 0.5);
        data.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: parseFloat(price.toFixed(2))
        });
    }
    data[data.length - 1].price = basePrice;
    return data;
};

const AdminStockChart = () => {
    const { symbol } = useParams();
    const [stock, setStock] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ price: '', change: '', changePercent: '', volume: '' });
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { fetchStock(); }, [symbol]);

    const fetchStock = async () => {
        try {
            const res = await axiosInstance.get(`/stock/${symbol}`);
            setStock(res.data);
            setChartData(generateChartData(res.data.price));
            setForm({ price: res.data.price, change: res.data.change, changePercent: res.data.changePercent, volume: res.data.volume });
        } catch (err) {
            toast.error('Stock not found');
            navigate('/admin');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await axiosInstance.put(`/stock/update/${symbol}`, form);
            toast.success('Stock updated successfully!');
            fetchStock();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!stock) return null;

    return (
        <div className="page-container">
            <h1 className="page-title">{stock.symbol} - Admin View</h1>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>30-Day Price History</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#533483" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#533483" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#16213e" />
                        <XAxis dataKey="date" stroke="#a0a0b0" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#a0a0b0" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #16213e', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="price" stroke="#533483" fill="url(#colorAdmin)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="card" style={{ maxWidth: '500px' }}>
                <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Update Stock Data</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Price ($)</label>
                        <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Change</label>
                        <input type="number" step="0.01" value={form.change} onChange={e => setForm({ ...form, change: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Change %</label>
                        <input type="number" step="0.01" value={form.changePercent} onChange={e => setForm({ ...form, changePercent: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Volume</label>
                        <input type="number" value={form.volume} onChange={e => setForm({ ...form, volume: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={updating}>
                        {updating ? 'Updating...' : 'Update Stock'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminStockChart;
