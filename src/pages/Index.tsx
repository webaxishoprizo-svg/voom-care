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

const Index = () => (
  <main id="main-content" className="min-h-screen bg-background">
    <Navbar />
    <HeroCarousel />
    <MarqueeBanner
      items={["Luxury Car Fragrance", "Crafted in India", "Zero-Liquid Technology", "45 Days Lasting", "100% Natural Oils", "Worn Worldwide"]}
    />
    <TrustBadges />
    <MarqueeBanner
      items={["FREE SHIPPING ON ALL ORDERS ABOVE ₹999", "ALL INDIA DELIVERY AVAILABLE"]}
    />
    <ProductGrid />
    <FeaturedProducts />
    <CollectionsSection />
    <MostCoveted />
    <ExperienceSection />
    <TestimonialsSection />
    <CTASection />
    <Newsletter />
    <Footer />
  </main>
);

export default Index;
