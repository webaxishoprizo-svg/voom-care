import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const TermsOfService = () => {
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
            Legal Agreement
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Terms of Service
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
                  <span className="text-primary/40 text-sm">01</span> About NOR
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR is a luxury automotive fragrance brand operated as an individual seller, designed and manufactured in Kerala, India. We sell fragrance products including perfume sprays and luxury diffusion tags through norperfume.com.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">02</span> Eligibility
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By placing an order, you confirm you are at least 18 years of age and legally capable of entering into a binding contract under Indian law. Minors may only order with the explicit consent of a parent or legal guardian who accepts these terms on their behalf. NOR reserves the right to refuse service, cancel orders, or restrict website access for any customer at its sole discretion.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">03</span> Products & Descriptions
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR makes every effort to ensure product descriptions, scent profiles, images, and pricing are accurate. In the event of a material error in a product listing, NOR reserves the right to cancel the affected order and issue a full refund. Product images are for illustrative purposes only — minor packaging variations between batches may occur.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">04</span> Pricing
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All prices are listed in Indian Rupees (₹) inclusive of applicable taxes unless otherwise stated. NOR reserves the right to change pricing at any time without prior notice. The price confirmed at checkout and payment is the price applicable to that order. If a product is listed at an incorrect price due to error, NOR reserves the right to cancel the order and refund in full.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">05</span> Promotional Codes & Offers
                </h2>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                  <li>Promotions are valid only for the specific period and conditions stated at the time of the promotion.</li>
                  <li>NOR reserves the right to withdraw, modify, or end any promotion at any time without prior notice.</li>
                  <li>Promotional codes cannot be combined with other offers, discounts, or promotions unless explicitly stated by NOR.</li>
                  <li>Expired, invalid, or previously used promotional codes will not be honoured under any circumstances.</li>
                  <li>Promotional prices or offers cannot be applied retroactively to orders already placed or confirmed.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">06</span> Orders & Acceptance
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Placing an order constitutes an offer to purchase. An order is confirmed only when NOR sends an order confirmation via SMS or email following successful payment. NOR reserves the right to decline any order including due to payment failure, suspected fraud, stock unavailability, undeliverable address, or policy violation. If NOR declines an order after payment, a full refund will be issued within 5–7 business days.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">07</span> No Cancellations
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Orders cannot be cancelled once placed and payment is confirmed. NOR operates a strict no-cancellation policy. Please review your order carefully — product, quantity, and delivery address — before completing checkout.
                  <br /><br />
                  <span className="text-primary italic">Note: Once your payment is confirmed, your order is locked and cannot be cancelled or modified under any circumstances. NOR will not make exceptions to this policy.</span>
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">08</span> Payment
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All orders must be paid in full at the time of ordering. NOR does not offer Cash on Delivery (COD), credit terms, or deferred payment. Accepted methods: UPI, debit cards, credit cards, and net banking — processed through a secure third-party gateway. NOR does not store or access any payment credentials.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">09</span> Shipping & Delivery
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR ships within India only via DTDC, Blue Dart, and Delhivery. Standard delivery takes 4–7 business days from dispatch. Free shipping on orders above ₹999. NOR is not liable for delays caused by courier partners, incorrect customer addresses, or circumstances beyond NOR's control.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">10</span> Returns & Replacements
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR does not accept returns on opened or used products. Damage claims require a valid unboxing video recorded before opening, submitted within 48 hours of delivery, along with photographs and order details. Eligible claims result in a replacement product only — no monetary refunds are issued under any circumstances.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">11</span> Product Use & Disclaimer
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR products are designed as luxury automotive fragrances for use inside vehicles. While formulations are toxin-free and suitable for skin contact, NOR makes no medical, therapeutic, or dermatological claims. Customers with known allergies or sensitivities should perform a patch test before skin use. Store away from heat and direct sunlight. Keep out of reach of children.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">12</span> Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on norperfume.com — including the NOR brand name, logo, product names, descriptions, images, and design — is the exclusive intellectual property of NOR, protected under applicable Indian and international intellectual property laws. Unauthorised use may result in legal action.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">13</span> Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by law, NOR shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from use of our website, products, or services. NOR's total liability shall not exceed the total amount paid by that customer for the specific product.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">14</span> Indemnification
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify and hold harmless NOR and its founder, personnel, and agents from any claims, damages, liabilities, and expenses arising from your violation of these Terms, misuse of our products or website, or submission of fraudulent claims.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">15</span> Fraud & Misuse
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR reserves the right to take legal action against any customer found to have submitted fraudulent damage claims, false non-receipt declarations, or manipulated evidence. Such customers will be permanently banned from purchasing on norperfume.com.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">16</span> Governing Law & Disputes
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms are governed by the laws of India. Any dispute unresolved through good-faith negotiation shall be subject to the exclusive jurisdiction of the competent courts in Kerala, India.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">17</span> Changes to These Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR reserves the right to update these Terms at any time. Changes will be posted with a revised effective date. Continued use of norperfume.com after any update constitutes acceptance of the revised terms.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">18</span> Entire Agreement
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service constitute the entire agreement between you and NOR regarding the use of our services.
                </p>
              </div>

              <div className="pt-8 border-t border-border/50 text-center">
                <p className="text-foreground font-medium mb-2 font-display uppercase tracking-widest text-lg">Legal Enquiries</p>
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

export default TermsOfService;
