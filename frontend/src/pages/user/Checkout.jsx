import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../utils/CartContext.jsx';
import { AgContainer, AgButton } from '../../components/AgComponents';

export default function Checkout() {
    const navigate = useNavigate();
    const { cart, getCartTotal } = useCart();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Pincode must be 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Save shipping info to localStorage
            localStorage.setItem('shippingInfo', JSON.stringify(formData));
            // Navigate to payment
            navigate('/payment');
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <h2>Your cart is empty</h2>
                <AgButton variant="primary" onClick={() => navigate('/')}>
                    Start Shopping
                </AgButton>
            </div>
        );
    }

    const shippingCost = getCartTotal() >= 999 ? 0 : 50;
    const totalAmount = getCartTotal() + shippingCost;

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
                    Checkout
                </motion.h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    {/* Shipping Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>Shipping Information</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name *</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    className="ag-input"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                />
                                {errors.fullName && (
                                    <span style={{ color: '#c33', fontSize: '0.85rem' }}>
                                        {errors.fullName}
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="ag-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && (
                                        <span style={{ color: '#c33', fontSize: '0.85rem' }}>
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number *</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        className="ag-input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                    />
                                    {errors.phone && (
                                        <span style={{ color: '#c33', fontSize: '0.85rem' }}>
                                            {errors.phone}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Street Address *</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    className="ag-input"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="123 Main Street, Apartment 4B"
                                />
                                {errors.address && (
                                    <span style={{ color: '#c33', fontSize: '0.85rem' }}>
                                        {errors.address}
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="city">City *</label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        className="ag-input"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Mumbai"
                                    />
                                    {errors.city && (
                                        <span style={{ color: '#c33', fontSize: '0.85rem' }}>
                                            {errors.city}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">State *</label>
                                    <input
                                        id="state"
                                        name="state"
                                        type="text"
                                        className="ag-input"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Maharashtra"
                                    />
                                    {errors.state && (
                                        <span style={{ color: '#c33', fontSize: '0.85rem' }}>
                                            {errors.state}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pincode">Pincode *</label>
                                    <input
                                        id="pincode"
                                        name="pincode"
                                        type="text"
                                        className="ag-input"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="400001"
                                        maxLength="6"
                                    />
                                    {errors.pincode && (
                                        <span style={{ color: '#c33', fontSize: '0.85rem' }}>
                                            {errors.pincode}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Order Notes (Optional)</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    className="ag-input"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="2"
                                    placeholder="Any special instructions for delivery..."
                                />
                            </div>

                            <div style={{ 
                                display: 'flex', 
                                gap: '1rem', 
                                marginTop: '2rem' 
                            }}>
                                <AgButton
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/cart')}
                                    style={{ flex: 1 }}
                                >
                                    ← Back to Cart
                                </AgButton>
                                <AgButton
                                    type="submit"
                                    variant="primary"
                                    style={{ flex: 2 }}
                                >
                                    Continue to Payment →
                                </AgButton>
                            </div>
                        </form>
                    </motion.div>

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
                        <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            {cart.map((item) => (
                                <div 
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.75rem',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <span>
                                        {item.title || item.name} x {item.quantity}
                                    </span>
                                    <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            borderTop: '1px solid var(--border-color)',
                            paddingTop: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem'
                            }}>
                                <span>Subtotal:</span>
                                <span>₹{getCartTotal().toFixed(2)}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem'
                            }}>
                                <span>Shipping:</span>
                                <span style={{ color: shippingCost === 0 ? '#10b981' : 'inherit' }}>
                                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                        </div>

                        <div style={{
                            borderTop: '2px solid var(--primary-romantic)',
                            paddingTop: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '1.3rem',
                                fontWeight: 'bold',
                                color: 'var(--primary-romantic)'
                            }}>
                                <span>Total:</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AgContainer>
    );
}