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
const CollectionsSection = lazy(() => import("@/components/CollectionsSection"));
const IndividualProducts = lazy(() => import("@/components/IndividualProducts"));
const ExperienceSection = lazy(() => import("@/components/ExperienceSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const Footer = lazy(() => import("@/components/Footer"));
const ComingSoonBanner = lazy(() => import("@/components/ComingSoonBanner"));
const HomeBlogSection = lazy(() => import("@/components/HomeBlogSection"));
const WhatsAppButton = lazy(() => import("@/components/WhatsAppButton"));


const SectionFallback = () => <div className="h-32" aria-hidden />;

const Index = () => {
  const homeSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://voomcare.com/#webpage",
      url: "https://voomcare.com/",
      name: "VOOM® | Premium Car Care India",
      inLanguage: "en-IN",
      isPartOf: { "@id": "https://voomcare.com/#website" },
      about: { "@id": "https://voomcare.com/#organization" },
      primaryImageOfPage: "https://voomcare.com/og-image.jpg",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", "meta[name='description']"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is VOOM Care?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "VOOM is a premium car care brand by Frenzo Group, based in Kozhikode, Kerala, India. VOOM makes professional-grade car shampoo, tyre polish, and dash cleaner for a true showroom finish at home.",
          },
        },
        {
          "@type": "Question",
          name: "Where is VOOM Care available?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "VOOM Care ships to all locations across India. Orders above ₹999 include free shipping and most orders arrive within 4–7 business days.",
          },
        },
        {
          "@type": "Question",
          name: "Is VOOM safe for ceramic coating and all paint types?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. VOOM formulas are pH balanced and safe on wax, sealants, ceramic coatings, and all types of delicate paint finishes.",
          },
        },
        {
          "@type": "Question",
          name: "Which is the best car shampoo in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "VOOM Car Shampoo is a top-rated premium car shampoo in India — a high-foam, pH-balanced cleaner designed to remove dirt and road grime while protecting wax, sealant, and ceramic coatings.",
          },
        },
      ],
    },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SEO
        title="VOOM | Best Car Care Products & Premium Detailing"
        description="Official VOOM® Store. Shop India's best car care products, professional car shampoo, and detailing kits. Engineered for excellence, trusted by professionals. Shine Beyond Ordinary."
        keywords="VOOM, VOOM Care, best car shampoo India, car detailing products, premium car care, auto detailing, car wash kit, tyre polish, professional car care"
        canonical="/"
        schema={homeSchemas}
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
        <IndividualProducts />
        <CollectionsSection />
        <FeaturedProducts />
        <ExperienceSection />
        <TestimonialsSection />
        <HomeBlogSection />
        <ComingSoonBanner />
        <CTASection />
        <Newsletter />
        <Footer />
        <WhatsAppButton />
      </Suspense>
    </main>
  );
};
export default Index;
