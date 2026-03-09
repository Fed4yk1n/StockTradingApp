import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { GeneralProvider, useGeneral } from './context/GeneralContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import StockChart from './pages/StockChart';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Admin from './pages/Admin';
import AdminStockChart from './pages/AdminStockChart';
import AllOrders from './pages/AllOrders';
import AllTransactions from './pages/AllTransactions';
import Users from './pages/Users';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useGeneral();
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.usertype !== 'admin') return <Navigate to="/home" replace />;
    return children;
};

const AppRoutes = () => {
    const { user } = useGeneral();
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={user ? <Navigate to={user.usertype === 'admin' ? '/admin' : '/home'} replace /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/home" replace /> : <Register />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/stock/:symbol" element={<ProtectedRoute><StockChart /></ProtectedRoute>} />
                <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                <Route path="/admin/stock/:symbol" element={<ProtectedRoute adminOnly><AdminStockChart /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AllOrders /></ProtectedRoute>} />
                <Route path="/admin/transactions" element={<ProtectedRoute adminOnly><AllTransactions /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <GeneralProvider>
            <Router>
                <div className="app">
                    <AppRoutes />
                    <ToastContainer position="top-right" autoClose={3000} theme="dark" />
                </div>
            </Router>
        </GeneralProvider>
    );
};

export default App;
