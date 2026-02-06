import React from 'react';
import { AgContainer } from './AgComponents';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-wrapper">
            <AgContainer>
                <div className="auth-card-container">
                    <div className="auth-card glassmorphism">
                        <div className="auth-header">
                            <h1 className="auth-title">{title}</h1>
                            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                        </div>
                        <div className="auth-content">
                            {children}
                        </div>
                    </div>
                </div>
            </AgContainer>
        </div>
    );
};

export default AuthLayout;
