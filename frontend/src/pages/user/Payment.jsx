import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../utils/CartContext.jsx';
import { useAuth } from '../../utils/useAuth.jsx';
import { supabase } from '../../utils/supabase';
import { AgContainer, AgButton } from '../../components/AgComponents';

export default function Payment() {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [shippingInfo, setShippingInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load shipping info from localStorage
        const savedShipping = localStorage.getItem('shippingInfo');
        if (savedShipping) {
            setShippingInfo(JSON.parse(savedShipping));
        } else {
            // Redirect back to checkout if no shipping info
            navigate('/checkout');
        }
    }, [navigate]);

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

    const handleRazorpayPayment = async () => {
        setLoading(true);
        setError(null);

        try {
            // Step 1: Create order in Supabase
            const orderData = {
                user_id: user.id,
                total_amount: totalAmount,
                shipping_cost: shippingCost,
                items: cart.map(item => ({
                    product_id: item.id,
                    title: item.title || item.name,
                    price: parseFloat(item.price),
                    quantity: item.quantity
                })),
                shipping_address: shippingInfo,
                status: 'pending',
                payment_status: 'pending'
            };

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

            // Step 2: Initialize Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
                amount: Math.round(totalAmount * 100), // Amount in paise
                currency: 'INR',
                name: 'Softwrap Studio',
                description: 'Order Payment',
                order_id: order.id, // This will be the Razorpay order ID from backend
                prefill: {
                    name: shippingInfo.fullName,
                    email: shippingInfo.email,
                    contact: shippingInfo.phone
                },
                notes: {
                    order_id: order.id,
                    address: shippingInfo.address
                },
                theme: {
                    color: '#e11d48' // Your primary color
                },
                handler: async function (response) {
                    // Payment successful
                    try {
                        // Update order status
                        const { error: updateError } = await supabase
                            .from('orders')
                            .update({
                                payment_status: 'completed',
                                status: 'confirmed',
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            })
                            .eq('id', order.id);

                        if (updateError) throw updateError;

                        // Reduce stock for each item
                        for (const item of cart) {
                            await supabase.rpc('reduce_product_stock', {
                                product_id: item.id,
                                quantity: item.quantity
                            });
                        }

                        // Clear cart
                        clearCart();
                        localStorage.removeItem('shippingInfo');

                        // Redirect to success page
                        navigate('/order-success', { 
                            state: { 
                                orderId: order.id,
                                paymentId: response.razorpay_payment_id 
                            } 
                        });
                    } catch (err) {
                        console.error('Post-payment error:', err);
                        setError('Payment successful but order update failed. Contact support.');
                    }
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                        setError('Payment cancelled');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setLoading(false);

        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment failed. Please try again.');
            setLoading(false);
        }
    };

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!shippingInfo) {
        return <div>Loading...</div>;
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
                    Payment
                </motion.h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    {/* Payment Options */}
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
                        <h2 style={{ marginBottom: '1.5rem' }}>Payment Method</h2>

                        {error && (
                            <div style={{
                                backgroundColor: '#fee',
                                color: '#c33',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1.5rem'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Razorpay Option */}
                        <div style={{
                            border: '2px solid var(--primary-romantic)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            backgroundColor: 'var(--primary-soft)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '2rem' }}>💳</div>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Razorpay</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                        Pay securely with Cards, UPI, Netbanking & Wallets
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div style={{
                            backgroundColor: 'var(--neutral-bg)',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{ marginBottom: '1rem' }}>Delivery Address</h3>
                            <p style={{ margin: '0.25rem 0' }}><strong>{shippingInfo.fullName}</strong></p>
                            <p style={{ margin: '0.25rem 0' }}>{shippingInfo.address}</p>
                            <p style={{ margin: '0.25rem 0' }}>
                                {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                            </p>
                            <p style={{ margin: '0.25rem 0' }}>📞 {shippingInfo.phone}</p>
                            <p style={{ margin: '0.25rem 0' }}>📧 {shippingInfo.email}</p>
                            <button
                                onClick={() => navigate('/checkout')}
                                style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'transparent',
                                    color: 'var(--primary-romantic)',
                                    border: '1px solid var(--primary-romantic)',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Edit Address
                            </button>
                        </div>

                        {/* Pay Button */}
                        <AgButton
                            variant="primary"
                            onClick={handleRazorpayPayment}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
                        </AgButton>

                        <div style={{
                            marginTop: '1rem',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            color: 'var(--text-light)'
                        }}>
                            🔒 Your payment information is secure and encrypted
                        </div>
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

                        <div style={{ marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                            {cart.map((item) => (
                                <div 
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        marginBottom: '1rem',
                                        paddingBottom: '1rem',
                                        borderBottom: '1px solid var(--border-color)'
                                    }}
                                >
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        backgroundColor: 'var(--primary-soft)',
                                        flexShrink: 0
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
                                                fontSize: '1.5rem'
                                            }}>
                                                📦
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: '500', fontSize: '0.9rem' }}>
                                            {item.title || item.name}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                            Qty: {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                    </div>
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
                                fontSize: '1.5rem',
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