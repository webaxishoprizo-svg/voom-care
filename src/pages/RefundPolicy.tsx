import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const RefundPolicy = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-xs tracking-[0.3em] uppercase mb-4"
          >
            Resolution & Support
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Refund Policy
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-px bg-primary/30 mx-auto"
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-12">
              
              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">01</span> General Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Due to the nature of fragrance and personal care products, NOR does not accept returns, exchanges, or cancellations once an order has been placed or a product has been delivered and opened. All sales are considered final from the moment an order is confirmed and payment is received.
                  <br /><br />
                  Fragrance preference is personal and subjective — NOR does not accept returns based on scent preference, change of mind, or personal dissatisfaction with the fragrance under any circumstances.
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">02</span> Record Before You Unbox
                </h2>
                <p className="text-muted-foreground leading-relaxed italic">
                  NOR strongly advises every customer to begin video recording on their phone before touching or opening their delivery package. Keep recording through the entire unboxing process without stopping or cutting. If your product has been damaged during shipping, this video is your proof. Without it, NOR cannot process your claim.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">03</span> Definition of Damage
                </h2>
                <p className="text-muted-foreground mb-4">"Damage" is strictly defined as physical damage to the product itself that renders it unusable:</p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2 mb-6">
                  <li>A cracked or completely broken perfume bottle</li>
                  <li>A non-functional or broken spray mechanism</li>
                  <li>Significant leakage of the fragrance due to breakage</li>
                </ul>
                <p className="text-primary text-sm font-medium">Cosmetic packaging marks, slightly dented outer boxes, or packaging variations do not constitute damage.</p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">04</span> Eligible Claims
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR will only consider a claim if the product itself was physically damaged during the shipping process, and the damage was not caused by the customer after delivery. This is the only situation in which NOR will review a claim and arrange for a replacement product.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">05</span> Non-Receipt Claims
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you did not receive an order marked as delivered, report it within 48 hours. NOR will raise an investigation with the courier (up to 7 business days). If confirmed lost by the courier, NOR will arrange a replacement at no added cost.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">06</span> How to Submit a Claim
                </h2>
                <p className="text-muted-foreground mb-4">Contact NOR within 48 hours of delivery through one of the following:</p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-3">
                  <li><span className="text-foreground">Email:</span> <a href="mailto:norperfume.help@gmail.com" className="text-primary underline">norperfume.help@gmail.com</a> — attach your continuous unboxing video and photos.</li>
                  <li><span className="text-foreground">Instagram DM:</span> @norperfumeofficial — send your video and order number via direct message.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">07</span> Replacement Only — No Refunds
                </h2>
                <p className="text-muted-foreground leading-relaxed font-bold">
                  NOR does not offer monetary refunds under any circumstances, including for verified damage claims or lost orders. In all eligible cases, NOR will provide a replacement product only. By placing an order, you accept this policy.
                </p>
              </div>

              <div className="pt-8 border-t border-border/50">
                <p className="text-foreground font-medium mb-2 font-display uppercase tracking-widest text-lg">Support Enquiries</p>
                <a href="mailto:norperfume.help@gmail.com" className="text-primary hover:underline text-lg">norperfume.help@gmail.com</a>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default RefundPolicy;
