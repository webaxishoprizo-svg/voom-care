import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Truck, MapPin, CheckCircle2, MessageCircle, Phone, 
  Mail, ChevronDown, Star, RefreshCcw, Edit2, ShoppingCart, 
  ExternalLink, Package, Home, HeadphonesIcon, User
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { fetchTrackingDetails, TrackingDetails } from "@/services/tracking";
import { useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandReviewForm from "@/components/reviews/BrandReviewForm";

const FAQItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-xs font-medium text-white/90">{q}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-[11px] text-[#A8A8A8] leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- No Mock Data ---
// --- No Mock Data ---
export default function TrackOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [showDetailedTracking, setShowDetailedTracking] = useState(false);

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
      setError(err.message || "Could not find tracking details");
    } finally {
      setIsSearching(false);
    }
  };

  const getProgressPercentage = () => {
    if (!trackingData) return 0;
    const status = trackingData.currentStatus?.toLowerCase() || "";
    if (status.includes("delivered") || status.includes("success")) return 100;
    if (status.includes("out for delivery")) return 90;
    if (status.includes("transit") || status.includes("shipped")) return 60;
    if (status.includes("picked") || status.includes("packed")) return 30;
    return 10; // default for confirmed
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
                    <p className="font-semibold text-sm">
                      {trackingData.expectedDeliveryDate && trackingData.expectedDeliveryDate !== "Calculating..." 
                        ? new Date(trackingData.expectedDeliveryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
                        : "Pending"}
                    </p>
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
                <div className="flex items-center min-w-min gap-12 justify-between relative px-2">
                  {/* Background Line */}
                  <div className="absolute top-4 left-4 right-4 h-[2px] bg-white/[0.08] -z-10" />
                  
                  {/* Progress Line */}
                  <div className="absolute top-4 left-4 h-[2px] bg-white -z-10" style={{ width: trackingData.activities.length > 1 ? '100%' : '0%' }} />

                  {/* Steps */}
                  {trackingData.activities.length === 0 ? (
                     <p className="text-xs text-muted-foreground">No tracking updates yet.</p>
                  ) : (
                    [...trackingData.activities].reverse().map((activity, idx, arr) => {
                      const isCurrent = idx === arr.length - 1;
                      const isCompleted = idx < arr.length - 1;
                      
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 min-w-[80px]">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-white border-white text-black' : isCurrent ? 'bg-[#0D0D0D] border-white text-white' : 'bg-[#0D0D0D] border-white/[0.15] text-[#A8A8A8]'}`}>
                             {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                          </div>
                          <div className="text-center">
                            <p className={`text-[10px] font-semibold ${isCompleted || isCurrent ? 'text-white' : 'text-[#A8A8A8]'} line-clamp-2 leading-tight px-1`}>{activity.activity}</p>
                            <p className="text-[9px] text-[#A8A8A8] mt-0.5 whitespace-nowrap">
                              {new Date(activity.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Flipkart Style Detailed Tracking Expansion */}
                {trackingData.activities.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/[0.08]">
                    <button 
                      onClick={() => setShowDetailedTracking(!showDetailedTracking)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs text-[#22C55E] font-medium hover:text-[#22C55E]/80 transition-colors"
                    >
                      {showDetailedTracking ? 'Hide Details' : 'View Detailed Tracking'}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showDetailedTracking ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {showDetailedTracking && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 pb-2 px-1">
                            {trackingData.activities.map((activity, idx, arr) => (
                              <div key={idx} className="flex gap-4 relative mb-6 last:mb-0">
                                {/* Vertical Connecting Line */}
                                {idx !== arr.length - 1 && (
                                  <div className="absolute top-[14px] bottom-[-24px] left-[6px] w-[2px] bg-[#22C55E]" />
                                )}
                                {/* Dot */}
                                <div className="relative z-10 mt-1 shrink-0">
                                  <div className="w-3.5 h-3.5 rounded-full bg-[#22C55E] ring-4 ring-[#151515]" />
                                </div>
                                {/* Content */}
                                <div>
                                  <p className="text-xs font-semibold text-white">{activity.activity}</p>
                                  {activity.location && (
                                    <p className="text-[10px] text-[#A8A8A8] mt-0.5">{activity.location}</p>
                                  )}
                                  <p className="text-[10px] text-[#A8A8A8] mt-0.5">
                                    {new Date(activity.date).toLocaleString("en-IN", { 
                                      month: 'short', day: 'numeric', year: 'numeric', 
                                      hour: 'numeric', minute: '2-digit', hour12: true 
                                    })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
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
                      
                      {/* Filled Route Progress */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage()}%` }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                        className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0" 
                      />
                      
                      <div className="flex justify-between items-center relative z-10">
                        {/* Origin Point */}
                        <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-[#1A1A1A]" />
                        
                        {/* Moving Truck */}
                        <motion.div 
                          initial={{ left: 0 }}
                          animate={{ left: `${getProgressPercentage()}%` }}
                          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2"
                        >
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-4 ring-[#1A1A1A]">
                            <Truck className="w-4 h-4 text-black" />
                          </div>
                        </motion.div>

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
                   <a 
                     href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(trackingData.origin || "")}&destination=${encodeURIComponent(trackingData.destination || "")}`}
                     target="_blank"
                     rel="noreferrer"
                     className="flex items-center gap-1.5 border border-white/[0.15] px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-xs font-medium mt-2"
                   >
                     Open in Maps <ExternalLink className="w-3 h-3" />
                   </a>
                </div>
              </div>

              {/* Buy Again (Products) */}
              {trackingData.products && trackingData.products.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-4 space-y-4">
                  {trackingData.products.map((prod, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.05] rounded-xl flex items-center justify-center p-2 shrink-0">
                         {prod.sku ? <Package className="w-6 h-6 text-white/40" /> : <Package className="w-6 h-6 text-white/40" />}
                       </div>
                       <div className="flex-1 min-w-0">
                         <h3 className="font-semibold text-xs text-white truncate">{prod.name}</h3>
                         <p className="text-[10px] text-[#A8A8A8] mt-1">Qty: {prod.quantity}</p>
                       </div>
                       <div className="text-right flex flex-col items-end gap-2 shrink-0">
                         <span className="font-semibold text-xs">₹{prod.price}</span>
                         <button className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-bold hover:bg-[#E5E5E5] transition-colors">
                           Buy Again
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Delivery Details */}
              {trackingData.deliveryDetails && (
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-5">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-semibold">Delivery Details</h3>
                     <Edit2 className="w-3.5 h-3.5 text-[#A8A8A8] cursor-pointer hover:text-white transition-colors" />
                   </div>
                   <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-xs">
                     <div>
                       <p className="text-[#A8A8A8] text-[10px] mb-1">Recipient</p>
                       <p className="font-medium">{trackingData.deliveryDetails.recipient}</p>
                     </div>
                     <div>
                       <p className="text-[#A8A8A8] text-[10px] mb-1">Address</p>
                       <p className="font-medium text-[11px] leading-tight">{trackingData.deliveryDetails.address}</p>
                     </div>
                     <div>
                       <p className="text-[#A8A8A8] text-[10px] mb-1">Phone</p>
                       <p className="font-medium">{trackingData.deliveryDetails.phone}</p>
                     </div>
                     <div>
                       <p className="text-[#A8A8A8] text-[10px] mb-1">Payment Method</p>
                       <p className="font-medium flex items-center gap-1 mt-0.5">
                         <span className="bg-white/10 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider">{trackingData.deliveryDetails.paymentMethod}</span>
                       </p>
                     </div>
                   </div>
                </div>
              )}



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
                    className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.08] py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors text-xs font-medium text-white flex-1"
                  >
                     <Mail className="w-4 h-4" /> Email Support
                  </a>
                </div>
              </div>

              {/* Frequently Asked Questions */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold mb-3 px-1">Frequently Asked Questions</h3>
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] overflow-hidden divide-y divide-white/[0.08]">
                  <FAQItem q="Where is my order?" a="You can track the live status of your order directly on this page using your tracking ID or order number." />
                  <FAQItem q="How long does delivery take?" a="Standard delivery usually takes 3-5 business days depending on your location." />
                  <FAQItem q="Can I change my delivery address?" a="Address changes are only possible before the order is shipped. Contact support immediately." />
                  <FAQItem q="How do I contact support?" a="You can tap the WhatsApp or Email buttons above to instantly reach our support team." />
                </div>
              </div>



              {/* Recommended Products */}
              {recommendedProducts.length > 0 && (
                <div className="pt-6 border-t border-white/[0.08] mt-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#A8A8A8] text-center mb-1">
                    You May Also Like
                  </p>
                  <h2 className="font-display text-2xl text-foreground text-center mb-6">
                    Recommended
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {recommendedProducts.map((prod, index) => (
                      <motion.div
                        key={prod.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          navigate(`/product/${prod.id}`);
                          window.scrollTo(0, 0);
                        }}
                        className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all flex flex-col"
                      >
                        <div className="aspect-square overflow-hidden bg-white/[0.02]">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover mix-blend-screen group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-3 md:p-4 flex flex-col flex-1">
                          <h3 className="font-display text-sm md:text-base text-foreground line-clamp-2">
                            {prod.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-auto pt-2">
                            <span className="text-primary font-semibold text-sm">
                              {formatCurrency(prod.price, prod.currencyCode)}
                            </span>
                            {prod.originalPrice && (
                              <span className="text-muted-foreground text-[10px] md:text-xs line-through">
                                {formatCurrency(prod.originalPrice, prod.currencyCode)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Section */}
              <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Love VOOM? Rate us!</h3>
                  <p className="text-[#A8A8A8] text-[10px]">Your feedback builds our brand.</p>
                </div>
                <div className="flex gap-1" onClick={() => setReviewFormOpen(true)}>
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
        
        <BrandReviewForm open={reviewFormOpen} onOpenChange={setReviewFormOpen} />
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
