import React from 'react';
import { AgSection, AgHeroSlider } from '../../components/AgComponents';
import { ProductGrid } from '../../components/ProductGrid';

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

const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c4701?auto=format&fit=crop&q=80&w=2000',
    headline: 'Express Your Love',
    subheadline: 'Curated Valentine\'s Hampers & Thoughtful Gifts',
    ctaText: 'Shop the Valentine\'s Collection'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=2000',
    headline: 'Artisanal Packaging',
    subheadline: 'Elegant gift wraps and personalized boxes for every occasion.',
    ctaText: 'Explore Packaging'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=2000',
    headline: 'Perfect Gifting Ideas',
    subheadline: 'Find unique gifts for your loved ones, handpicked with care.',
    ctaText: 'View Gift Ideas'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355518b?auto=format&fit=crop&q=80&w=2000',
    headline: 'The Alpha Collection',
    subheadline: 'Exclusive premium gifts designed for him.',
    ctaText: 'Shop for Him'
  }
];

export default function Home() {
  return (
    <>
      <AgHeroSlider slides={HERO_SLIDES} />
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
    </>
  );
}