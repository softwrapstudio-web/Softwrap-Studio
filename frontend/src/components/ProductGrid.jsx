import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgCard } from './AgComponents';
import { useCart } from '../utils/CartContext.jsx';

const AnimatedProductCard = ({ product }) => {
    const { addToCart, isInCart, getItemQuantity } = useCart();
    const [justAdded, setJustAdded] = React.useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setJustAdded(true);
        
        // Reset animation after 2 seconds
        setTimeout(() => setJustAdded(false), 2000);
    };

    const inCart = isInCart(product.id);
    const quantity = getItemQuantity(product.id);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="ag-card">
                <div className="ag-card-image-box">
                    {product.image_url || product.image ? (
                        <img 
                            src={product.image_url || product.image} 
                            alt={product.title || product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    ) : (
                        <div className="ag-image-placeholder">
                            {product.title || product.name}
                        </div>
                    )}
                    
                    {/* Stock badge */}
                    {product.stock !== undefined && (
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: product.stock > 0 ? '#10b981' : '#ef4444',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                        }}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </div>
                    )}
                </div>
                
                <div className="ag-card-content">
                    <h3 className="ag-card-name">{product.title || product.name}</h3>
                    {product.description && (
                        <p style={{ 
                            fontSize: '0.85rem', 
                            color: 'var(--text-light)',
                            marginBottom: '0.5rem'
                        }}>
                            {product.description}
                        </p>
                    )}
                    {product.category && (
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--primary-romantic)',
                            backgroundColor: 'var(--primary-soft)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginBottom: '0.5rem'
                        }}>
                            {product.category}
                        </span>
                    )}
                    <p className="ag-card-price">
                        Regular price Rs. {product.price}
                    </p>
                    
                    <motion.button
                        className={`ag-button ${inCart ? 'ag-button--primary' : 'ag-button--outline'}`}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: '100%',
                            marginTop: '0.5rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {justAdded ? (
                                <motion.span
                                    key="added"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    ✓ Added to Cart!
                                </motion.span>
                            ) : inCart ? (
                                <motion.span
                                    key="incart"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    In Cart ({quantity}) • Add More
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="add"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export const ProductGrid = ({ products }) => {
    return (
        <div className="ag-grid">
            <AnimatePresence>
                {products.map((product) => (
                    <AnimatedProductCard 
                        key={product.id || product.name} 
                        product={product}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};