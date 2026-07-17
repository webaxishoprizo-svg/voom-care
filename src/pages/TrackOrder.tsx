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

// --- Mock Data for UI Completeness ---
const FAQ_ITEMS = [
  { q: "Where is my order?", a: "Your order is currently in transit. Check the live tracking map above for real-time updates." },
  { q: "How long does delivery take?", a: "Standard delivery takes 3-5 business days depending on your location." },
  { q: "Can I change my delivery address?", a: "Address changes can only be made before the order is packed. Please contact support." },
  { q: "How do I contact support?", a: "You can reach us via WhatsApp, phone, or email using the buttons above." },
];

const RECOMMENDED_PRODUCTS = [
  { name: "Tyre Polish", price: "₹149", image: "https://voomcare.com/cdn/shop/files/tyre_1.png" },
  { name: "Car Shampoo", price: "₹149", image: "https://voomcare.com/cdn/shop/files/shampoo.png" },
  { name: "Dash Cleaner", price: "₹149", image: "https://voomcare.com/cdn/shop/files/dash.png" },
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
    <main className="min-h-screen bg-[#0D0D0D] text-white selection:bg-white/20 pb-24 font-sans">
      <SEO
        title="Track Your Order | VOOM Premium Car Care"
        description="Track your VOOM Care order in real-time."
        canonical="/track-order"
      />

      {/* Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] sticky top-0 bg-[#0D0D0D]/80 backdrop-blur-md z-50">
        <div className="w-8" /> {/* Spacer */}
        <img src="https://voomcare.com/cdn/shop/files/VOOM_LOGO_Design_White_6c0032e2-cb9f-4318-ae38-3ddf2eb89b2f.png" alt="VOOM" className="h-4 object-contain" />
        <button className="w-8 h-8 flex items-center justify-end">
          <ShoppingCart className="w-5 h-5 text-white" />
        </button>
      </header>
      
      <div className="px-4 py-8 max-w-[480px] mx-auto space-y-6">
        
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
          <Button 
            disabled={isSearching}
            className="h-12 px-6 rounded-xl bg-white text-black hover:bg-[#E5E5E5] font-semibold text-sm transition-all"
          >
            {isSearching ? <RefreshCcw className="w-4 h-4 animate-spin" /> : "Track Order"}
          </Button>
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
                
                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-white/[0.08]">
                   <div className="flex gap-6">
                    <div>
                      <p className="text-[#A8A8A8] text-[10px] mb-0.5">Distance Remaining</p>
                      <p className="text-xs font-semibold">86 km</p>
                    </div>
                    <div>
                      <p className="text-[#A8A8A8] text-[10px] mb-0.5">Estimated Arrival</p>
                      <p className="text-xs font-semibold">18 Jul 2026 • 11:00 AM</p>
                    </div>
                   </div>
                   <button className="flex items-center gap-1.5 border border-white/[0.15] px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-xs font-medium">
                     Open in Maps <ExternalLink className="w-3 h-3" />
                   </button>
                </div>
              </div>

              {/* Product Card */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-4 flex items-center gap-4">
                <div className="w-20 h-20 bg-white/[0.02] rounded-xl overflow-hidden border border-white/[0.05] flex items-center justify-center">
                  <img src="https://voomcare.com/cdn/shop/files/Combo_VOOM_Black_Background.png" alt="Combo VOOM" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-sm">Combo VOOM</h3>
                    <span className="font-semibold text-sm">₹349</span>
                  </div>
                  <p className="text-[10px] text-[#A8A8A8] mb-2 line-clamp-1">Car Shampoo • Tyre Polish • Dash Cleaner</p>
                  <p className="text-[10px] text-white">Qty: 1</p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#E5E5E5] transition-colors">
                  Buy Again
                </button>
              </div>

              {/* Delivery Details */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-6 relative">
                <button className="absolute top-6 right-6 text-[#A8A8A8] hover:text-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-semibold mb-5">Delivery Details</h3>
                
                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                  <div>
                    <p className="text-[#A8A8A8] text-[10px] mb-1">Recipient</p>
                    <p className="text-xs font-medium">Mubashir CH</p>
                  </div>
                  <div>
                    <p className="text-[#A8A8A8] text-[10px] mb-1">Address</p>
                    <p className="text-xs font-medium leading-tight">Kanhangad, Kasaragod,<br/>Kerala - 671315</p>
                  </div>
                  <div>
                    <p className="text-[#A8A8A8] text-[10px] mb-1">Phone</p>
                    <p className="text-xs font-medium">+91 6238 123 456</p>
                  </div>
                  <div>
                    <p className="text-[#A8A8A8] text-[10px] mb-1">Payment Method</p>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm">COD</span>
                      <span className="text-xs font-medium">Cash on Delivery</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help? */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold">Need Help?</h3>
                  <p className="text-[#A8A8A8] text-xs">We're here for you.</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.08] py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors text-xs font-medium">
                     <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.08] py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors text-xs font-medium">
                     <Phone className="w-4 h-4" /> Call
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.08] py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors text-xs font-medium">
                     <Mail className="w-4 h-4" /> Email
                  </button>
                </div>
              </div>

              {/* FAQ Accordion */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] overflow-hidden">
                <div className="p-5 pb-2">
                  <h3 className="text-sm font-semibold">Frequently Asked Questions</h3>
                </div>
                {FAQ_ITEMS.map((faq, idx) => (
                  <div key={idx} className="border-t border-white/[0.05]">
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-xs font-medium text-[#A8A8A8]">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-[#A8A8A8] transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-5 pb-5 text-xs text-white/60 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommended Products */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">You May Also Like</h3>
                  <button className="text-[10px] text-[#A8A8A8] hover:text-white transition-colors">View All</button>
                </div>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {RECOMMENDED_PRODUCTS.map((prod, idx) => (
                    <div key={idx} className="min-w-[140px] bg-white/[0.02] border border-white/[0.08] rounded-2xl p-3 flex flex-col">
                      <div className="w-full aspect-square bg-[#111] rounded-xl mb-3 flex items-center justify-center p-2">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-screen" />
                      </div>
                      <p className="text-xs font-medium mb-1 line-clamp-1">{prod.name}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-semibold">{prod.price}</span>
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
      </div>

      {/* Bottom Fixed Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D]/90 backdrop-blur-xl border-t border-white/[0.08] pb-safe pt-2 px-6 flex justify-between items-center z-50 md:hidden">
        <button className="flex flex-col items-center gap-1 p-2 text-[#A8A8A8] hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-white">
          <Package className="w-5 h-5" />
          <span className="text-[9px] font-medium">Orders</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[#A8A8A8] hover:text-white transition-colors">
          <HeadphonesIcon className="w-5 h-5" />
          <span className="text-[9px] font-medium">Support</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 text-[#A8A8A8] hover:text-white transition-colors">
          <User className="w-5 h-5" />
          <span className="text-[9px] font-medium">Account</span>
        </button>
      </nav>
      
      {/* Hide scrollbar styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
