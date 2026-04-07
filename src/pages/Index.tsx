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

const Index = () => (
  <main id="main-content" className="min-h-screen bg-background">
    <Navbar />
    <HeroCarousel />
    <MarqueeBanner
      items={["Luxury Car Fragrance", "Crafted in India", "Zero-Liquid Technology", "45 Days Lasting", "100% Natural Oils", "Worn Worldwide"]}
    />
    <Reveal delay={0.1}>
      <TrustBadges />
    </Reveal>
    <MarqueeBanner
      items={["FREE SHIPPING ON ALL ORDERS ABOVE ₹999", "ALL INDIA DELIVERY AVAILABLE"]}
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

export default Index;
