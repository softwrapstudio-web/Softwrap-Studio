import React from 'react';

export const AgContainer = ({ children, className = '' }) => (
    <div className={`ag-container ${className}`}>
        {children}
    </div>
);

export const AgSection = ({ children, title, className = '', id }) => (
    <section className={`ag-section ${className}`} id={id}>
        <AgContainer>
            {title && <h2 className="ag-section-title">{title}</h2>}
            {children}
        </AgContainer>
    </section>
);

export const AgButton = ({ children, variant = 'primary', className = '', ...props }) => (
    <button className={`ag-button ag-button--${variant} ${className}`} {...props}>
        {children}
    </button>
);

export const AgCard = ({ image, name, price, onAddToCart }) => (
    <div className="ag-card">
        <div className="ag-card-image-box">
            {image ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="ag-image-placeholder">{name}</div>}
        </div>
        <div className="ag-card-content">
            <h3 className="ag-card-name">{name}</h3>
            <p className="ag-card-price">Regular price Rs. {price}</p>
            <AgButton variant="outline" onClick={onAddToCart} className="ag-card-button">
                Add to Cart
            </AgButton>
        </div>
    </div>
);

export const AgNavbar = () => (
    <nav className="ag-navbar">
        <AgContainer>
            <div className="ag-navbar-inner">
                <a href="/" className="ag-logo">Bold Petals</a>
                <ul className="ag-nav-links">
                    <li><a href="/" className="ag-nav-link">Home</a></li>
                    <li><a href="#valentine" className="ag-nav-link">Valentine's Love</a></li>
                    <li><a href="#gifting" className="ag-nav-link">Gifting Ideas</a></li>
                    <li><a href="#customize" className="ag-nav-link">Customize</a></li>
                    <li><a href="#jhumkas" className="ag-nav-link">Jhumkas</a></li>
                    <li><a href="#story" className="ag-nav-link">Our Story</a></li>
                </ul>
                <div className="ag-nav-icons">
                    <span className="ag-nav-icon">🔍</span>
                    <span className="ag-nav-icon">👤</span>
                    <span className="ag-nav-icon">🛒</span>
                </div>
            </div>
        </AgContainer>
    </nav>
);

export const AgAlertBar = ({ text }) => (
    <div className="ag-alert-bar">
        <AgContainer>
            <strong>{text}</strong>
        </AgContainer>
    </div>
);

export const AgFooter = () => (
    <footer className="ag-footer">
        <AgContainer>
            <div className="ag-footer-inner">
                <div className="ag-footer-info">
                    <span className="ag-footer-brand">Bold Petals</span>
                    <span>&copy; 2026. All rights reserved.</span>
                </div>
                <div className="ag-footer-notes">
                    <p>Choosing a selection results in a full page refresh.</p>
                    <p>Opens in a new window.</p>
                </div>
            </div>
        </AgContainer>
    </footer>
);
