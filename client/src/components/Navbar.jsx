import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';
import { FaChartLine, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useGeneral();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const styles = {
        nav: {
            background: '#1a1a2e',
            borderBottom: '1px solid #16213e',
            padding: '1rem 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        },
        navInner: {
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#e94560',
        },
        navLinks: {
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
        },
        navLink: {
            color: '#a0a0b0',
            fontWeight: 500,
            fontSize: '0.95rem',
            transition: 'color 0.2s',
            textDecoration: 'none',
        },
        logoutBtn: {
            background: 'transparent',
            border: '1px solid #e94560',
            color: '#e94560',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s',
        },
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.navInner}>
                <Link to="/" style={styles.logo}>
                    <FaChartLine /> SB Stocks
                </Link>
                <div style={styles.navLinks}>
                    {!user && (
                        <>
                            <Link to="/" style={styles.navLink}>Home</Link>
                            <Link to="/login" style={styles.navLink}>Login</Link>
                            <Link to="/register" style={{ ...styles.navLink, background: 'linear-gradient(135deg, #e94560, #533483)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '6px' }}>Register</Link>
                        </>
                    )}
                    {user && user.usertype === 'user' && (
                        <>
                            <Link to="/home" style={styles.navLink}>Dashboard</Link>
                            <Link to="/portfolio" style={styles.navLink}>Portfolio</Link>
                            <Link to="/history" style={styles.navLink}>History</Link>
                            <Link to="/profile" style={styles.navLink}>Profile</Link>
                            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                        </>
                    )}
                    {user && user.usertype === 'admin' && (
                        <>
                            <Link to="/admin" style={styles.navLink}>Dashboard</Link>
                            <Link to="/admin/users" style={styles.navLink}>Users</Link>
                            <Link to="/admin/orders" style={styles.navLink}>Orders</Link>
                            <Link to="/admin/transactions" style={styles.navLink}>Transactions</Link>
                            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
