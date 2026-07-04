import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import MobileVideoHero from "@/components/MobileVideoHero";
import TrustBadges from "@/components/TrustBadges";
import ProductGrid from "@/components/ProductGrid";
import { Reveal } from "@/components/ScrollReveal";
import SEO from "@/components/SEO";

// Below-the-fold: lazy-load to keep first paint fast
const FeaturedProducts = lazy(() => import("@/components/FeaturedProducts"));
const BrandQuality = lazy(() => import("@/components/BrandQuality"));
const CollectionsSection = lazy(() => import("@/components/CollectionsSection"));
const ExperienceSection = lazy(() => import("@/components/ExperienceSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const Footer = lazy(() => import("@/components/Footer"));
const ComingSoonBanner = lazy(() => import("@/components/ComingSoonBanner"));
const HomeBlogSection = lazy(() => import("@/components/HomeBlogSection"));


const SectionFallback = () => <div className="h-32" aria-hidden />;

const Index = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VOOM Care",
    "url": "https://voomcare.com",
    "logo": "https://voomcare.com/voom-favicon.png",
    "description": "VOOM by Frenzo Group — premium car care formulas crafted in India.",
    "sameAs": [
      "https://instagram.com/voom.care"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "India"
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SEO
        title="VOOM® | #1 Best Car Care Products & Premium Detailing"
        description="Official VOOM® Store. Shop India's best car care products, professional car shampoo, and detailing kits. Engineered for excellence, trusted by professionals. Shine Beyond Ordinary."
        keywords="VOOM, VOOM Care, best car shampoo India, car detailing products, premium car care, auto detailing, car wash kit, tyre polish, professional car care"
        schema={orgSchema}
      />
      <Navbar />

      {/* 1. Hero */}
      <MobileVideoHero />
      <div className="hidden lg:block">
        <HeroCarousel />
      </div>

      {/* 2. Marquee (temporarily hidden) */}

      {/* 3. Trust badges */}
      <Reveal delay={0.05}>
        <TrustBadges />
      </Reveal>

      {/* 4. Best Sellers */}
      <Reveal delay={0.05} duration={1}>
        <ProductGrid />
      </Reveal>

      <Suspense fallback={<SectionFallback />}>
        <Reveal delay={0.05}>
          <CollectionsSection />
        </Reveal>

        <Reveal delay={0.05}>
          <FeaturedProducts />
        </Reveal>

        <Reveal delay={0.05}>
          <BrandQuality />
        </Reveal>

        <Reveal delay={0.05}>
          <ExperienceSection />
        </Reveal>

        <Reveal delay={0.05}>
          <TestimonialsSection />
        </Reveal>

        <Reveal delay={0.05}>
          <HomeBlogSection />
        </Reveal>


        <Reveal delay={0.05}>
          <ComingSoonBanner />
        </Reveal>

        <Reveal delay={0.05}>
          <CTASection />
        </Reveal>

        <Newsletter />
        <Footer />
      </Suspense>
    </main>
  );
};
export default Index;
