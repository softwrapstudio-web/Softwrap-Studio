import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import AuthLayout from '../components/AuthLayout';
import { AgButton } from '../components/AgComponents';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <AuthLayout title="Check your email" subtitle="We've sent a verification link to your email address.">
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                        Please verify your email to complete the registration.
                    </p>
                    <AgButton variant="outline" onClick={() => window.location.href = '/login'}>
                        Back to Login
                    </AgButton>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Join Us"
            subtitle="Create an account to start your journey"
        >
            {error && <div className="auth-error">{error}</div>}
            <form className="auth-form" onSubmit={handleSignUp}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        className="ag-input"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                    {loading ? 'Creating Account...' : 'Create Account'}
                </AgButton>
            </form>
            <div className="auth-footer">
                Already have an account?
                <a href="/login" className="auth-link">Sign In</a>
            </div>
        </AuthLayout>
    );
};

export default SignUpPage;
