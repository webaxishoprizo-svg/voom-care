import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ExternalLink } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";

interface FAQItemData {
  q: string;
  a: string;
  steps?: string[];
  pill?: { text: string; type: string };
  note?: string;
}

interface FAQCategory {
  category: string;
  id: string;
  questions: FAQItemData[];
}

const faqData: FAQCategory[] = [
  {
    category: "Product & Brand",
    id: "product",
    questions: [
      {
        q: "What is VOOM?",
        a: "VOOM is a premium car care brand by Frenzo Group, based in India. We make professional-grade car wash, polish and detailing formulas that deliver a true showroom finish at home."
      },
      {
        q: "What products do you sell?",
        a: "Our current line-up includes Car Shampoo, Tyre Polish and Dash Clean — each a 100ml premium formula crafted for everyday detailing.",
        pill: { text: "Car Shampoo • Tyre Polish • Dash Clean", type: "info" }
      },
      {
        q: "What does Car Shampoo do?",
        a: "VOOM Car Shampoo is a high-foam, pH-balanced cleaning solution designed for effective dirt, mud, dust and road grime removal. Its gentle yet powerful formula ensures a deep clean while protecting your vehicle's paint, clear coat and wax finish."
      },
      {
        q: "What does Tyre Polish do?",
        a: "VOOM Tyre Polish is a high-performance formula that restores a deep black shine to tyres while forming a protective layer that repels dust and grime. It also helps prevent cracking and fading caused by regular wear and exposure."
      },
      {
        q: "Is VOOM safe for all paint and surfaces?",
        a: "Yes. VOOM formulas are pH balanced and safe on wax, sealants, ceramic coatings and all types of delicate paint finishes — including dashboards and trim.",
        pill: { text: "Paint safe • pH balanced", type: "success" }
      },
      {
        q: "Where is VOOM made?",
        a: "VOOM is designed and made in India under Frenzo Group. We oversee every step — from formulation to packaging — to make sure you get pro-grade quality every time."
      }
    ]
  },
  {
    category: "How to Use",
    id: "usage",
    questions: [
      {
        q: "What comes in the box?",
        a: "Each VOOM bottle is 100ml of concentrated, pro-grade formula. Directions for use are printed on the back of every bottle."
      },
      {
        q: "How do I use VOOM Car Shampoo?",
        a: "It is very easy. Just follow these steps:",
        steps: [
          "Mix the recommended amount of car shampoo with water.",
          "Apply using a sponge or microfiber cloth.",
          "Gently wash the vehicle surface in straight lines.",
          "Rinse thoroughly with clean water and dry with a microfiber towel."
        ],
        pill: { text: "Shake well before use", type: "success" }
      },
      {
        q: "How do I apply Tyre Polish?",
        a: "Clean the tyre surface thoroughly and allow it to dry. Apply a small amount of tyre polish onto a sponge or applicator pad, spread evenly across the tyre surface, and allow it to dry for a rich, glossy finish."
      },
      {
        q: "How do I use Dash Clean?",
        a: "Spray a small amount onto a clean microfiber cloth, gently wipe the dashboard or interior surface, then buff lightly for a clean, even, non-greasy finish."
      },
      {
        q: "How long does protection last?",
        a: "Depending on usage and weather, our products provide up to 6 months of protection in a single application — and even longer with regular maintenance washes."
      },
      {
        q: "How should I store VOOM products?",
        a: "Always close the bottle tightly after use. Store in a cool, dry place away from direct sunlight. Do not leave it inside a hot car for long periods."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    id: "shipping",
    questions: [
      {
        q: "Do you deliver across India?",
        a: "Yes, we ship to all locations across India. International shipping is something we are working on — follow @voom.care on Instagram for updates."
      },
      {
        q: "How long does delivery take?",
        a: "Most orders are delivered within 4–7 business days after your order is confirmed. Once your order ships, you will receive a tracking link by email or SMS."
      },
      {
        q: "Do you offer Cash on Delivery?",
        a: "No, we only accept prepaid payments right now. You can pay using UPI, debit card, credit card, or net banking. COD is not available.",
        pill: { text: "Prepaid only — no COD", type: "info" }
      },
      {
        q: "How do I track my order?",
        a: "Once your order is shipped, you will get a tracking link via SMS or email. You can also click Track Order in our website menu to check your delivery status anytime."
      },
      {
        q: "Is shipping free?",
        a: "Yes! Orders above ₹999 get free shipping. A small shipping fee applies to orders below that amount — you will see the exact cost at checkout."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    id: "returns",
    questions: [
      {
        q: "Can I return my order?",
        a: "We do not accept returns on opened or used products. However, if your product arrives damaged, we will sort it out for you right away. See below for how to report a damaged order.",
        pill: { text: "No returns on opened products", type: "warning" }
      },
      {
        q: "What if my order arrives damaged?",
        a: "We are sorry to hear that. Please contact us immediately and share the following:",
        steps: [
          "A video of you unboxing the order — recorded at the time of delivery, before opening.",
          "Clear photos of the damaged product and packaging.",
          "Your order number."
        ],
        pill: { text: "Unboxing video is required — no exceptions", type: "warning" },
        note: "Reach out to us on Instagram @voom.care or via our Contact page. We cannot process claims without the unboxing video."
      },
      {
        q: "What if I got the wrong product?",
        a: "We apologise for that! Please contact us within 48 hours of receiving your order. Send us your order number and a photo of what you received. We will send you the correct product at no extra charge."
      },
      {
        q: "Can I exchange a product?",
        a: "Exchanges are only possible if your product arrived damaged or you received the wrong item. We recommend reading the product description carefully before ordering."
      }
    ]
  }
];

const FAQItem = ({ item }: { item: FAQItemData }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-[17px] font-medium text-foreground/90 group-hover:text-primary transition-colors pr-8">
          {item.q}
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
            <div className="pb-8 space-y-4">
              <p className="text-muted-foreground text-[15px] leading-relaxed pr-12">
                {item.a}
              </p>

              {item.steps && (
                <ol className="space-y-3 pl-5 list-decimal text-muted-foreground text-[14px]">
                  {item.steps.map((step, i) => (
                    <li key={i} className="pl-2">{step}</li>
                  ))}
                </ol>
              )}

              {item.pill && (
                <div className={`inline-flex px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${item.pill.type === 'success' ? 'bg-green-500/10 text-green-500' :
                  item.pill.type === 'info' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                  {item.pill.text}
                </div>
              )}

              {item.note && (
                <p className="text-[13px] italic text-muted-foreground/60 border-l-2 border-primary/20 pl-4 py-1">
                  {item.note}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = [
    { label: "All", id: "ALL" },
    { label: "Product & Care", id: "product" },
    { label: "How to Use", id: "usage" },
    { label: "Shipping", id: "shipping" },
    { label: "Returns", id: "returns" }
  ];

  const filteredData = faqData.filter(cat => {
    if (activeCategory === "ALL") return true;
    return cat.id === activeCategory;
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(cat => cat.questions).map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO 
        title="FAQ | VOOM Premium Car Care | Help Centre"
        description="Find answers to common questions about VOOM carcare products, premium car shampoo, delivery times, and detailing usage instructions."
        keywords="car care FAQ, car shampoo help, carcare products India, VOOM support, detailing instructions, car wash tips"
        schema={faqSchema}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-8 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-[13px] font-medium tracking-wide mb-4"
          >
            VOOM Care — Help Centre
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl text-foreground mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-[16px] max-w-lg mx-auto leading-relaxed"
          >
            Simple answers to everything you need to know about VOOM.
          </motion.p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="pb-12 px-4 shadow-sm sticky top-[80px] z-30 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-[13px] font-medium transition-all duration-300 border ${activeCategory === cat.id
                  ? "bg-foreground text-background border-foreground shadow-lg"
                  : "bg-surface-glass text-foreground/60 border-white/5 hover:border-white/20 hover:text-foreground"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-32 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-20"
              >
                {filteredData.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center gap-6 mb-8">
                      <h2 className="font-display text-xl text-foreground shrink-0">
                        {category.category}
                      </h2>
                      <div className="h-px bg-border/30 w-full" />
                    </div>

                    <div className="bg-card/30 backdrop-blur-sm border border-border/20 rounded-[32px] px-8 py-2">
                      {category.questions.map((item, i) => (
                        <FAQItem key={item.q} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Support Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="bg-primary/5 border border-primary/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="text-center md:text-left">
                <h3 className="text-foreground font-semibold text-lg mb-1">Still have a question?</h3>
                <p className="text-muted-foreground text-sm">We are happy to help via email or Instagram.</p>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 rounded-full font-medium text-sm hover:scale-105 transition-transform"
              >
                Ask us <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </main>
  );
};

export default FAQ;
