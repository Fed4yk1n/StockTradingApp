import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';
import { useGeneral } from '../context/GeneralContext';
import { FaUser, FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Profile = () => {
    const { user, updateUser } = useGeneral();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('card');
    const [txLoading, setTxLoading] = useState(false);

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get('/user/profile');
            setProfile(res.data);
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        setTxLoading(true);
        try {
            const res = await axiosInstance.post('/transaction/deposit', { amount: depositAmount, paymentMode });
            toast.success('Deposit successful!');
            setDepositAmount('');
            setProfile(p => ({ ...p, balance: res.data.balance }));
            updateUser({ ...user, balance: res.data.balance });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Deposit failed');
        } finally {
            setTxLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        setTxLoading(true);
        try {
            const res = await axiosInstance.post('/transaction/withdraw', { amount: withdrawAmount, paymentMode });
            toast.success('Withdrawal successful!');
            setWithdrawAmount('');
            setProfile(p => ({ ...p, balance: res.data.balance }));
            updateUser({ ...user, balance: res.data.balance });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Withdrawal failed');
        } finally {
            setTxLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading profile...</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">My Profile</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #e94560, #533483)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                            <FaUser />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{profile?.username}</h2>
                            <p style={{ color: '#a0a0b0', fontSize: '0.9rem' }}>{profile?.email}</p>
                        </div>
                    </div>
                    <div style={{ background: '#0b0b1a', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                        <div style={{ color: '#a0a0b0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Available Balance</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#e94560' }}>${profile?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div style={{ background: '#0b0b1a', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ color: '#a0a0b0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Account Type</div>
                        <div style={{ fontWeight: 600, textTransform: 'capitalize', color: '#533483' }}>{profile?.usertype}</div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}><FaArrowUp style={{ color: '#00c853', marginRight: '0.5rem' }} />Deposit Funds</h3>
                    <form onSubmit={handleDeposit}>
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input type="number" min="1" placeholder="Enter amount" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Payment Mode</label>
                            <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                                <option value="card">Credit/Debit Card</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="upi">UPI</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-success" style={{ width: '100%' }} disabled={txLoading}>
                            {txLoading ? 'Processing...' : 'Deposit'}
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}><FaArrowDown style={{ color: '#ff1744', marginRight: '0.5rem' }} />Withdraw Funds</h3>
                    <form onSubmit={handleWithdraw}>
                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input type="number" min="1" placeholder="Enter amount" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Payment Mode</label>
                            <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                                <option value="card">Credit/Debit Card</option>
                                <option value="bank">Bank Transfer</option>
                                <option value="upi">UPI</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-danger" style={{ width: '100%' }} disabled={txLoading}>
                            {txLoading ? 'Processing...' : 'Withdraw'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
