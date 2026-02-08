import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../utils/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import { AgContainer, AgButton } from '../../components/AgComponents';

export default function Cart() {
    const { 
        cart, 
        removeFromCart, 
        increaseQuantity, 
        decreaseQuantity,
        getCartTotal,
        clearCart 
    } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem'
            }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    style={{ fontSize: '5rem', marginBottom: '1rem' }}
                >
                    🛒
                </motion.div>
                <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                    Start shopping to add items to your cart
                </p>
                <AgButton variant="primary" onClick={() => navigate('/')}>
                    Continue Shopping
                </AgButton>
            </div>
        );
    }

    return (
        <AgContainer>
            <div style={{ padding: '4rem 0', minHeight: '80vh' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                        fontSize: '2.5rem', 
                        marginBottom: '2rem',
                        color: 'var(--primary-romantic)'
                    }}
                >
                    Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </motion.h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    {/* Cart Items */}
                    <div>
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        marginBottom: '1rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        display: 'grid',
                                        gridTemplateColumns: '120px 1fr auto',
                                        gap: '1.5rem',
                                        alignItems: 'center'
                                    }}
                                >
                                    {/* Product Image */}
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        backgroundColor: 'var(--primary-soft)'
                                    }}>
                                        {item.image_url || item.image ? (
                                            <img 
                                                src={item.image_url || item.image} 
                                                alt={item.title || item.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2rem'
                                            }}>
                                                📦
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div>
                                        <h3 style={{ marginBottom: '0.5rem' }}>
                                            {item.title || item.name}
                                        </h3>
                                        {item.category && (
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--primary-romantic)',
                                                backgroundColor: 'var(--primary-soft)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px'
                                            }}>
                                                {item.category}
                                            </span>
                                        )}
                                        <p style={{ 
                                            fontSize: '1.25rem', 
                                            fontWeight: 'bold',
                                            marginTop: '0.5rem',
                                            color: 'var(--primary-romantic)'
                                        }}>
                                            ₹{parseFloat(item.price).toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Quantity Controls & Remove */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        alignItems: 'flex-end'
                                    }}>
                                        {/* Quantity Controls */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            backgroundColor: 'var(--primary-soft)',
                                            borderRadius: '8px',
                                            padding: '0.5rem'
                                        }}>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => decreaseQuantity(item.id)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    backgroundColor: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '1.2rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                −
                                            </motion.button>
                                            <span style={{
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold',
                                                minWidth: '30px',
                                                textAlign: 'center'
                                            }}>
                                                {item.quantity}
                                            </span>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => increaseQuantity(item.id)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    backgroundColor: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '1.2rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                +
                                            </motion.button>
                                        </div>

                                        {/* Remove Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => removeFromCart(item.id)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#fee',
                                                color: '#c33',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            🗑️ Remove
                                        </motion.button>

                                        {/* Item Subtotal */}
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--text-light)'
                                        }}>
                                            Subtotal: ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Clear Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={clearCart}
                            style={{
                                marginTop: '1rem',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'transparent',
                                color: 'var(--text-light)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Clear Cart
                        </motion.button>
                    </div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            position: 'sticky',
                            top: '100px'
                        }}
                    >
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                            Order Summary
                        </h3>

                        <div style={{
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.75rem',
                                fontSize: '0.95rem'
                            }}>
                                <span>Subtotal:</span>
                                <span>₹{getCartTotal().toFixed(2)}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.75rem',
                                fontSize: '0.95rem'
                            }}>
                                <span>Shipping:</span>
                                <span style={{ color: '#10b981' }}>
                                    {getCartTotal() >= 999 ? 'FREE' : '₹50.00'}
                                </span>
                            </div>
                            {getCartTotal() < 999 && (
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-light)',
                                    marginTop: '0.5rem'
                                }}>
                                    Add ₹{(999 - getCartTotal()).toFixed(2)} more for free shipping!
                                </p>
                            )}
                        </div>

                        <div style={{
                            borderTop: '2px solid var(--primary-romantic)',
                            paddingTop: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '1.3rem',
                                fontWeight: 'bold',
                                color: 'var(--primary-romantic)'
                            }}>
                                <span>Total:</span>
                                <span>
                                    ₹{(getCartTotal() + (getCartTotal() >= 999 ? 0 : 50)).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <AgButton 
                            variant="primary" 
                            onClick={handleCheckout}
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        >
                            Proceed to Checkout →
                        </AgButton>

                        <button
                            onClick={() => navigate('/')}
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                padding: '0.75rem',
                                backgroundColor: 'transparent',
                                color: 'var(--text-light)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Continue Shopping
                        </button>
                    </motion.div>
                </div>
            </div>
        </AgContainer>
    );
}