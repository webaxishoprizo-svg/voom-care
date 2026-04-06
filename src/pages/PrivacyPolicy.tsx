import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
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
            Your Privacy
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Privacy Policy
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
                  <span className="text-primary/40 text-sm">01</span> Who We Are
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR is a luxury automotive fragrance brand operated as an individual seller, designed and manufactured in Kerala, India. Our website is norperfume.com. For any privacy-related queries, contact us at <a href="mailto:norperfume.help@gmail.com" className="text-primary underline">norperfume.help@gmail.com</a> or via Instagram DM @norperfumeofficial. We respond to all privacy enquiries within 24 hours.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">02</span> Data Channels
                </h2>
                <p className="text-muted-foreground leading-relaxed font-medium mb-3">NOR collects personal data through the following channels:</p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                  <li>norperfume.com — when you browse, add to cart, or place an order</li>
                  <li>Email (norperfume.help@gmail.com) — when you contact us for support or submit a claim</li>
                  <li>Instagram DM (@norperfumeofficial) — when you contact us for support</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">03</span> Information We Collect
                </h2>
                <div className="space-y-4">
                  <h3 className="text-foreground font-medium text-lg">Information You Provide Directly</h3>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2 font-light">
                    <li>Full name — used to process and address your order</li>
                    <li>Email address — used for confirmations, updates, and support</li>
                    <li>Phone number — used for delivery coordination and notifications</li>
                    <li>Delivery address — used solely for shipping your order</li>
                    <li>Claim materials — unboxing videos and photographs submitted via email or Instagram DM for damage claim verification</li>
                  </ul>

                  <h3 className="text-foreground font-medium text-lg mt-6">Information Collected Automatically</h3>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-2 font-light">
                    <li>IP address, browser type, device identifiers, pages visited, and time spent on norperfume.com</li>
                    <li>Cookies and similar tracking technologies used to improve browsing experience</li>
                  </ul>

                  <h3 className="text-foreground font-medium text-lg mt-6">Payment Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    NOR does not collect, store, or access payment card details, bank account information, or UPI credentials. All payment transactions are processed entirely and securely by our third-party payment gateway.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">04</span> Instagram DM — Data Notice
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  NOR actively uses Instagram DM (@norperfumeofficial) as a customer support channel. When customers submit damage claims, unboxing videos, photographs, or personal order details via Instagram DM, this information is received and retained by NOR for claim verification and support resolution purposes.
                </p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2 mt-4 italic font-light text-sm">
                  <li>Instagram's own Privacy Policy governs all data transmitted through the Instagram platform.</li>
                  <li>NOR advises customers not to share sensitive personal or financial information via Instagram DM.</li>
                  <li>Claim-related materials received via Instagram DM are retained by NOR for up to 1 year for verification.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">05</span> How We Use Your Information
                </h2>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                  <li>To confirm, process, and fulfil your orders</li>
                  <li>To send order status, shipping updates, and delivery notifications</li>
                  <li>To respond to enquiries, damage claims, and support requests within 24 hours</li>
                  <li>To verify damage and non-receipt claims and prevent fraudulent submissions</li>
                  <li>To improve our website, products, and customer experience</li>
                  <li>To send marketing communications — only if you have explicitly opted in</li>
                  <li>To comply with applicable legal and regulatory obligations in India</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">06</span> Sharing Your Information
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed font-light">
                  NOR does not sell, rent, trade, or share your personal data with any third party for commercial purposes. Your data is shared only in the following strictly limited circumstances:
                </p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                  <li>Courier partners (DTDC, Blue Dart, Delhivery): Name, phone, and address shared solely to deliver your order.</li>
                  <li>Payment gateway: Transaction amount and order reference only — no financial credentials.</li>
                  <li>Shopify: As our e-commerce platform provider.</li>
                  <li>Legal authorities: Data disclosed only if required by law or court order in India.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">07</span> Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed font-light">
                  Our website uses essential cookies (required for checkout), analytics cookies (to understand site usage), and marketing cookies. You can disable cookies through your browser settings, though this may affect checkout functionality.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">08</span> Data Retention
                </h2>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                  <li>Order and transaction data: minimum 3 years for legal compliance</li>
                  <li>Customer support communications (email): up to 2 years</li>
                  <li>Damage claim materials (videos, photos): up to 1 year</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">09</span> Your Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed font-light">
                  You have the right to <span className="text-foreground">Access</span>, <span className="text-foreground">Correction</span>, <span className="text-foreground">Deletion</span>, and <span className="text-foreground">Opt out</span>. Contact <a href="mailto:norperfume.help@gmail.com" className="text-primary underline">norperfume.help@gmail.com</a> to exercise any of these rights. We respond within 24 hours.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">10</span> Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed font-light font-italic">
                  Our website operates over HTTPS with SSL encryption. Access to personal data is limited to authorised personnel only. In the event of a data breach, NOR commits to notifying affected customers promptly.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">11</span> Children's Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed font-light">
                  norperfume.com is intended for users aged 18 and above only. NOR does not knowingly collect personal data from minors. If we become aware that a minor has provided personal information, it will be deleted immediately.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-foreground mb-4 flex items-center gap-3">
                  <span className="text-primary/40 text-sm">12</span> Policy Changes
                </h2>
                <p className="text-muted-foreground leading-relaxed font-light">
                  NOR may update this Privacy Policy at any time. Material changes will be posted on this page with an updated effective date. Continued use of our website after any update constitutes acceptance of the revised policy.
                </p>
              </div>

              <div className="pt-8 border-t border-border/50">
                <p className="text-foreground font-medium mb-2 font-display uppercase tracking-widest text-lg">Privacy Enquiries</p>
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

export default PrivacyPolicy;
