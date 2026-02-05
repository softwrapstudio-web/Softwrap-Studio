import React from 'react';
import { AgContainer, AgSection, AgButton } from './components/AgComponents';
import { ProductGrid } from './components/ProductGrid';
import './index.css';

const HAMPERS = [
  { name: "Eternal Rose Hamper", price: "2,499.00", image: null },
  { name: "Sweetheart Delight", price: "1,850.00", image: null },
  { name: "Midnight Romance Box", price: "3,200.00", image: null },
  { name: "Classic Love Duo", price: "1,200.00", image: null },
];

const CUSTOM_PACKAGING = [
  { name: "Personalized Velvet Box", price: "450.00", image: null },
  { name: "Custom Engraved Crate", price: "899.00", image: null },
  { name: "Golden Ribbon Wrap", price: "150.00", image: null },
];

function App() {
  return (
    <div className="gift-shop">
      {/* Top Banner */}
      <div className="top-banner">
        Free shipping on orders above 999/-
      </div>

      {/* Hero Header */}
      <header className="hero">
        <AgContainer>
          <h1 className="hero-title">Valentines Love</h1>
          <p className="hero-subtitle">
            Celebrate the magic of love with our curated collection of artisanal gifts and bespoke hampers.
          </p>
          <AgButton variant="primary" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
            Explore Collection
          </AgButton>
        </AgContainer>
      </header>

      {/* Product Showcase - Gift Hampers */}
      <AgSection title="Gift Hampers" id="hampers">
        <ProductGrid products={HAMPERS} />
      </AgSection>

      {/* Product Showcase - Custom Packaging */}
      <AgSection title="Custom Packaging" id="packaging">
        <ProductGrid products={CUSTOM_PACKAGING} />
      </AgSection>

      {/* Brand Story */}
      <AgSection title="Our Story" className="story-section">
        <div className="story-content">
          <p className="story-text">
            "It all started with a simple dream: to make every gift feel as personal as a handwritten letter.
            At Softwrap, we believe that the beauty of a gift lies in the thought and the presentation.
            Our founder's passion for craftsmanship and romance drives every hamper we create,
            ensuring your loved ones feel truly special."
          </p>
        </div>
      </AgSection>

      {/* Footer / Contact (Optional but completes the look) */}
      <footer style={{ textAlign: 'center', padding: '40px', color: '#8c2f39', backgroundColor: '#fff0f3' }}>
        <p>&copy; 2026 Softwrap Studio. Handcrafted with Love.</p>
      </footer>
    </div>
  );
}

export default App;
