import React, { useState } from 'react';
import api from '../utils/api';

const Auth = ({ onLogin, addNotification }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'FARMER'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await api.post(endpoint, formData);
            
            localStorage.setItem('token', response.data.token);
            addNotification(`✅ Welcome, ${response.data.user.name}!`, 'success');
            onLogin(response.data.user);
        } catch (error) {
            console.error('Auth Error Details:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Server connection failed';
            addNotification(`❌ ${errorMsg}`, 'error');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="FARMER">Farmer</option>
                                <option value="DISTRIBUTOR">Distributor</option>
                                <option value="RETAILER">Retailer</option>
                                <option value="CONSUMER">Consumer</option>
                            </select>
                        </div>
                    )}
                    <button type="submit" className="btn-primary">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <p className="auth-toggle">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Register here' : 'Login here'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;
