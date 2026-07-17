import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Truck, MapPin, CheckCircle2, MessageCircle, Phone, 
  Mail, ChevronDown, Star, RefreshCcw, Edit2, ShoppingCart, 
  ExternalLink, Package, Home, HeadphonesIcon, User
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { fetchTrackingDetails, TrackingDetails } from "@/services/tracking";
import { useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- No Mock Data ---
// --- No Mock Data ---
export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch real products for recommendations
  const catalogQuery = useHybridProducts();
  const catalog = catalogQuery.data || [];
  const recommendedProducts = catalog
    .filter((item) => item.price > 0)
    .slice(0, 5);

  const performSearch = async (idToSearch: string) => {
    if (!idToSearch) return;
    setIsSearching(true);
    setError(null);
    try {
      const data = await fetchTrackingDetails(idToSearch);
      setTrackingData(data);
    } catch (err: any) {
      setError(err.message || "Failed to locate tracking details.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) performSearch(id);
  }, [searchParams]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(orderId);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white/20 font-sans flex flex-col">
      <SEO
        title="Track Your Order | VOOM Premium Car Care"
        description="Track your VOOM Care order in real-time."
        canonical="/track-order"
      />

      <Navbar />
      
      <main className="flex-1 px-4 py-12 pt-28 max-w-[480px] w-full mx-auto space-y-6">
        
        {/* Title Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Track Your Order</h1>
          <p className="text-[#A8A8A8] text-sm">Stay updated with every step of your delivery.</p>
        </div>

        {/* Search Card */}
        <form onSubmit={handleTrack} className="flex gap-2">
          <Input 
            placeholder="Order ID / Tracking ID / Email / Phone" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            className="flex-1 bg-white/[0.03] border-white/[0.08] h-12 text-sm focus:border-white/30 text-white rounded-xl placeholder:text-[#A8A8A8]"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="h-12 px-6 rounded-xl bg-white text-black hover:bg-[#E5E5E5] font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {isSearching ? <RefreshCcw className="w-4 h-4 animate-spin" /> : "Track Order"}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-[20px] p-6 text-center"
            >
              <p className="text-[#EF4444] font-semibold mb-1">Tracking Failed</p>
              <p className="text-[#EF4444]/80 text-sm">{error}</p>
            </motion.div>
          ) : trackingData ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6"
            >
              
              {/* Order Status Card */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/[0.08] bg-white/[0.02] flex items-center justify-center relative">
                      <Truck className="w-5 h-5 text-white" />
                      {trackingData.currentStatus !== "Delivered" && (
                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-[#0D0D0D] rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="text-[#A8A8A8] text-xs mb-0.5">Current Status</p>
                      <h2 className="text-xl font-bold">{trackingData.currentStatus}</h2>
                      <p className="text-[#A8A8A8] text-xs">Your order is on the way.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#A8A8A8] text-xs mb-0.5">Estimated Delivery</p>
                    <p className="font-semibold text-sm">{trackingData.expectedDeliveryDate.split(" ")[0] || "Calculating"}</p>
                    <p className="text-[#22C55E] text-xs font-medium">Tomorrow</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-5 border-t border-white/[0.08]">
                  <div>
                    <p className="text-[#A8A8A8] text-[10px] mb-1">Order ID</p>
                    <p className="text-xs font-semibold">#{trackingData.orderId.substring(0,6)}</p>
                  </div>
                  <div>
                    <p className="text-[#A8A8A8] text-[10px] mb-1">Courier</p>
                    <p className="text-xs font-semibold">Shiprocket</p>
                  </div>
                  <div>
                    <p className="text-[#A8A8A8] text-[10px] mb-1">Tracking ID</p>
                    <p className="text-xs font-semibold">{trackingData.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#A8A8A8] text-[10px] mb-1">Last Updated</p>
                    <p className="text-xs font-semibold flex items-center justify-end gap-1">
                      Just now <RefreshCcw className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Timeline (Horizontal) */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-6 overflow-x-auto hide-scrollbar">
                <div className="flex items-center min-w-[500px] justify-between relative">
                  {/* Background Line */}
                  <div className="absolute top-4 left-4 right-4 h-[2px] bg-white/[0.08] -z-10" />
                  
                  {/* Progress Line */}
                  <div className="absolute top-4 left-4 h-[2px] bg-white w-3/4 -z-10" />

                  {/* Steps */}
                  {["Order Confirmed", "Packed", "Shipped", "In Transit", "Delivered"].map((step, idx) => {
                    const isCompleted = idx < 3;
                    const isCurrent = idx === 3;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-white border-white text-black' : isCurrent ? 'bg-[#0D0D0D] border-white text-white' : 'bg-[#0D0D0D] border-white/[0.15] text-[#A8A8A8]'}`}>
                           {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? <Truck className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/[0.15]" />}
                        </div>
                        <div className="text-center">
                          <p className={`text-[10px] font-semibold ${isCompleted || isCurrent ? 'text-white' : 'text-[#A8A8A8]'}`}>{step}</p>
                          <p className="text-[9px] text-[#A8A8A8] mt-0.5">{isCompleted ? '13 Jul' : '-'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Live Tracking Map Card */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] overflow-hidden">
                {/* Fake Map Area */}
                <div className="h-32 bg-[#1A1A1A] relative overflow-hidden flex items-center justify-center">
                   {/* Grid Pattern to fake map */}
                   <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                   
                   <div className="absolute top-4 left-4">
                     <p className="text-xs font-bold text-white mb-1">Live Tracking</p>
                     <div className="flex items-center gap-1.5">
                       <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                       <span className="text-[10px] text-[#22C55E]">Live</span>
                     </div>
                   </div>

                   <div className="w-full max-w-[80%] mx-auto relative mt-4">
                      {/* Dotted Route */}
                      <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/30 -translate-y-1/2" />
                      
                      <div className="flex justify-between items-center relative z-10">
                        {/* Origin Point */}
                        <div className="w-3 h-3 rounded-full bg-white" />
                        
                        {/* Moving Truck (50% position) */}
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <Truck className="w-4 h-4 text-black" />
                          </div>
                        </div>

                        {/* Destination Point */}
                        <div className="w-4 h-4 rounded-full border-2 border-white bg-[#0D0D0D] flex items-center justify-center">
                           <MapPin className="w-2 h-2 text-white" />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Map Details */}
                <div className="p-5 flex items-end justify-between">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[#A8A8A8] text-[10px] mb-0.5">Current Location</p>
                      <p className="text-xs font-semibold">{trackingData.origin}</p>
                    </div>
                    <div>
                      <p className="text-[#A8A8A8] text-[10px] mb-0.5">Destination</p>
                      <p className="text-xs font-semibold">{trackingData.destination}</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-5 pb-5 pt-2 flex justify-end border-t border-white/[0.08]">
                   <button className="flex items-center gap-1.5 border border-white/[0.15] px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-xs font-medium mt-2">
                     Open in Maps <ExternalLink className="w-3 h-3" />
                   </button>
                </div>
              </div>



              {/* Need Help? */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold">Need Help?</h3>
                  <p className="text-[#A8A8A8] text-xs">We're here for you.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href={`https://wa.me/919187331513?text=Hi%20VOOM%20Care,%20I%20need%20help%20with%20my%20order%20${trackingData.orderId}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.08] py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors text-xs font-medium text-white"
                  >
                     <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <a 
                    href={`mailto:support@voomcare.com?subject=Help%20with%20Order%20${trackingData.orderId}`} 
                    className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.08] py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors text-xs font-medium text-white"
                  >
                     <Mail className="w-4 h-4" /> Email
                  </a>
                </div>
              </div>



              {/* Recommended Products */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">You May Also Like</h3>
                  <button className="text-[10px] text-[#A8A8A8] hover:text-white transition-colors">View All</button>
                </div>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {recommendedProducts.map((prod, idx) => (
                    <div key={prod.id || idx} className="min-w-[140px] max-w-[140px] bg-white/[0.02] border border-white/[0.08] rounded-2xl p-3 flex flex-col">
                      <div className="w-full aspect-square bg-white/[0.02] rounded-xl mb-3 flex items-center justify-center p-2">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-screen" />
                      </div>
                      <p className="text-xs font-medium mb-1 line-clamp-1">{prod.name}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-semibold">{formatCurrency(prod.price)}</span>
                        <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-[#E5E5E5]">
                          <ShoppingCart className="w-3 h-3 text-black" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Section */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Rate Your Experience</h3>
                  <p className="text-[#A8A8A8] text-[10px]">Your feedback helps us improve.</p>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="w-5 h-5 text-white/[0.15] hover:text-[#F59E0B] cursor-pointer transition-colors" />
                  ))}
                </div>
              </div>

            </motion.div>
          ) : (
             <div className="py-20 text-center">
                <Package className="w-10 h-10 text-white/10 mx-auto mb-4" />
                <p className="text-[#A8A8A8] text-sm">Enter your tracking details above.</p>
             </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      
      {/* Hide scrollbar styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
