import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';
import { Link } from 'react-router-dom';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [stocks, setStocks] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchPortfolio(); }, []);

    const fetchPortfolio = async () => {
        try {
            const [portRes, stocksRes] = await Promise.all([
                axiosInstance.get('/order/portfolio'),
                axiosInstance.get('/stock/all')
            ]);
            setPortfolio(portRes.data);
            const stockMap = {};
            stocksRes.data.forEach(s => { stockMap[s.symbol] = s; });
            setStocks(stockMap);
        } catch (err) {
            toast.error('Failed to load portfolio');
        } finally {
            setLoading(false);
        }
    };

    const totalValue = portfolio.reduce((sum, p) => {
        const currentPrice = stocks[p.stockSymbol]?.price || p.avgPrice;
        return sum + currentPrice * p.quantity;
    }, 0);

    const totalInvested = portfolio.reduce((sum, p) => sum + p.avgPrice * p.quantity, 0);
    const totalPnL = totalValue - totalInvested;

    if (loading) return <div className="loading">Loading portfolio...</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">My Portfolio</h1>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className="stat-label">Portfolio Value</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className="stat-label">Total Invested</div>
                </div>
                <div className="stat-card">
                    <div className={`stat-value ${totalPnL >= 0 ? 'positive' : 'negative'}`}>{totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div className="stat-label">P&L</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{portfolio.length}</div>
                    <div className="stat-label">Holdings</div>
                </div>
            </div>

            {portfolio.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: '#a0a0b0', marginBottom: '1rem' }}>You have no holdings yet.</p>
                    <Link to="/home"><button className="btn-primary">Start Trading</button></Link>
                </div>
            ) : (
                <div className="card">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Name</th>
                                    <th>Qty</th>
                                    <th>Avg Buy Price</th>
                                    <th>Current Price</th>
                                    <th>Current Value</th>
                                    <th>P&L</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.map(p => {
                                    const currentPrice = stocks[p.stockSymbol]?.price || p.avgPrice;
                                    const currentValue = currentPrice * p.quantity;
                                    const invested = p.avgPrice * p.quantity;
                                    const pnl = currentValue - invested;
                                    return (
                                        <tr key={p.stockSymbol}>
                                            <td style={{ fontWeight: 700, color: '#e94560' }}>{p.stockSymbol}</td>
                                            <td>{p.stock}</td>
                                            <td>{p.quantity}</td>
                                            <td>${p.avgPrice.toFixed(2)}</td>
                                            <td>${currentPrice.toFixed(2)}</td>
                                            <td>${currentValue.toFixed(2)}</td>
                                            <td className={pnl >= 0 ? 'positive' : 'negative'}>{pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
