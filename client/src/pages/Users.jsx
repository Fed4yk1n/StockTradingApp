import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../components/axiosInstance';
import { FaTrash } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get('/user/all');
            setUsers(res.data);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axiosInstance.delete(`/user/delete/${id}`);
            toast.success('User deleted');
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    if (loading) return <div className="loading">Loading users...</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">All Users</h1>
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Balance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td style={{ fontWeight: 600 }}>{u.username}</td>
                                    <td style={{ color: '#a0a0b0' }}>{u.email}</td>
                                    <td>
                                        <span className="badge" style={{ background: u.usertype === 'admin' ? 'rgba(83,52,131,0.2)' : 'rgba(15,52,96,0.3)', color: u.usertype === 'admin' ? '#533483' : '#a0a0b0' }}>
                                            {u.usertype}
                                        </span>
                                    </td>
                                    <td>${u.balance?.toFixed(2) || '0.00'}</td>
                                    <td>
                                        <button onClick={() => handleDelete(u._id)} className="btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', color: '#a0a0b0', padding: '2rem' }}>No users</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
