import React from 'react';
import { Link } from 'react-router-dom';

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

export const AgHeroSlider = ({ slides }) => {
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000); // Swap every 5 seconds
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="ag-hero-slider">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`ag-slide ${index === current ? 'ag-slide--active' : ''}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="ag-hero-overlay"></div>
                    <AgContainer>
                        <div className="ag-hero-content">
                            <h1 className="ag-hero-headline">{slide.headline}</h1>
                            <p className="ag-hero-subheadline">{slide.subheadline}</p>
                            <AgButton variant="primary" className="hero-btn">
                                {slide.ctaText} →
                            </AgButton>
                        </div>
                    </AgContainer>
                </div>
            ))}
            <div className="ag-slider-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`ag-slider-dot ${index === current ? 'ag-slider-dot--active' : ''}`}
                        onClick={() => setCurrent(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export const AgNavbar = () => (
    <nav className="ag-navbar">
        <AgContainer className="ag-container--fluid">
            <div className="ag-navbar-inner">
                <Link to="/" className="ag-logo">
                    <img src="/logo.jpg" alt="Softwrap Studio Logo" className="ag-logo-img" />
                    Softwrap Studio
                </Link>
                <ul className="ag-nav-links">
                    <li><Link to="/" className="ag-nav-link">Home</Link></li>
                    <li><a href="/#valentine" className="ag-nav-link">Valentine's Love</a></li>
                    <li><a href="/#gifting" className="ag-nav-link">Gifting Ideas</a></li>
                    <li><a href="/#customize" className="ag-nav-link">Customize</a></li>
                    <li><a href="/#jhumkas" className="ag-nav-link">Jhumkas</a></li>
                    <li><a href="/#story" className="ag-nav-link">Our Story</a></li>
                </ul>
                <div className="ag-nav-icons">
                    <span className="ag-nav-icon">🔍</span>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <AgButton variant="outline" className="nav-login-btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                            Login
                        </AgButton>
                    </Link>
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
                    <span className="ag-footer-brand">Softwrap Studio</span>
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
