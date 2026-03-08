import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';
import { useGeneral } from '../context/GeneralContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

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

const StockChart = () => {
    const { symbol } = useParams();
    const { user, updateUser } = useGeneral();
    const [stock, setStock] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [tradeLoading, setTradeLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStock();
    }, [symbol]);

    const fetchStock = async () => {
        try {
            const res = await axiosInstance.get(`/stock/${symbol}`);
            setStock(res.data);
            setChartData(generateChartData(res.data.price));
        } catch (err) {
            toast.error('Stock not found');
            navigate('/home');
        } finally {
            setLoading(false);
        }
    };

    const handleTrade = async (type) => {
        if (quantity < 1) return toast.error('Quantity must be at least 1');
        setTradeLoading(true);
        try {
            const endpoint = type === 'buy' ? '/order/buy' : '/order/sell';
            const res = await axiosInstance.post(endpoint, { stockSymbol: symbol, quantity: Number(quantity) });
            toast.success(res.data.message);
            updateUser({ ...user, balance: res.data.balance });
            fetchStock();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Trade failed');
        } finally {
            setTradeLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading stock data...</div>;
    if (!stock) return null;

    const totalCost = (stock.price * quantity).toFixed(2);

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{stock.symbol}</h1>
                    <p style={{ color: '#a0a0b0' }}>{stock.name} · {stock.exchange}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>${stock.price.toFixed(2)}</div>
                    <div className={stock.change >= 0 ? 'positive' : 'negative'} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                        {stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        {Math.abs(stock.change).toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>30-Day Price History</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e94560" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#16213e" />
                        <XAxis dataKey="date" stroke="#a0a0b0" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#a0a0b0" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #16213e', borderRadius: '8px' }} labelStyle={{ color: '#a0a0b0' }} itemStyle={{ color: '#e94560' }} />
                        <Area type="monotone" dataKey="price" stroke="#e94560" fill="url(#colorPrice)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Stock Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: 'Volume', value: stock.volume.toLocaleString() },
                            { label: 'Market Cap', value: `$${(stock.marketCap / 1e9).toFixed(2)}B` },
                            { label: 'Last Updated', value: new Date(stock.lastUpdated).toLocaleDateString() },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#0b0b1a', borderRadius: '6px' }}>
                                <span style={{ color: '#a0a0b0', fontSize: '0.9rem' }}>{label}</span>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Place Order</h3>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
                    </div>
                    <div style={{ background: '#0b0b1a', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#a0a0b0' }}>Price per share</span>
                            <span>${stock.price.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid #16213e', paddingTop: '0.5rem' }}>
                            <span>Total</span>
                            <span style={{ color: '#e94560' }}>${totalCost}</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button className="btn-success" onClick={() => handleTrade('buy')} disabled={tradeLoading}>Buy</button>
                        <button className="btn-danger" onClick={() => handleTrade('sell')} disabled={tradeLoading}>Sell</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockChart;
