import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Truck, Clock, ShieldCheck, CreditCard, Package, Info, MapPin, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";

const ShippingPolicy = () => {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <SEO
        title="Shipping Policy | VOOM Premium Car Care"
        description="Official Shipping Policy of VOOM. Review our strict delivery protocols, liability disclaimers, and logistics framework."
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
            VOOM Care • Logistics & Liability
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-6"
          >
            Shipping Policy
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
                  VOOM utilizes professional-grade logistics for all domestic shipments. By placing an order, you agree to our delivery protocols and liability disclaimers.
                </p>
              </div>

              {/* 1. Fulfillment Timelines */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">1. Fulfillment Timelines</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 text-muted-foreground/80 font-light leading-relaxed text-sm">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2">Processing Protocol</h4>
                    <p>Orders are dispatched within 24-48 business hours of payment verification. Dispatch may be delayed during peak demand or national holidays.</p>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2">Transit Estimates</h4>
                    <p>Standard delivery takes 5-9 business days. These are estimates, not guarantees. VOOM disclaims liability for delays caused by third-party couriers.</p>
                  </div>
                </div>
              </div>

              {/* 2. Strict Payment & COD Policy */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">2. No Cash on Delivery (COD)</h2>
                </div>
                <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-3xl space-y-4">
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    VOOM strictly operates on a 100% prepaid model to ensure faster processing and prevent logistical fraud. <strong>We do NOT provide Cash on Delivery (COD) services under any circumstances.</strong> All orders must be fully paid upfront through our secure payment gateway before they are dispatched.
                  </p>
                </div>
              </div>

              {/* 3. Risk of Loss & Liability */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">2. Risk of Loss</h2>
                </div>
                <div className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
                  <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                    Title and risk of loss for all products pass to the customer upon delivery of the items to the carrier. VOOM is not responsible for lost or stolen packages once they have been marked as "Delivered" by the courier partner.
                  </p>
                </div>
              </div>

              {/* 4. Address Accuracy & Non-Delivery */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">4. Delivery Accuracy</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  The customer holds sole responsibility for providing accurate delivery data. In cases of failed delivery due to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground/60 ">
                  <li>Incorrect or incomplete addresses.</li>
                  <li>Recipient unavailability during multiple delivery attempts.</li>
                  <li>Refusal of the shipment upon arrival.</li>
                </ul>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  The shipment will be returned to origin. Re-shipping costs will be borne exclusively by the customer.
                </p>
              </div>

              {/* 5. Domestic Only Policy */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-2xl text-foreground m-0">5. Regional Restrictions</h2>
                </div>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                  VOOM currently offers shipping services strictly within India. We do not provide international shipping or delivery to restricted zones (e.g., military bases) without prior authorization.
                </p>
              </div>

              {/* Important Disclaimer */}
              <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl space-y-4">
                <div className="flex items-center gap-3 text-amber-500">
                  <Info className="w-5 h-5" />
                  <h3 className="font-display uppercase tracking-widest text-[10px] m-0 font-bold">Unboxing Requirement</h3>
                </div>
                <p className="text-xs text-muted-foreground/80 font-light leading-relaxed ">
                  Reminder: All claims for transit damage must be supported by a continuous unboxing video. Refer to our Refund Policy for strict submission criteria.
                </p>
              </div>

              {/* Support Footer */}
              <div className="pt-20 border-t border-white/5 text-center space-y-8">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl text-foreground m-0 uppercase tracking-widest">Logistics</h2>
                  <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto font-light ">Managing the flow of professional care products.</p>
                </div>
                <div className="inline-flex flex-col gap-2">
                  <a href="mailto:support@voomcare.com" className="text-primary font-medium hover:underline text-lg">support@voomcare.com</a>
                  <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em] font-display">Logistics Division</span>
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

export default ShippingPolicy;
