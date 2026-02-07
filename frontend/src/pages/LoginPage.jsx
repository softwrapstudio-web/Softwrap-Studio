import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { AgButton } from '../components/AgComponents';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Check if user is admin
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            // Redirect based on role
            if (profile?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Quick admin login for testing
    const quickAdminLogin = () => {
        setEmail('admin@boldpetals.com');
        setPassword('admin123');
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your account to continue"
        >
            {error && <div className="auth-error">{error}</div>}
            <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        className="ag-input"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="ag-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <AgButton
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="auth-submit-btn"
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </AgButton>
            </form>

            {/* Quick Admin Login - For Testing */}
            <div style={{ 
                marginTop: '1.5rem', 
                paddingTop: '1.5rem', 
                borderTop: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center'
            }}>
                <button
                    type="button"
                    onClick={quickAdminLogin}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                    }}
                >
                    🔧 Quick Admin Login (Testing)
                </button>
                <p style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '0.5rem'
                }}>
                    Auto-fills admin credentials for testing
                </p>
            </div>

            <div className="auth-footer">
                Don't have an account?
                <a href="/signup" className="auth-link">Create one</a>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;