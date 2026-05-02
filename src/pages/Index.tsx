import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import MarqueeBanner from "@/components/MarqueeBanner";
import TrustBadges from "@/components/TrustBadges";
import ProductGrid from "@/components/ProductGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandQuality from "@/components/BrandQuality";
import CollectionsSection from "@/components/CollectionsSection";
import ExperienceSection from "@/components/ExperienceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ComingSoonBanner from "@/components/ComingSoonBanner";
import { Reveal } from "@/components/ScrollReveal";

import SEO from "@/components/SEO";

const Index = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VOOM Care",
    "url": "https://voomcare.com",
    "logo": "https://voomcare.com/voom-favicon.png",
    "description": "VOOM by Frenzo Group — premium car care formulas crafted in India.",
    "sameAs": [
      "https://instagram.com/voomcare"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "India"
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SEO
        title="VOOM | Premium Car Care | Shine Beyond Ordinary"
        description="VOOM by Frenzo Group — professional-grade car wash, polish and detailing formulas crafted in India. Showroom finish for enthusiasts."
        schema={orgSchema}
      />
      <Navbar />
      {/* Hero temporarily hidden - using Compo Breakdown as hero */}
      {false && <HeroCarousel />}
      <FeaturedProducts />
      <MarqueeBanner
        className="-rotate-[2deg] scale-[1] relative z-10 mt-10 mb-[-8px] py-4 shadow-none"
        items={["Premium Car Care", "Crafted in India", "Pro-Grade Formulas", "Paint Safe", "Shine Beyond Ordinary"]}
      />

      <Reveal delay={0.1}>
        <TrustBadges />
      </Reveal>
      
      <Reveal delay={0.1} duration={1}>
        <ProductGrid />
      </Reveal>

      <Reveal delay={0.1}>
        <CollectionsSection />
      </Reveal>

      <Reveal delay={0.1}>
        <ComingSoonBanner />
      </Reveal>


      <Reveal delay={0.1}>
        <BrandQuality />
      </Reveal>

      <Reveal delay={0.1}>
        <ExperienceSection />
      </Reveal>

      <Reveal delay={0.1}>
        <TestimonialsSection />
      </Reveal>

      <Reveal delay={0.1}>
        <CTASection />
      </Reveal>

      <Newsletter />
      <Footer />
    </main>
  );
};
export default Index;
