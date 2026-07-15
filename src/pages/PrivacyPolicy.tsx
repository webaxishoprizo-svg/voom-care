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
                <p className="text-muted-foreground leading-relaxed text-lg font-light ">
                  VOOM ("we," "us," or "our") is deeply committed to protecting your personal information and respecting your privacy. We operate this storefront to provide a curated shopping experience, powered by a headless architecture integrating with Shopify. This Privacy Policy outlines our comprehensive protocols for data collection, usage, and security, ensuring full compliance with the Information Technology Act, 2000, the Digital Personal Data Protection Act (DPDP) of India, and global best practices.
                </p>
              </div>

              {/* 1. Information We Collect */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">1. Information We Collect</h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>To provide you with a premium shopping experience, we collect specific types of data:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Personal Identity Data:</strong> First name, last name, username or similar identifier, title, and date of birth.</li>
                    <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                    <li><strong>Financial & Transaction Data:</strong> Bank account and payment card details (processed securely by our payment gateways; we do not store full card numbers on our servers), details about payments to and from you, and other details of products you have purchased from us.</li>
                    <li><strong>Technical Data:</strong> Internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                    <li><strong>Usage & Profile Data:</strong> Information about how you use our website, products, and services, your purchases or orders, your interests, preferences, feedback, and survey responses.</li>
                  </ul>
                </div>
              </div>

              {/* 2. How We Collect Your Data */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">2. How We Collect Your Data</h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>We use different methods to collect data from and about you including through:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Direct Interactions:</strong> You may give us your Identity, Contact and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise.</li>
                    <li><strong>Automated Technologies:</strong> As you interact with our website, we may automatically collect Technical Data about your equipment, browsing actions and patterns using cookies, server logs and other similar technologies.</li>
                    <li><strong>Third Parties or Publicly Available Sources:</strong> We may receive personal data about you from various third parties such as analytics providers (like Google), advertising networks, and secure payment and delivery services.</li>
                  </ul>
                </div>
              </div>

              {/* 3. How We Use Your Data */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">3. How We Use Your Data</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground/80">
                  <li><strong>Contract Performance:</strong> Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling your order and shipping products).</li>
                  <li><strong>Legitimate Interests:</strong> Where it is necessary for our legitimate interests (e.g., fraud prevention, network security, and improving our products/services) and your interests and fundamental rights do not override those interests.</li>
                  <li><strong>Legal Compliance:</strong> Where we need to comply with a legal or regulatory obligation.</li>
                </ul>
              </div>

              {/* 4. Disclosure of Your Personal Data */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">4. Disclosure of Your Data</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  VOOM <strong>never</strong> sells your personal data. However, we may share your data with strictly vetted third parties for the following purposes:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground/80">
                  <li><strong>Shopify & E-Commerce Infrastructure:</strong> Because our store is powered by Shopify, information you submit is transmitted to and shared with Shopify (and their sub-processors) to process payments, fulfill orders, and provide enhanced security and fraud prevention.</li>
                  <li><strong>Service Providers:</strong> Logistics and courier partners (to deliver your products), IT and system administration service providers, and secure payment processors.</li>
                  <li><strong>Professional Advisers:</strong> Lawyers, bankers, auditors, and insurers who provide consultancy, banking, legal, insurance, and accounting services.</li>
                  <li><strong>Regulatory Authorities:</strong> Law enforcement, government regulators, or other authorities based in India who require reporting of processing activities in certain circumstances.</li>
                </ul>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  We require all third parties to respect the security of your personal data and to treat it in accordance with the law. To learn more about how Shopify uses your personal information, you can visit the <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noreferrer" className="text-primary hover:underline">Shopify Consumer Privacy Policy</a>.
                </p>
              </div>

              {/* 5. Data Security */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">5. Data Security</h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>We have implemented state-of-the-art security measures, including 256-bit SSL encryption, secure server hosting, and strict access controls, to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.</p>
                  <p>We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a strict duty of confidentiality.</p>
                </div>
              </div>

              {/* 6. Data Retention */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">6. Data Retention</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements. By law, we have to keep basic information about our customers (including Contact, Identity, Financial, and Transaction Data) for a specified period for tax and legal purposes.
                </p>
              </div>

              {/* 7. Your Legal Rights */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">7. Your Legal Rights</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  Under the applicable data protection laws, you have specific rights concerning your personal data:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground/80">
                  <li><strong>Request Access:</strong> Receive a copy of the personal data we hold about you.</li>
                  <li><strong>Request Correction:</strong> Have any incomplete or inaccurate data we hold about you corrected.</li>
                  <li><strong>Request Erasure:</strong> Ask us to delete or remove personal data where there is no good reason for us continuing to process it (Right to be Forgotten).</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where we are relying on consent to process your personal data.</li>
                </ul>
              </div>

              {/* 8. Children's Data */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">8. Children's Data</h2>
                </div>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  The Services are not intended to be used by children, and we do not knowingly collect any personal information about children under the age of majority in your jurisdiction. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details below to request that it be deleted.
                </p>
              </div>

              {/* Contact Footer */}
              <div className="pt-20 border-t border-white/5 text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl text-foreground m-0 uppercase tracking-widest">Grievance & Privacy Contact</h2>
                  <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto font-light ">To exercise any of your rights, or for inquiries regarding this privacy policy, please contact our Grievance Officer.</p>
                </div>
                <div className="inline-flex flex-col gap-3">
                  <a href="mailto:support@voomcare.com" className="text-primary font-medium hover:underline text-lg">support@voomcare.com</a>
                  <a href="tel:+919187331513" className="text-foreground/80 hover:text-foreground text-sm">+91 91 8733 1513</a>
                  <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto mt-2">
                    R SQUARE - COMMERCIAL BUILDING<br />
                    National Highway 66, Voom<br />
                    673021 Kozhikode KL, India
                  </p>
                  <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em] font-display mt-4">Data Protection Office</span>
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
