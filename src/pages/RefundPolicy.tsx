import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Camera, AlertCircle, PackageX, Truck, FileCheck, Gavel } from "lucide-react";
import SEO from "@/components/SEO";

const RefundPolicy = () => {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <SEO
        title="Return & Refund Policy | VOOM Premium Car Care"
        description="The strict Return and Replacement policy of VOOM. Learn about our mandatory verification protocols and 'No Refund' framework."
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
            VOOM Care • strict Compliance
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Refund Policy
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
                  VOOM operates a strict <strong>Replacement-Only</strong> policy. Because we operate strictly on a 100% Prepaid model with <strong>NO Cash on Delivery (COD)</strong>, all completed transactions are final. No monetary refunds will be issued under any circumstances.
                </p>
              </div>

              {/* 1. Finality of Sale */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">1. Finality of Sale</h2>
                </div>
                <div className="space-y-4 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>Once an order is confirmed and payment is processed, it is final. We do not accept returns, exchanges, or cancellations for any reasons including "change of mind," "wrong product ordered," or "unmet expectations."</p>
                </div>
              </div>

              {/* 2. Mandatory Verification Protocol */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">2. Verification Protocol</h2>
                </div>
                <div className="p-8 bg-primary/5 border border-primary/10 rounded-3xl space-y-4">
                  <p className="text-sm md:text-base leading-relaxed text-foreground ">
                    "A continuous, unedited unboxing video starting from the sealed outer package is <strong>strictly mandatory</strong> for all claims. Claims submitted without this video, or with edited footage, will be rejected immediately without further review."
                  </p>
                </div>
              </div>

              {/* 3. Replacement Criteria */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">3. Replacement Criteria</h2>
                </div>
                <div className="space-y-6 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <p>Replacements are granted <strong>only</strong> for:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Major product leakage exceeding 15% of total volume.</li>
                    <li>Catastrophic container failure (cracked bottles).</li>
                    <li>Verified manufacturing defects in dispensing mechanisms (sprayers/pumps).</li>
                  </ul>
                  <p className="text-xs ">Minor surface imperfections, dented outer boxes, or label scuffs do not qualify for replacement.</p>
                </div>
              </div>

              {/* 4. Strict Reporting Timelines */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">4. Reporting Timelines</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">
                  All damage claims must be reported within <strong>48 hours</strong> of the delivery timestamp recorded by the courier. Claims made outside this window will not be entertained.
                </p>
              </div>

              {/* 5. Finality of Decision */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">5. Finality of Decision</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  VOOM reserves the absolute right to determine whether the submitted evidence meets our quality control standards for replacement. Our decision in all damage claims is final and non-negotiable.
                </p>
              </div>

              {/* Summary Note */}
              <div className="pt-20 border-t border-white/5 text-center space-y-12">
                <div className="space-y-4">
                  <PackageX className="w-10 h-10 text-primary/40 mx-auto" />
                  <h3 className="font-display text-2xl text-foreground m-0">Zero Refund Commitment</h3>
                  <p className="text-sm text-muted-foreground/60 font-light  max-w-xl mx-auto">
                    By completing a purchase on voomcare.com, you explicitly acknowledge and agree that no monetary refunds will be provided for any reason.
                  </p>
                </div>
                <div className="inline-flex flex-col gap-2">
                  <a href="mailto:info.frenzogp@gmail.com" className="text-primary font-medium hover:underline text-lg">info.frenzogp@gmail.com</a>
                  <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em] font-display">Compliance Office</span>
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

export default RefundPolicy;
