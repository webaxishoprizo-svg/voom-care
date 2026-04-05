import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

const TrackOrder = () => (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl text-foreground mb-4">Track Your Order</h1>
          <p className="text-muted-foreground mb-8">
            Enter your order ID to check the current status of your delivery.
          </p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Enter Order ID (e.g. NOR-12345)" className="bg-card border-border text-center" />
            <Button className="w-full">Track Order</Button>
          </form>
        </motion.div>
      </div>
    </section>
    <Footer />
  </main>
);

export default TrackOrder;
