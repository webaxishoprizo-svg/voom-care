import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Sparkles, Award, ShieldCheck, Beaker } from "lucide-react";
import SEO from "@/components/SEO";

import frenzoLogo from "@/assets/frenzo-logo.jpeg";

const values = [
  { icon: Sparkles, title: "Instant Results", desc: "See the difference from the very first use — no layering or buffing required." },
  { icon: ShieldCheck, title: "Paint Safe", desc: "pH balanced formulas safe for all paint types, ceramic coatings and trim." },
  { icon: Award, title: "Pro-Grade Power", desc: "The same formulas trusted by professional detailers, now made for home use." },
  { icon: Beaker, title: "Engineered in India", desc: "Precision-engineered by Frenzo Group with chemical engineers and pro detailers." },
];

const aboutSchema = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About VOOM Care",
    url: "https://voomcare.com/about",
    inLanguage: "en-IN",
    mainEntity: { "@id": "https://voomcare.com/#organization" },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://voomcare.com/" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://voomcare.com/about" },
    ],
  },
];

const AboutUs = () => (
  <main className="min-h-screen bg-background text-foreground">
    <SEO
      title="About VOOM | Premium Car Care by Frenzo Group"
      description="VOOM Care is a premium car care brand by Frenzo Group, engineered in Kozhikode, Kerala. Learn the story behind India's showroom-finish detailing formulas."
      canonical="/about"
      schema={aboutSchema}
    />

    <Navbar />
    <section className="pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-foreground mb-6"
        >
          About VOOM
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
        >
          VOOM was born from a shared passion for cars and perfection. Founded under Frenzo Group by four
          enthusiasts, the brand started with a simple idea — bring professional-grade car care to everyday
          users. Every VOOM product is crafted with precision, ensuring your car gets the care it deserves.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground leading-relaxed mb-16 max-w-2xl mx-auto"
        >
          Every formula is tested across hundreds of vehicles — from daily drivers to exotic supercars —
          ensuring consistent, professional-grade results regardless of the surface or condition. Our vision
          is to become a leading premium car care brand known for innovation, quality and trust.
        </motion.p>

        {/* Brand Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20 max-w-sm mx-auto"
        >
          <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-10 backdrop-blur-md">
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary/40 mb-8 font-semibold">Our Parent Group</p>
            <div className="flex items-center justify-center">
              <img 
                src={frenzoLogo} 
                alt="Frenzo Group" 
                className="h-24 md:h-32 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-500" 
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <v.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-foreground text-lg mb-2">{v.title}</h3>
            <p className="text-muted-foreground text-sm">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </main>
);

export default AboutUs;
