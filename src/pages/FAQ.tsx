import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    category: "PRODUCT & FRAGRANCE",
    questions: [
      {
        q: "What is NOR PERFUME?",
        a: "NOR is a luxury automotive fragrance brand designed and manufactured in Kerala, India. We create toxin-free, essential-oil-based car fragrances that deliver a refined, long-lasting scent experience inside your vehicle."
      },
      {
        q: "What fragrances does NOR currently offer?",
        a: "NOR currently offers two handpicked fragrances — MUSK NOR and AQUA NOR. Each is priced at ₹1,499 and includes a 20ml fragrance spray and one NOR luxury diffusion tag."
      },
      {
        q: "Is NOR PERFUME toxin-free and safe to use?",
        a: "Yes. NOR fragrances are developed using essential-oil-based blends. Our formulations are designed to be free from harmful toxins, making them safe for everyday use inside your vehicle."
      },
      {
        q: "Can NOR PERFUME be used on my skin or body?",
        a: "Yes. NOR fragrances are formulated with clean, toxin-free ingredients gentle enough for skin contact. However, NOR is primarily designed as a luxury automotive fragrance. We recommend doing a patch test if you have sensitive skin."
      },
      {
        q: "What is MUSK NOR like?",
        a: "MUSK NOR is a warm, woody, and sensual fragrance. Ideal for those who prefer a deeper, more refined scent — it delivers a balanced and long-lasting experience when used with the NOR diffusion tag."
      },
      {
        q: "What is AQUA NOR like?",
        a: "AQUA NOR is a fresh, clean, and aquatic fragrance. Light and crisp without being overpowering — ideal for everyday use, particularly in warmer climates."
      },
      {
        q: "Where is NOR manufactured?",
        a: "NOR products are designed and manufactured in Kerala, India. We maintain close oversight of our production process — from fragrance sourcing and formulation to packaging — to ensure consistent quality."
      }
    ]
  },
  {
    category: "HOW TO USE",
    questions: [
      {
        q: "What is the NOR tag-and-spray system?",
        a: "Each NOR product includes a 20ml fragrance spray and a NOR luxury diffusion tag. The tag absorbs the fragrance oils and releases the scent gradually into your vehicle interior — giving you a more consistent, controlled fragrance experience."
      },
      {
        q: "How do I use NOR PERFUME in my car?",
        a: "Using NOR is simple and takes less than a minute:\n1. Remove the perfume bottle and premium NOR tag from the box.\n2. Hold the bottle approximately 10–15 cm away from the tag.\n3. Spray the perfume evenly across the surface of the NOR tag.\n4. Hang the tag on your rear-view mirror or any area with good airflow.\n5. Reapply when the scent begins to fade."
      },
      {
        q: "How do I control the strength of the fragrance?",
        a: "You have full control over the scent intensity. Apply more spray to the tag for a stronger fragrance, or less for something more subtle. You can also reapply as needed based on your preference."
      },
      {
        q: "How long does the fragrance last on the NOR tag?",
        a: "The duration depends on the amount of fragrance applied, your vehicle's airflow, temperature, and usage patterns. NOR's essential-oil-based formula is designed to support extended fragrance diffusion."
      },
      {
        q: "Where is the best place to hang the NOR tag in my car?",
        a: "The NOR tag works best near your rear-view mirror or near an air vent. Avoid placing it in direct sunlight for extended periods, as sustained heat may affect diffusion rate and longevity."
      },
      {
        q: "How should I store the NOR PERFUME bottle?",
        a: "After each use, close the bottle tightly and store in a cool, dry place away from direct sunlight. Avoid storing it in a hot car for prolonged periods."
      }
    ]
  },
  {
    category: "SHIPPING & DELIVERY",
    questions: [
      {
        q: "Where does NOR deliver?",
        a: "NOR currently ships across India. We are working towards expanding to international markets. Follow us on Instagram @norperfumeofficial for updates."
      },
      {
        q: "How long does delivery take?",
        a: "Standard delivery within India typically takes 4–7 business days from the date of order confirmation. You will receive a tracking link once your order has been dispatched."
      },
      {
        q: "Do you offer Cash on Delivery (COD)?",
        a: "No. NOR accepts prepaid orders only. We accept all major payment methods including UPI, debit/credit cards, and net banking."
      },
      {
        q: "How do I track my order?",
        a: "Once your order is dispatched, you will receive a tracking link via email or SMS. You can also use the Track Order page on our website."
      },
      {
        q: "Is there free shipping?",
        a: "We offer free shipping on orders above ₹999. For orders below this threshold, a standard shipping fee will be applied at checkout."
      }
    ]
  },
  {
    category: "RETURNS & REFUNDS",
    questions: [
      {
        q: "What is NOR's return policy?",
        a: "As a fragrance product, NOR does not accept returns once the product has been opened or used. However, if your product arrives damaged due to a delivery issue, we will make it right."
      },
      {
        q: "What do I do if my product arrives damaged?",
        a: "If your NOR product arrives damaged, please contact our support team. A mandatory unboxing video (recorded at delivery) and clear photographs are required to process a claim."
      },
      {
        q: "What if I received the wrong product?",
        a: "If you received an incorrect product, please contact us within 48 hours of delivery with your order number and a clear photo. We will arrange for the correct product at no cost."
      },
      {
        q: "Do you offer exchanges?",
        a: "Exchanges are only considered in cases of confirmed delivery damage or an incorrect product being dispatched. We do not offer exchanges based on fragrance preference."
      }
    ]
  }
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg text-foreground/90 group-hover:text-primary transition-colors pr-8">
          {q}
        </span>
        <div className={`p-2 rounded-full bg-primary/5 group-hover:bg-primary/20 transition-all ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground pb-8 leading-relaxed whitespace-pre-line pr-12">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  
  const categories = ["ALL", "PRODUCT & FRAGRANCE", "HOW TO USE", "SHIPPING", "RETURNS"];
  
  const filteredData = faqData.filter(cat => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "SHIPPING") return cat.category === "SHIPPING & DELIVERY";
    if (activeCategory === "RETURNS") return cat.category === "RETURNS & REFUNDS";
    return cat.category === activeCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-xs tracking-[0.3em] uppercase mb-4"
          >
            Support Center
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-muted-foreground text-sm max-w-lg mx-auto"
          >
            Everything you need to know about NOR products, shipping, and usage. Can't find an answer? 
            <a href="mailto:norperfume.help@gmail.com" className="text-primary ml-1 hover:underline">Email us.</a>
          </motion.p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-xs tracking-[0.2em] font-medium uppercase border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-foreground text-background border-foreground shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    : "bg-surface-glass text-foreground/60 border-white/10 hover:border-white/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-16"
              >
                {filteredData.map((category, idx) => (
                  <div key={category.category}>
                    <div className="flex items-center gap-4 mb-8">
                       <h2 className="font-display text-xl tracking-[0.2em] text-foreground shrink-0 uppercase">
                        {category.category}
                      </h2>
                      <div className="h-px bg-border/50 w-full" />
                    </div>
                    
                    <div className="bg-card/20 backdrop-blur-sm border border-border/30 rounded-3xl px-8">
                      {category.questions.map((item, i) => (
                        <FAQItem key={item.q} q={item.q} a={item.a} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FAQ;
