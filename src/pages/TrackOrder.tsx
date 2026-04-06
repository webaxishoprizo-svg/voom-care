import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { SHOPIFY_ACCOUNT_URL } from "@/lib/shopify/client";

const TrackOrder = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl text-foreground mb-4 text-center">
              Track Your Order
            </h1>
            <p className="text-muted-foreground mb-10 text-center">
              Order tracking is handled on Shopify&apos;s official customer account page.
            </p>

            <div className="rounded-3xl border border-border bg-card/80 p-8 text-center">
              <p className="text-foreground font-medium mb-3">
                Open your Shopify account to review order status, shipping progress, and past purchases.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                If you&apos;re not signed in yet, Shopify will first show its official login page.
              </p>
              <Button asChild className="rounded-full px-8">
                <a href={SHOPIFY_ACCOUNT_URL}>Open Shopify Account</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default TrackOrder;
