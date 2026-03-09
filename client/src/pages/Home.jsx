import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';
import { useGeneral } from '../context/GeneralContext';
import { FaSearch, FaArrowUp, FaArrowDown, FaWallet } from 'react-icons/fa';

const Home = () => {
    const { user, updateUser } = useGeneral();
    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [stocksRes, profileRes] = await Promise.all([
                axiosInstance.get('/stock/all'),
                axiosInstance.get('/user/profile')
            ]);
            setStocks(stocksRes.data);
            setProfile(profileRes.data);
            updateUser({ ...user, balance: profileRes.data.balance });
        } catch (err) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const filtered = stocks.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.symbol.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="page-container">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">${profile?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}</div>
                    <div className="stat-label">Available Balance</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stocks.length}</div>
                    <div className="stat-label">Available Stocks</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className="page-title" style={{ marginBottom: 0 }}>Market Overview</h2>
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#a0a0b0' }} />
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ paddingLeft: '2.5rem', padding: '0.6rem 1rem 0.6rem 2.5rem', background: '#1a1a2e', border: '1px solid #16213e', borderRadius: '8px', color: '#fff', width: '250px' }}
                    />
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Name</th>
                                <th>Exchange</th>
                                <th>Price</th>
                                <th>Change</th>
                                <th>Change %</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(stock => (
                                <tr key={stock._id}>
                                    <td style={{ fontWeight: 700, color: '#e94560' }}>{stock.symbol}</td>
                                    <td>{stock.name}</td>
                                    <td style={{ color: '#a0a0b0' }}>{stock.exchange}</td>
                                    <td style={{ fontWeight: 600 }}>${stock.price.toFixed(2)}</td>
                                    <td className={stock.change >= 0 ? 'positive' : 'negative'}>
                                        {stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(stock.change).toFixed(2)}
                                    </td>
                                    <td className={stock.changePercent >= 0 ? 'positive' : 'negative'}>
                                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                    </td>
                                    <td>
                                        <Link to={`/stock/${stock.symbol}`}>
                                            <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Trade</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#a0a0b0', padding: '2rem' }}>No stocks found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;
