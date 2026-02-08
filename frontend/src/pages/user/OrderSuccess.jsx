import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { AgContainer, AgButton } from '../../components/AgComponents';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, paymentId } = location.state || {};

    useEffect(() => {
        // Trigger confetti animation
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
            }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    if (!orderId) {
        navigate('/');
        return null;
    }

    return (
        <AgContainer>
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                textAlign: 'center'
            }}>
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                        duration: 0.6
                    }}
                    style={{
                        fontSize: '8rem',
                        marginBottom: '2rem'
                    }}
                >
                    🎉
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '3rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        maxWidth: '600px'
                    }}
                >
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            fontSize: '2.5rem',
                            color: 'var(--primary-romantic)',
                            marginBottom: '1rem'
                        }}
                    >
                        Order Placed Successfully!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        style={{
                            fontSize: '1.1rem',
                            color: 'var(--text-light)',
                            marginBottom: '2rem'
                        }}
                    >
                        Thank you for your purchase! Your order has been confirmed.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 }}
                        style={{
                            backgroundColor: 'var(--primary-soft)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '2rem'
                        }}
                    >
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ 
                                color: 'var(--text-light)', 
                                fontSize: '0.9rem',
                                display: 'block',
                                marginBottom: '0.25rem'
                            }}>
                                Order ID
                            </span>
                            <span style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: 'bold',
                                color: 'var(--primary-romantic)',
                                fontFamily: 'monospace'
                            }}>
                                #{orderId.substring(0, 8).toUpperCase()}
                            </span>
                        </div>
                        
                        {paymentId && (
                            <div>
                                <span style={{ 
                                    color: 'var(--text-light)', 
                                    fontSize: '0.9rem',
                                    display: 'block',
                                    marginBottom: '0.25rem'
                                }}>
                                    Payment ID
                                </span>
                                <span style={{ 
                                    fontSize: '0.95rem',
                                    color: 'var(--text-dark)',
                                    fontFamily: 'monospace'
                                }}>
                                    {paymentId}
                                </span>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        style={{
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #86efac',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '2rem'
                        }}
                    >
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#166534' }}>
                            ✅ A confirmation email has been sent to your registered email address
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        <AgButton
                            variant="primary"
                            onClick={() => navigate('/')}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem'
                            }}
                        >
                            Continue Shopping
                        </AgButton>
                        
                        <button
                            onClick={() => navigate('/orders')}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: 'transparent',
                                color: 'var(--primary-romantic)',
                                border: '2px solid var(--primary-romantic)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            View My Orders
                        </button>
                    </motion.div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{
                        marginTop: '2rem',
                        color: 'var(--text-light)',
                        fontSize: '0.9rem'
                    }}
                >
                    Need help? Contact us at support@softwrapstudio.com
                </motion.p>
            </div>
        </AgContainer>
    );
}