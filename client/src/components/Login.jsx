import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';
import { useGeneral } from '../context/GeneralContext';
import { FaChartLine } from 'react-icons/fa';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useGeneral();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post('/user/login', form);
            login(res.data.user, res.data.token);
            toast.success('Login successful!');
            if (res.data.user.usertype === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0b0b1a',
            padding: '2rem',
        },
        card: {
            background: '#1a1a2e',
            borderRadius: '16px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '420px',
            border: '1px solid #16213e',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#e94560',
            marginBottom: '0.5rem',
        },
        subtitle: {
            textAlign: 'center',
            color: '#a0a0b0',
            marginBottom: '2rem',
            fontSize: '0.9rem',
        },
        title: {
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.25rem',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}><FaChartLine /> SB Stocks</div>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Sign in to your trading account</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#a0a0b0', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#e94560', fontWeight: 600 }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
