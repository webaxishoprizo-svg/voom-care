import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { fetchCustomerOrders, type CustomerOrder } from "@/lib/shopify/customer-account";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/ScrollReveal";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  Tag, 
  CreditCard, 
  Ship, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const { customerAccessToken, isLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (!isLoading && !token) {
      navigate("/login");
    }
  }, [isLoading, navigate]);

  useEffect(() => {
    const getOrders = async () => {
      if (!customerAccessToken) return;
      try {
        const orderData = await fetchCustomerOrders(customerAccessToken);
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (customerAccessToken) {
      getOrders();
    }
  }, [customerAccessToken]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'fulfilled': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'unfulfilled': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-primary selection:text-black">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-12 relative">
         <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          <Reveal>
            <div className="mb-16 space-y-10">
              <Link 
                to="/account" 
                className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-black text-white/40 hover:text-primary transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-500">
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-500" />
                </div>
                Dashboard
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                     <Clock className="h-3 w-3 text-primary" />
                     <span className="text-[9px] text-primary uppercase tracking-[0.2em] font-bold">Purchase Archive</span>
                  </div>
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display tracking-tightest uppercase leading-none italic">
                    Voyages
                  </h1>
                </div>
                <div className="max-w-sm space-y-4 border-l border-white/10 pl-8 hidden md:block">
                  <p className="text-sm text-white/40 font-light leading-relaxed">
                    Every fragrance tells a story. Access your complete collection history and monitor the status of your current acquisitions.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            {isFetching ? (
              <div className="py-40 text-center bg-white/[0.02] border border-white/5 rounded-[3rem] backdrop-blur-xl">
                <div className="relative w-16 h-16 mx-auto mb-10">
                  <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                </div>
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/20 animate-pulse italic">Accessing Records</p>
              </div>
            ) : orders.length === 0 ? (
              <Reveal delay={0.1}>
                <div className="text-center py-40 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-10 relative overflow-hidden">
                  <div className="relative z-10 space-y-8">
                    <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-white/10 border border-white/5">
                      <Package className="h-12 w-12" />
                    </div>
                    <div className="space-y-3">
                       <p className="text-3xl font-display uppercase tracking-tighter">No Active Records</p>
                       <p className="text-sm text-white/30 font-light max-w-xs mx-auto italic">Your olfactory library is currently empty. Begin your first voyage today.</p>
                    </div>
                    <Link to="/products" className="inline-flex h-14 items-center px-10 bg-primary text-black rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                      Explore Collection
                    </Link>
                  </div>
                  <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                </div>
              </Reveal>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order, index) => (
                  <Reveal key={order.name} delay={index * 0.1}>
                    <div className="group bg-white/[0.03] border border-white/10 p-8 lg:p-12 rounded-[3rem] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-700 relative overflow-hidden">
                      
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-grow">
                          {/* Order ID */}
                          <div className="space-y-3">
                            <p className="text-[9px] uppercase tracking-widest font-black text-white/20">Record ID</p>
                            <div className="flex items-center gap-2">
                               <span className="text-2xl font-display tracking-tight group-hover:text-primary transition-colors duration-500">#{order.name}</span>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="space-y-3">
                            <p className="text-[9px] uppercase tracking-widest font-black text-white/20">Deployment</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-white/30" />
                              <span className="text-sm font-medium tracking-tight">
                                {new Date(order.processedAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="space-y-3">
                            <p className="text-[9px] uppercase tracking-widest font-black text-white/20">Current Phase</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className={`text-[8px] px-2.5 py-1 rounded-lg uppercase font-black tracking-widest border-0 ${getStatusColor(order.fulfillmentStatus)}`}>
                                {order.fulfillmentStatus || 'Pending'}
                              </Badge>
                              <Badge variant="outline" className={`text-[8px] px-2.5 py-1 rounded-lg uppercase font-black tracking-widest border-0 ${getStatusColor(order.financialStatus)}`}>
                                {order.financialStatus}
                              </Badge>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="space-y-3">
                            <p className="text-[9px] uppercase tracking-widest font-black text-white/20">Investment</p>
                            <p className="text-2xl font-display tracking-tightest">
                               <span className="text-sm mr-1 opacity-40">₹</span>
                               {parseFloat(order.totalPrice.amount).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-6 pt-8 lg:pt-0 border-t lg:border-t-0 border-white/5">
                           <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-primary hover:text-white transition-colors">
                              View Details
                              <ChevronRight className="h-3 w-3" />
                           </button>
                           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-700">
                              {order.fulfillmentStatus?.toLowerCase() === 'fulfilled' ? 
                                <CheckCircle2 className="h-7 w-7 text-green-500" /> : 
                                <Ship className="h-7 w-7 text-primary" />
                              }
                           </div>
                        </div>

                      </div>
                      
                      {/* Decorative hint */}
                      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          <Reveal delay={0.5}>
            <div className="mt-20 p-10 bg-white/[0.01] border border-white/5 rounded-[3rem] text-center max-w-2xl mx-auto">
               <AlertCircle className="h-6 w-6 text-primary/40 mx-auto mb-6" />
               <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-4 leading-relaxed">
                 All data is synchronized with Shopify Secure Customer Accounts.
                 If you notice any discrepancies, please contact our support team.
               </p>
               <Link to="/contact" className="text-[10px] uppercase tracking-widest font-black text-primary border-b border-primary/20 pb-0.5 hover:text-white hover:border-white transition-all">
                  Get Assistance
               </Link>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
