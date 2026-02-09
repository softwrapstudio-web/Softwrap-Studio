import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../utils/CartContext.jsx';
import { useAuth } from '../../utils/useAuth.jsx';
import { supabase } from '../../utils/supabase';
import { AgContainer, AgButton } from '../../components/AgComponents';

// WhatsApp Business Number - Update this with your number
const WHATSAPP_BUSINESS_NUMBER = '919876543210'; // Format: country code + number (no + or spaces)

export default function Payment() {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [shippingInfo, setShippingInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay'); // razorpay, cod, whatsapp

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

    const baseShippingCost = getCartTotal() >= 999 ? 0 : 50;
    const codFee = selectedPaymentMethod === 'cod' ? 60 : 0;
    const totalShippingCost = baseShippingCost + codFee;
    const totalAmount = getCartTotal() + totalShippingCost;

    // Handle Cash on Delivery
    const handleCODOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            // Create order in Supabase
            const orderData = {
                user_id: user.id,
                total_amount: totalAmount,
                shipping_cost: totalShippingCost,
                items: cart.map(item => ({
                    product_id: item.id,
                    title: item.title || item.name,
                    price: parseFloat(item.price),
                    quantity: item.quantity
                })),
                shipping_address: shippingInfo,
                status: 'pending',
                payment_status: 'cod',
                payment_method: 'Cash on Delivery'
            };

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

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
                    paymentMethod: 'cod'
                } 
            });
        } catch (err) {
            console.error('COD order error:', err);
            setError(err.message || 'Failed to place order. Please try again.');
            setLoading(false);
        }
    };

    // Handle WhatsApp Business Redirect
    const handleWhatsAppOrder = () => {
        // Create order message
        const orderMessage = `
🛍️ *New Order Request*

📦 *Order Details:*
${cart.map((item, index) => 
    `${index + 1}. ${item.title || item.name} - ₹${item.price} x ${item.quantity} = ₹${(parseFloat(item.price) * item.quantity).toFixed(2)}`
).join('\n')}

💰 *Subtotal:* ₹${getCartTotal().toFixed(2)}
🚚 *Shipping:* ₹${totalShippingCost.toFixed(2)}
💳 *Total Amount:* ₹${totalAmount.toFixed(2)}

📍 *Delivery Address:*
${shippingInfo.fullName}
${shippingInfo.address}
${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}
📞 ${shippingInfo.phone}
📧 ${shippingInfo.email}

${shippingInfo.notes ? `📝 *Notes:* ${shippingInfo.notes}` : ''}

I'd like to confirm this order and discuss payment options.
        `.trim();

        // Encode message for URL
        const encodedMessage = encodeURIComponent(orderMessage);
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Show confirmation message
        alert('Redirecting to WhatsApp Business! We will confirm your order shortly.');
    };

    // Handle Razorpay Payment
    const handleRazorpayPayment = async () => {
        setLoading(true);
        setError(null);

        try {
            // Create order in Supabase
            const orderData = {
                user_id: user.id,
                total_amount: totalAmount,
                shipping_cost: totalShippingCost,
                items: cart.map(item => ({
                    product_id: item.id,
                    title: item.title || item.name,
                    price: parseFloat(item.price),
                    quantity: item.quantity
                })),
                shipping_address: shippingInfo,
                status: 'pending',
                payment_status: 'pending',
                payment_method: 'Razorpay'
            };

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

            // Initialize Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
                amount: Math.round(totalAmount * 100), // Amount in paise
                currency: 'INR',
                name: 'Softwrap Studio',
                description: 'Order Payment',
                order_id: order.id,
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
                    color: '#e11d48'
                },
                handler: async function (response) {
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

                        // Reduce stock
                        for (const item of cart) {
                            await supabase.rpc('reduce_product_stock', {
                                product_id: item.id,
                                quantity: item.quantity
                            });
                        }

                        clearCart();
                        localStorage.removeItem('shippingInfo');

                        navigate('/order-success', { 
                            state: { 
                                orderId: order.id,
                                paymentId: response.razorpay_payment_id,
                                paymentMethod: 'razorpay'
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

    const handlePayment = () => {
        switch (selectedPaymentMethod) {
            case 'razorpay':
                handleRazorpayPayment();
                break;
            case 'cod':
                handleCODOrder();
                break;
            case 'whatsapp':
                handleWhatsAppOrder();
                break;
            default:
                setError('Please select a payment method');
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
                        <h2 style={{ marginBottom: '1.5rem' }}>Choose Payment Method</h2>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    backgroundColor: '#fee',
                                    color: '#c33',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Payment Method Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            
                            {/* Razorpay Option */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedPaymentMethod('razorpay')}
                                style={{
                                    border: selectedPaymentMethod === 'razorpay' 
                                        ? '3px solid var(--primary-romantic)' 
                                        : '2px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    backgroundColor: selectedPaymentMethod === 'razorpay' 
                                        ? 'var(--primary-soft)' 
                                        : 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ 
                                        fontSize: '2rem',
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'white',
                                        borderRadius: '8px'
                                    }}>
                                        💳
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.25rem 0' }}>
                                            Online Payment
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                            Cards, UPI, Netbanking & Wallets
                                        </p>
                                        <p style={{ 
                                            margin: '0.5rem 0 0 0', 
                                            fontSize: '0.85rem', 
                                            color: '#10b981',
                                            fontWeight: '500'
                                        }}>
                                            ✓ Instant confirmation • Secure payment
                                        </p>
                                    </div>
                                    {selectedPaymentMethod === 'razorpay' && (
                                        <div style={{ 
                                            width: '24px', 
                                            height: '24px', 
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--primary-romantic)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}>
                                            ✓
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Cash on Delivery Option */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedPaymentMethod('cod')}
                                style={{
                                    border: selectedPaymentMethod === 'cod' 
                                        ? '3px solid var(--primary-romantic)' 
                                        : '2px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    backgroundColor: selectedPaymentMethod === 'cod' 
                                        ? 'var(--primary-soft)' 
                                        : 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ 
                                        fontSize: '2rem',
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'white',
                                        borderRadius: '8px'
                                    }}>
                                        💵
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.25rem 0' }}>
                                            Cash on Delivery
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                            Pay when you receive your order
                                        </p>
                                        <p style={{ 
                                            margin: '0.5rem 0 0 0', 
                                            fontSize: '0.85rem', 
                                            color: '#f59e0b',
                                            fontWeight: '500'
                                        }}>
                                            + ₹60 COD handling fee
                                        </p>
                                    </div>
                                    {selectedPaymentMethod === 'cod' && (
                                        <div style={{ 
                                            width: '24px', 
                                            height: '24px', 
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--primary-romantic)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}>
                                            ✓
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* WhatsApp Business Option */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedPaymentMethod('whatsapp')}
                                style={{
                                    border: selectedPaymentMethod === 'whatsapp' 
                                        ? '3px solid var(--primary-romantic)' 
                                        : '2px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    backgroundColor: selectedPaymentMethod === 'whatsapp' 
                                        ? 'var(--primary-soft)' 
                                        : 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ 
                                        fontSize: '2rem',
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#25D366',
                                        borderRadius: '8px'
                                    }}>
                                        💬
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 0.25rem 0' }}>
                                            Order via WhatsApp
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                            Chat with us to confirm order & payment
                                        </p>
                                        <p style={{ 
                                            margin: '0.5rem 0 0 0', 
                                            fontSize: '0.85rem', 
                                            color: '#25D366',
                                            fontWeight: '500'
                                        }}>
                                            ✓ Personal service • Flexible payment
                                        </p>
                                    </div>
                                    {selectedPaymentMethod === 'whatsapp' && (
                                        <div style={{ 
                                            width: '24px', 
                                            height: '24px', 
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--primary-romantic)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.9rem'
                                        }}>
                                            ✓
                                        </div>
                                    )}
                                </div>
                            </motion.div>
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

                        {/* Payment Button */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedPaymentMethod}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <AgButton
                                    variant="primary"
                                    onClick={handlePayment}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        backgroundColor: selectedPaymentMethod === 'whatsapp' 
                                            ? '#25D366' 
                                            : undefined
                                    }}
                                >
                                    {loading ? 'Processing...' : 
                                     selectedPaymentMethod === 'razorpay' ? `Pay ₹${totalAmount.toFixed(2)}` :
                                     selectedPaymentMethod === 'cod' ? `Place COD Order - ₹${totalAmount.toFixed(2)}` :
                                     selectedPaymentMethod === 'whatsapp' ? '💬 Continue on WhatsApp' :
                                     'Select Payment Method'}
                                </AgButton>
                            </motion.div>
                        </AnimatePresence>

                        <div style={{
                            marginTop: '1rem',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            color: 'var(--text-light)'
                        }}>
                            🔒 Your information is secure and encrypted
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
                                <span style={{ color: baseShippingCost === 0 ? '#10b981' : 'inherit' }}>
                                    {baseShippingCost === 0 ? 'FREE' : `₹${baseShippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            
                            <AnimatePresence>
                                {selectedPaymentMethod === 'cod' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem',
                                            color: '#f59e0b'
                                        }}
                                    >
                                        <span>COD Fee:</span>
                                        <span>₹{codFee.toFixed(2)}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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