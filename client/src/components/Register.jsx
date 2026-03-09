import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';
import { FaChartLine } from 'react-icons/fa';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (form.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        setLoading(true);
        try {
            await axiosInstance.post('/user/register', {
                username: form.username,
                email: form.email,
                password: form.password,
                usertype: 'user'
            });
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
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
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}><FaChartLine /> SB Stocks</div>
                <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Create Account</h2>
                <p style={{ textAlign: 'center', color: '#a0a0b0', marginBottom: '2rem', fontSize: '0.9rem' }}>Start your paper trading journey</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" placeholder="Choose a username" value={form.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Create a password" value={form.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#a0a0b0', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: '#e94560', fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
