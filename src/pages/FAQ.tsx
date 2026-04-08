import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ExternalLink } from "lucide-react";
import { useState } from "react";

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
    category: "Product & Fragrance",
    id: "product",
    questions: [
      {
        q: "What is NOR Perfume?",
        a: "NOR is a luxury car perfume brand from Kerala, India. We make toxin-free, natural fragrances specially designed for your car. Our perfumes smell great, last long, and are safe enough to use on your skin too."
      },
      {
        q: "What fragrances do you sell?",
        a: "We currently have two fragrances — musk and Aqua. Both are priced at ₹1,499 each. Every order includes a 20ml perfume spray bottle and one NOR luxury diffusion tag.",
        pill: { text: "musk • Aqua — ₹1,499 each", type: "info" }
      },
      {
        q: "What does musk smell like?",
        a: "musk is a warm, deep, and woody fragrance. It gives your car a rich and sophisticated feel. If you like strong, bold scents, musk is the one for you."
      },
      {
        q: "What does Aqua smell like?",
        a: "Aqua is a fresh, clean, and light fragrance — like a cool ocean breeze. It keeps your car smelling crisp and refreshing. Great for everyday use, especially in warm weather."
      },
      {
        q: "Is NOR safe to use?",
        a: "Yes, completely. NOR is 100% toxin-free and made with natural fragrance oils. It is safe to use inside your car every day. It is even gentle enough to use on your skin.",
        pill: { text: "Toxin-free • Safe on skin", type: "success" }
      },
      {
        q: "Where is NOR made?",
        a: "NOR is designed and made in Kerala, India. We personally oversee every step — from choosing the fragrance oils to packing your order — to make sure you get the best quality every time."
      }
    ]
  },
  {
    category: "How to Use",
    id: "usage",
    questions: [
      {
        q: "What comes in the box?",
        a: "Inside every NOR box you will find a 20ml fragrance spray bottle and one NOR luxury diffusion tag. That is everything you need to get started."
      },
      {
        q: "How do I use NOR in my car?",
        a: "It is very easy. Just follow these steps:",
        steps: [
          "Take the perfume bottle and the NOR tag out of the box.",
          "Hold the bottle about 10–15 cm away from the tag.",
          "Spray the perfume evenly on the tag.",
          "Hang the tag on your rear-view mirror or anywhere with good airflow.",
          "When the scent fades, just spray again to refresh it.",
          "After use, close the bottle tightly and keep it in a cool, dry place away from sunlight."
        ],
        pill: { text: "Ready in under a minute", type: "success" }
      },
      {
        q: "Where should I hang the NOR tag in my car?",
        a: "The best spots are your rear-view mirror or near an air vent — anywhere air flows freely. Good airflow helps the scent spread evenly through your car. Try to keep the tag out of direct sunlight to make the fragrance last longer."
      },
      {
        q: "How do I make the scent stronger or lighter?",
        a: "Simple — spray more for a stronger scent, spray less for something lighter. You are fully in control. Just reapply whenever you feel the fragrance is fading."
      },
      {
        q: "How long will the fragrance last?",
        a: "It depends on how much you spray, your car's ventilation, and the temperature. The NOR tag is designed to release the scent slowly over time. Once the smell fades, just spray the tag again to bring it back."
      },
      {
        q: "How should I store the perfume bottle?",
        a: "Always close the bottle tightly after use. Store it in a cool, dry place away from direct sunlight. Do not leave it inside a hot car for long periods — heat can affect the fragrance quality."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    id: "shipping",
    questions: [
      {
        q: "Do you deliver across India?",
        a: "Yes, we ship to all locations across India. International shipping is something we are working on — follow us on Instagram @norperfumeofficial for updates."
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
        note: "Reach out to us on Instagram @norperfumeofficial or via our Contact page. We cannot process claims without the unboxing video."
      },
      {
        q: "What if I got the wrong product?",
        a: "We apologise for that! Please contact us within 48 hours of receiving your order. Send us your order number and a photo of what you received. We will send you the correct product at no extra charge."
      },
      {
        q: "Can I exchange my fragrance?",
        a: "Exchanges are only possible if your product arrived damaged or you received the wrong item. We do not exchange based on scent preference. We recommend reading the musk and Aqua descriptions carefully before ordering."
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
    { label: "Product & Fragrance", id: "product" },
    { label: "How to Use", id: "usage" },
    { label: "Shipping", id: "shipping" },
    { label: "Returns", id: "returns" }
  ];

  const filteredData = faqData.filter(cat => {
    if (activeCategory === "ALL") return true;
    return cat.id === activeCategory;
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
            className="text-primary text-[13px] font-medium tracking-wide mb-4"
          >
            NOR Perfume — Help Centre
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
            Simple answers to everything you need to know about NOR.
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
