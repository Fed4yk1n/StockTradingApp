import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaShieldAlt, FaRocket, FaWallet, FaChartBar, FaHistory } from 'react-icons/fa';

const Landing = () => {
    const styles = {
        hero: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0b0b1a 0%, #1a1a2e 50%, #16213e 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
        },
        logo: {
            fontSize: '3rem',
            fontWeight: 800,
            color: '#e94560',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
        },
        tagline: {
            fontSize: '1.25rem',
            color: '#a0a0b0',
            marginBottom: '3rem',
            maxWidth: '600px',
        },
        btnGroup: {
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '5rem',
        },
        featuresSection: {
            width: '100%',
            maxWidth: '1000px',
            marginTop: '4rem',
        },
        featuresTitle: {
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '2.5rem',
            color: '#ffffff',
        },
        featuresGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
        },
        featureCard: {
            background: '#1a1a2e',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid #16213e',
            transition: 'transform 0.2s',
        },
        featureIcon: {
            fontSize: '2rem',
            color: '#e94560',
            marginBottom: '1rem',
        },
        featureTitle: {
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
        },
        featureDesc: {
            color: '#a0a0b0',
            fontSize: '0.9rem',
            lineHeight: 1.6,
        },
    };

    const features = [
        { icon: <FaRocket />, title: 'Paper Trading', desc: 'Practice trading with virtual money. No real risk, real market experience.' },
        { icon: <FaChartBar />, title: 'Live Charts', desc: 'View detailed stock charts with price history and trends.' },
        { icon: <FaWallet />, title: 'Portfolio Tracking', desc: 'Track your holdings, gains, and overall portfolio performance.' },
        { icon: <FaHistory />, title: 'Trade History', desc: 'Complete history of all your buy/sell orders and transactions.' },
        { icon: <FaShieldAlt />, title: 'Secure Platform', desc: 'JWT authentication and bcrypt password hashing for security.' },
        { icon: <FaChartLine />, title: 'Multiple Stocks', desc: 'Trade across a variety of stocks from different exchanges.' },
    ];

    return (
        <div style={styles.hero}>
            <div style={styles.logo}><FaChartLine /> SB Stocks</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                Master the Market.<br />
                <span style={{ color: '#e94560' }}>Risk-Free.</span>
            </h1>
            <p style={styles.tagline}>
                The ultimate paper trading simulation platform. Learn to invest, practice strategies, and build confidence before entering the real market.
            </p>
            <div style={styles.btnGroup}>
                <Link to="/register"><button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Get Started Free</button></Link>
                <Link to="/login"><button className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Sign In</button></Link>
            </div>
            <div style={styles.featuresSection}>
                <h2 style={styles.featuresTitle}>Why SB Stocks?</h2>
                <div style={styles.featuresGrid}>
                    {features.map((f, i) => (
                        <div key={i} style={styles.featureCard}>
                            <div style={styles.featureIcon}>{f.icon}</div>
                            <h3 style={styles.featureTitle}>{f.title}</h3>
                            <p style={styles.featureDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Landing;
