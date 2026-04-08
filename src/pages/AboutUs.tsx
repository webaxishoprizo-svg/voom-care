import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Leaf, Award, Globe, Heart } from "lucide-react";
import SEO from "@/components/SEO";

const values = [
  { icon: Leaf, title: "100% Natural", desc: "We use only pure, sustainably sourced essential oils and botanicals." },
  { icon: Award, title: "Handcrafted Quality", desc: "Every fragrance is meticulously crafted by expert artisans in India." },
  { icon: Globe, title: "Worn Worldwide", desc: "Our fragrances are loved by car enthusiasts across the globe." },
  { icon: Heart, title: "Zero-Liquid Technology", desc: "Innovative solid fragrance technology for a cleaner, safer experience." },
];

const AboutUs = () => (
  <main className="min-h-screen bg-background text-foreground">
    <SEO 
      title="About Us | NOR Luxury Car Fragrances"
      description="The story of NOR. Handcrafted luxury automotive fragrances made in India with 100% natural oils and innovative zero-liquid technology."
    />
    <Navbar />
    <section className="pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-foreground mb-6"
        >
          About NOR
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
        >
          NOR was born from a passion for luxury and craftsmanship. We believe your car deserves a fragrance
          as refined as your taste. Crafted in India with 100% natural oils, our fragrances transform every
          drive into an extraordinary sensory experience.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground leading-relaxed mb-16 max-w-2xl mx-auto"
        >
          Our journey started with a simple question: why settle for synthetic air fresheners when you can
          have something truly exceptional? Using innovative zero-liquid technology and rare botanicals, we
          create fragrances that last up to 45 days while being completely safe for your car's interior.
        </motion.p>
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
