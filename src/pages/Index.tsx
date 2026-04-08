import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import MarqueeBanner from "@/components/MarqueeBanner";
import TrustBadges from "@/components/TrustBadges";
import ProductGrid from "@/components/ProductGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import MostCoveted from "@/components/MostCoveted";
import CollectionsSection from "@/components/CollectionsSection";
import ExperienceSection from "@/components/ExperienceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/ScrollReveal";

import SEO from "@/components/SEO";

const Index = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NOR Perfume",
    "url": "https://norperfume.com",
    "logo": "https://norperfume.com/logo.png",
    "description": "Luxury automotive fragrance brand designed and manufactured in India.",
    "sameAs": [
      "https://instagram.com/norperfumeofficial"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kerala",
      "addressCountry": "India"
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SEO 
        title="NOR | Luxury Car Fragrances | Crafted in India"
        description="Experience automotive luxury with NOR's premium car fragrances. Handcrafted in India with 100% natural oils, our zero-liquid technology provides 45+ days of lasting scent."
        schema={orgSchema}
      />
      <Navbar />
      <HeroCarousel />
      <MarqueeBanner
        className="-rotate-[2deg] scale-[1] relative z-10 mt-10 mb-[-8px] py-4 shadow-none"
        items={["Luxury Car Fragrance", "Crafted in India", "Zero-Liquid Technology", "45 Days Lasting", "100% Natural Oils"]}
      />
      <Reveal delay={0.1}>
        <TrustBadges />
      </Reveal>
      <MarqueeBanner
        className="rotate-[2deg] scale-[1] relative z-10 my-4 py-4 shadow-none"
        items={["FREE SHIPPING ON ALL ORDERS ABOVE ₹999", "ALL INDIA DELIVERY AVAILABLE", "FREE SHIPPING ON ALL ORDERS ABOVE ₹999", "ALL INDIA DELIVERY AVAILABLE"]}
      />
      <Reveal delay={0.2} duration={1}>
        <ProductGrid />
      </Reveal>
      <Reveal delay={0.1}>
        <FeaturedProducts />
      </Reveal>
      <Reveal delay={0.2}>
        <CollectionsSection />
      </Reveal>
      <Reveal delay={0.2}>
        <ExperienceSection />
      </Reveal>
      <Reveal delay={0.1}>
        <TestimonialsSection />
      </Reveal>
      <Reveal delay={0.2}>
        <CTASection />
      </Reveal>
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Index;
