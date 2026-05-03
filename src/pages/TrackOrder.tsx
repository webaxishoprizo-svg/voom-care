import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle2, Search, MapPin, Clock, ArrowRight, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";

const trackingSteps = [
  { status: "Order Confirmed", date: "May 01, 2026", time: "10:30 AM", desc: "Your order has been received and is being processed.", completed: true, current: false },
  { status: "Processing", date: "May 02, 2026", time: "02:15 PM", desc: "Quality check and premium packaging in progress.", completed: true, current: true },
  { status: "Shipped", date: "Pending", time: "-", desc: "Your package will be handed over to our courier partner shortly.", completed: false, current: false },
  { status: "Out for Delivery", date: "Pending", time: "-", desc: "The courier is on the way to your location.", completed: false, current: false },
  { status: "Delivered", date: "Pending", time: "-", desc: "Successfully delivered to your doorstep.", completed: false, current: false },
];

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setIsSearching(true);
    // Mocking search delay
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SEO 
        title="Track Your Order | VOOM Premium Car Care"
        description="Track your VOOM order in real-time. Follow your premium car care essentials from our studio to your doorstep."
      />
      <Navbar />
      
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary text-[11px] font-bold tracking-[0.3em] uppercase mb-4 block">
                Order Tracking
              </span>
              <h1 className="font-display text-4xl md:text-6xl text-white mb-6 italic">
                Track Your Shipment
              </h1>
              <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Stay updated on your VOOM order. Enter your order number or tracking ID to see its current status.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-12">
            {/* Search Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
              
              <form onSubmit={handleTrack} className="relative z-10">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30">
                      <Search className="w-5 h-5" />
                    </div>
                    <Input 
                      placeholder="Order Number (e.g. #VOOM-1024)" 
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 h-14 pl-14 pr-6 focus:border-primary/50 text-white rounded-2xl transition-all placeholder:text-white/20"
                    />
                  </div>
                  <Button 
                    disabled={isSearching}
                    className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-white/90 font-bold tracking-widest uppercase text-[11px] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Locating...
                      </div>
                    ) : (
                      "Track Order"
                    )}
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-6">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    Tracking available for all India orders
                  </p>
                </div>
              </form>
            </motion.div>

            {/* Results Section */}
            <AnimatePresence mode="wait">
              {showResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                  {/* Summary Bar */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                      <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">Order ID</p>
                      <p className="text-lg font-semibold text-white">{orderId.startsWith('#') ? orderId : `#${orderId}`}</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                      <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-2">Expected By</p>
                      <p className="text-lg font-semibold text-white">May 06, 2026</p>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                      <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2">Current Status</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-lg font-semibold text-primary">In Processing</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Card */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden">
                    <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <h3 className="font-display text-2xl text-white italic">Journey Timeline</h3>
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Kochi Hub, Kerala</span>
                      </div>
                    </div>
                    
                    <div className="p-8 md:p-10">
                      <div className="space-y-0 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-5 top-5 bottom-5 w-px bg-white/10" />
                        
                        {trackingSteps.map((step, idx) => (
                          <div key={idx} className="relative pl-14 pb-12 last:pb-0 group">
                            {/* Marker */}
                            <div className={`absolute left-0 top-1.5 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                              step.completed 
                                ? 'bg-primary shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                                : step.current 
                                  ? 'bg-background border-2 border-primary' 
                                  : 'bg-background border-2 border-white/10'
                            }`}>
                              {step.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-black" />
                              ) : (
                                <div className={`w-2.5 h-2.5 rounded-full ${step.current ? 'bg-primary animate-pulse' : 'bg-white/10'}`} />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                              <div>
                                <h4 className={`text-lg font-semibold transition-colors duration-500 ${step.completed || step.current ? 'text-white' : 'text-white/30'}`}>
                                  {step.status}
                                </h4>
                                <p className={`text-sm mt-1 max-w-md leading-relaxed transition-colors duration-500 ${step.completed || step.current ? 'text-white/60' : 'text-white/20'}`}>
                                  {step.desc}
                                </p>
                              </div>
                              <div className="shrink-0 text-right md:pt-1">
                                <p className={`text-xs font-bold tracking-tighter ${step.completed || step.current ? 'text-primary' : 'text-white/20'}`}>
                                  {step.date}
                                </p>
                                <p className="text-[10px] text-white/30 font-medium uppercase mt-0.5">{step.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-white">Need Help?</p>
                          <p className="text-[11px] text-white/40">Chat with our support team</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                    </button>
                    <button className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-white">Call Us</p>
                          <p className="text-[11px] text-white/40">Speak with an agent directly</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    Waiting for order details
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
};

export default TrackOrder;
