import React from 'react';

export const AgContainer = ({ children, className = '' }) => (
    <div className={`ag-container ${className}`}>
        {children}
    </div>
);

export const AgSection = ({ children, title, className = '' }) => (
    <section className={`ag-section ${className}`}>
        <AgContainer>
            {title && <h2 className="ag-section-title">{title}</h2>}
            {children}
        </AgContainer>
    </section>
);

export const AgButton = ({ children, variant = 'primary', className = '', ...props }) => (
    <button className={`ag-button ag-button-${variant} ${className}`} {...props}>
        {children}
    </button>
);

export const AgCard = ({ image, name, price, onAddToCart }) => (
    <div className="ag-card">
        <div className="ag-card-image">
            {image ? <img src={image} alt={name} /> : <div className="ag-image-placeholder">{name}</div>}
        </div>
        <div className="ag-card-content">
            <h3 className="ag-card-name">{name}</h3>
            <p className="ag-card-price">Regular price Rs. {price}</p>
            <AgButton onClick={onAddToCart} className="ag-card-button">Add to Cart</AgButton>
        </div>
    </div>
);
