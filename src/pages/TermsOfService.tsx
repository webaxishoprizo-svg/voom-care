import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, ShoppingBag, Truck, AlertTriangle, FileText, Globe, Gavel, Ban } from "lucide-react";
import SEO from "@/components/SEO";

const TermsOfService = () => {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <SEO
        title="Terms of Service | VOOM Premium Car Care"
        description="The strict governing terms and conditions for using voomcare.com. Review our legal framework for purchases and usage."
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/10 opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-[10px] tracking-[0.5em] font-bold uppercase mb-4"
          >
            VOOM Care • Legal Framework
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-[10px] md:text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2"
          >
            Effective: January 2025 <span className="text-primary/30">•</span> Last Updated: May 2026
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
            
            <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-16">
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-lg font-light  text-center">
                  By accessing <span className="text-foreground font-medium underline underline-offset-4 decoration-primary/30">voomcare.com</span>, you entering into a legally binding agreement with VOOM. Failure to comply with these terms may result in immediate suspension of access and legal action.
                </p>
              </div>

              {/* 1. Binding Agreement */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">1. Binding Agreement</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed">
                  These Terms of Service ("Terms") constitute a legally binding contract between you and VOOM. By using our website or purchasing products, you represent that you have read, understood, and agree to be bound by these Terms. We reserve the absolute right to modify these Terms at any time; your continued use signifies acceptance of those changes.
                </p>
              </div>

              {/* 2. Prohibited Conduct */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Ban className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">2. Prohibited Conduct</h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>Users are strictly prohibited from:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Using the site for any fraudulent or illegal activities.</li>
                    <li>Attempting to bypass security measures or reverse-engineer our platform.</li>
                    <li>Unauthorized use of VOOM intellectual property for commercial gain.</li>
                    <li>Providing false information during checkout or support interactions.</li>
                  </ul>
                </div>
              </div>

              {/* 3. Strict Sales Policy */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">3. Sales & Payment Terms</h2>
                </div>
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                  <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                    VOOM operates a strict <strong>100% Prepaid-Only</strong> model. All transactions must be cleared through our secure payment gateway before shipment. Under our automated fulfillment protocol:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-primary/70">
                    <li><strong>We NEVER provide Cash on Delivery (COD) services.</strong> Any claims suggesting COD options are void.</li>
                    <li>Orders cannot be cancelled once payment is processed.</li>
                    <li>Addresses cannot be modified once the order enters "Processing" status.</li>
                    <li>Chargebacks without prior communication will be treated as fraudulent.</li>
                  </ul>
                </div>
              </div>

              {/* 4. Product Liability Disclaimer */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">4. Product Disclaimer</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  VOOM provides professional-grade chemical products. Use is at the user's sole risk. We explicitly disclaim liability for damage to vehicles, surfaces, or health resulting from improper application, failure to follow instructions, or lack of patch testing. Products are sold "as-is" without any express or implied warranties of merchantability or fitness for a specific purpose.
                </p>
              </div>

              {/* 5. Indemnification */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">5. Indemnification</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  You agree to indemnify and hold VOOM, its affiliates, and employees harmless from any claims, losses, or legal fees arising out of your breach of these Terms or your misuse of our products or website.
                </p>
              </div>

              {/* 6. Force Majeure & Shipping */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">6. Delivery & Force Majeure</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  VOOM shall not be held liable for delivery failures or delays caused by circumstances beyond our control, including but not limited to: courier negligence, extreme weather, strikes, or government-imposed restrictions. Risk of loss passes to the customer upon delivery to the courier partner.
                </p>
              </div>

              {/* 7. Legal Governance */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">7. Governing Law</h2>
                </div>
                <div className="p-8 bg-card border border-white/5 rounded-3xl space-y-4">
                  <p className="text-sm text-muted-foreground/80 font-light leading-relaxed ">
                    "If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole."
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Governing Law: Laws of India. Jurisdiction: Exclusive jurisdiction of the courts in Kerala, India.
                  </p>
                </div>
              </div>

              {/* Support Footer */}
              <div className="pt-20 border-t border-white/5 text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl text-foreground m-0 uppercase tracking-widest">Compliance</h2>
                  <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto font-light ">Strict adherence to these terms is mandatory for all transactions.</p>
                </div>
                <div className="inline-flex flex-col gap-2">
                  <a href="mailto:info.frenzogp@gmail.com" className="text-primary font-medium hover:underline text-lg">info.frenzogp@gmail.com</a>
                  <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em] font-display">Legal Department</span>
                </div>
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
