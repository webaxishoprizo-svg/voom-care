import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Shield, Eye, Database, Lock, UserCheck, ShieldCheck, Mail, Instagram, FileText } from "lucide-react";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <SEO
        title="Privacy Policy | VOOM Premium Car Care"
        description="Official Privacy Policy of VOOM. Learn about our strict data protection protocols, user rights, and legal compliance measures."
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
            VOOM Care • Data Protection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Privacy Policy
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
                <p className="text-muted-foreground leading-relaxed text-lg font-light italic">
                  VOOM ("we," "us," or "our") is committed to protecting your personal information. This Privacy Policy outlines our strict protocols for data collection, usage, and security under Indian digital privacy standards.
                </p>
              </div>

              {/* 1. Legal Compliance */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">1. Legal Compliance</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  We operate in strict compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection Act (DPDP) of India. By accessing voomcare.com, you provide explicit consent for the collection and processing of your data as described herein.
                </p>
              </div>

              {/* 2. Data Collection Protocols */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">2. Data Collection</h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>We collect only the minimum necessary data required for professional service delivery:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Personal Identifiers:</strong> Name, shipping address, billing address, email, and phone number.</li>
                    <li><strong>Technical Data:</strong> IP address, device type, browser information, and session data for security and performance optimization.</li>
                    <li><strong>Transactional Data:</strong> History of purchases and payments processed through our secure encrypted gateways.</li>
                  </ul>
                </div>
              </div>

              {/* 3. Purpose of Processing */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">3. Use of Data</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  Your data is used strictly for: fulfilling contractual obligations (order delivery), legal compliance, fraud prevention, and enhancing user experience. We do not engage in unauthorized profiling or data mining for third-party advertising.
                </p>
              </div>

              {/* 4. Security & Encryption */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">4. Security Measures</h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>We implement multi-layered security protocols, including 256-bit SSL encryption for all data transmissions. In the event of a suspected data breach, VOOM maintains a strict response protocol to notify affected users and regulatory authorities within the legal timeframe.</p>
                </div>
              </div>

              {/* 5. Third-Party Disclosures */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">5. Disclosure of Information</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  VOOM <strong>never</strong> sells user data. Disclosure is limited to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground/80">
                  <li>Courier partners for essential logistics.</li>
                  <li>Secure payment processors (Razorpay/Stripe).</li>
                  <li>Law enforcement authorities where required by a valid court order or legal process.</li>
                </ul>
              </div>

              {/* 6. Cookie & Tracking Policy */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">6. Cookies & Tracking</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  We use cookies to maintain session states and improve security. You may disable cookies in your browser settings, though this may restrict access to certain functionalities of our e-commerce platform.
                </p>
              </div>

              {/* 7. Data Retention & Erasure */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">7. Your Rights</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  You hold the right to request access to your data, correction of inaccuracies, or complete erasure of your personal records from our servers. To exercise these rights, submit a formal request to our Data Protection Officer.
                </p>
              </div>

              {/* Contact Footer */}
              <div className="pt-20 border-t border-white/5 text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl text-foreground m-0 uppercase tracking-widest">Legal & Privacy</h2>
                  <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto font-light italic">Direct all privacy-related enquiries to our official compliance channel.</p>
                </div>
                <div className="inline-flex flex-col gap-2">
                  <a href="mailto:info.frenzogp@gmail.com" className="text-primary font-medium hover:underline text-lg">info.frenzogp@gmail.com</a>
                  <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em] font-display">Data Protection Office</span>
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

export default PrivacyPolicy;
