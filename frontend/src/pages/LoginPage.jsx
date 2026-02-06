import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import AuthLayout from '../components/AuthLayout';
import { AgButton } from '../components/AgComponents';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            window.location.href = '/';
        }
        setLoading(false);
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
            <div className="auth-footer">
                Don't have an account?
                <a href="/signup" className="auth-link">Create one</a>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
