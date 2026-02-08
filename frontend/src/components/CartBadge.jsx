import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../utils/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

export const CartBadge = () => {
    const { getCartItemsCount, toggleCart } = useCart();
    const navigate = useNavigate();
    const itemCount = getCartItemsCount();

    const handleClick = () => {
        navigate('/cart');
        // Or use: toggleCart(); for drawer
    };

    return (
        <motion.div
            style={{
                position: 'relative',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center'
            }}
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="ag-nav-icon" style={{ fontSize: '1.5rem' }}>🛒</span>
            
            <AnimatePresence>
                {itemCount > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 25
                        }}
                        style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: 'var(--primary-romantic)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            border: '2px solid white'
                        }}
                    >
                        <motion.span
                            key={itemCount}
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {itemCount}
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};