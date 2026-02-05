import React from 'react';
import { AgContainer, AgSection, AgButton, AgNavbar, AgAlertBar, AgFooter } from './components/AgComponents';
import { ProductGrid } from './components/ProductGrid';
import './index.css';

const VALENTINE_LOVE = [
  { name: "Romance Hamper", price: "2,499.00", image: null },
  { name: "Sweetheart Delight", price: "1,850.00", image: null },
  { name: "Eternal Rose Box", price: "3,200.00", image: null },
];

const CUSTOM_PACKAGING = [
  { name: "Personalized Velvet Box", price: "450.00", image: null },
  { name: "Custom Engraved Crate", price: "899.00", image: null },
  { name: "Golden Ribbon Wrap", price: "150.00", image: null },
];

const GIFTING_IDEAS = [
  { name: "Luxury Tea Set", price: "1,299.00", image: null },
  { name: "Journal & Pen Set", price: "750.00", image: null },
  { name: "Aromatic Candle Duo", price: "599.00", image: null },
];

const MAKEUP_CHOCOLATE = [
  { name: "Glam Makeup Kit", price: "3,500.00", image: null },
  { name: "Artisanal Truffles", price: "999.00", image: null },
  { name: "Berry Glow Box", price: "1,450.00", image: null },
];

const THE_ALPHA = [
  { name: "Executive Grooming Kit", price: "2,200.00", image: null },
  { name: "Leather Tech Roll", price: "1,150.00", image: null },
  { name: "Classic Tie & Cufflinks", price: "1,800.00", image: null },
];

const JHUMKAS = [
  { name: "Traditional Kundan Jhumka", price: "650.00", image: null },
  { name: "Modern Pearl Jhumka", price: "499.00", image: null },
  { name: "Antique Gold Jhumka", price: "850.00", image: null },
];

function App() {
  return (
    <div className="bold-petals-site">
      <AgAlertBar text="🎁 Free shipping on all orders above Rs. 999!" />
      <AgNavbar />

      {/* Hero Section */}
      <section className="ag-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1549465220-1d8c9d9c4701?auto=format&fit=crop&q=80&w=2000)' }}>
        <div className="ag-hero-overlay"></div>
        <AgContainer>
          <div className="ag-hero-content">
            <h1 className="ag-hero-headline">Express Your Love</h1>
            <p className="ag-hero-subheadline">Curated Valentine's Hampers & Thoughtful Gifts</p>
            <AgButton variant="primary" className="hero-btn">
              Shop the Valentine's Collection →
            </AgButton>
          </div>
        </AgContainer>
      </section>

      {/* Main Content Sections */}
      <AgSection title="Valentine's Love" id="valentine">
        <ProductGrid products={VALENTINE_LOVE} />
      </AgSection>

      <AgSection title="Custom Packaging" id="customize">
        <ProductGrid products={CUSTOM_PACKAGING} />
      </AgSection>

      <AgSection title="Gifting Ideas" id="gifting">
        <ProductGrid products={GIFTING_IDEAS} />
      </AgSection>

      <AgSection title="Makeup/Chocolate/more" id="makeup">
        <ProductGrid products={MAKEUP_CHOCOLATE} />
      </AgSection>

      <AgSection title="The Alpha (for boyfriend)" id="alpha">
        <ProductGrid products={THE_ALPHA} />
      </AgSection>

      <AgSection title="Jhumkas" id="jhumkas">
        <ProductGrid products={JHUMKAS} />
      </AgSection>

      {/* Brand Story Section */}
      <AgSection title="Our Story" className="story-section" id="story">
        <div className="ag-story">
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400"
            alt="Founder"
            className="ag-story-avatar"
          />
          <div className="ag-story-content">
            <p className="ag-story-text">
              "It all started with a simple dream: to make every gift feel as personal as a handwritten letter.
              Founded by Shreya, we believe that the beauty of a gift lies in the thought and the presentation.
              Our passion for craftsmanship and romance drives every hamper we create, ensuring your loved ones feel truly special."
            </p>
          </div>
        </div>
      </AgSection>

      <AgFooter />
    </div>
  );
}

export default App;
