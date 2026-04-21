import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { fetchCustomerOrders, type CustomerOrder } from "@/lib/shopify/customer-account";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/ScrollReveal";
import { ArrowLeft, Package, Calendar, Tag, CreditCard, Ship, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const { customerAccessToken, isLoading } = useCustomerAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (!isLoading && !token) {
      window.location.replace("/login");
    }
  }, [isLoading]);

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
    switch (status.toLowerCase()) {
      case 'fulfilled': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'unfulfilled': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-border/20';
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
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          
          <Reveal>
            <div className="mb-16 space-y-8">
              <Link 
                to="/account" 
                className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:text-primary transition-all duration-500"
              >
                <div className="w-8 h-8 rounded-full bg-surface-glass border border-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all duration-500">
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-500" />
                </div>
                Return to Dashboard
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] px-3 py-1 uppercase tracking-widest font-bold">Fragrance Log</Badge>
                  <h1 className="text-5xl lg:text-7xl font-display tracking-tighter uppercase leading-none">Your Voyages</h1>
                </div>
                <p className="text-sm text-muted-foreground font-light max-w-xs leading-relaxed">
                  A detailed archive of your luxury car fragrance acquisitions and their current status.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            {isFetching ? (
              <div className="py-32 text-center bg-surface-glass border border-white/5 rounded-[40px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mx-auto mb-6"></div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground animate-pulse">Synchronizing History</p>
              </div>
            ) : orders.length === 0 ? (
              <Reveal delay={0.1}>
                <div className="text-center py-32 bg-surface-glass border border-white/5 rounded-[40px] space-y-8 overflow-hidden relative">
                  <div className="relative z-10 space-y-6">
                    <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                      <Package className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-2xl font-display uppercase tracking-tight">No records found</p>
                       <p className="text-sm text-muted-foreground font-light italic">Your olfactory journey hasn't begun yet.</p>
                    </div>
                    <Link to="/products" className="inline-flex h-12 items-center px-8 bg-foreground text-background rounded-full text-[10px] uppercase tracking-widest font-bold transition-all hover:scale-105 active:scale-95">
                      Start Your Voyage
                    </Link>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                </div>
              </Reveal>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <Reveal key={order.name} delay={index * 0.05}>
                    <div className="group bg-surface-glass border border-white/5 p-6 lg:p-10 rounded-[40px] hover:border-primary/40 hover:bg-surface-glass/80 transition-all duration-700 relative overflow-hidden">
                      
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                        
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 flex-grow">
                          <div className="space-y-2">
                            <p className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-muted-foreground/60">
                              <Tag className="h-3 w-3" /> Record ID
                            </p>
                            <p className="text-lg font-display tracking-tight group-hover:text-primary transition-colors duration-500">#{order.name}</p>
                          </div>

                          <div className="space-y-2">
                            <p className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-muted-foreground/60">
                              <Calendar className="h-3 w-3" /> Voyage Date
                            </p>
                            <p className="text-lg font-display tracking-tight">
                              {new Date(order.processedAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div className="space-y-2 col-span-2 lg:col-span-1">
                            <p className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-muted-foreground/60">
                              <Ship className="h-3 w-3" /> Current State
                            </p>
                            <div className="flex gap-2">
                              <Badge variant="outline" className={`text-[8px] px-2 py-0.5 rounded-md uppercase font-bold tracking-tighter ${getStatusColor(order.fulfillmentStatus)}`}>
                                {order.fulfillmentStatus || 'Pending'}
                              </Badge>
                              <Badge variant="outline" className={`text-[8px] px-2 py-0.5 rounded-md uppercase font-bold tracking-tighter ${getStatusColor(order.financialStatus)}`}>
                                {order.financialStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-12 border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0">
                          <div className="space-y-1 text-left lg:text-right">
                            <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/60">Investment</p>
                            <p className="text-3xl font-display tracking-tighter">₹{parseFloat(order.totalPrice.amount).toLocaleString("en-IN")}</p>
                          </div>
                          <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center transition-all duration-700 group-hover:bg-primary group-hover:scale-110 shadow-xl">
                            {order.fulfillmentStatus.toLowerCase() === 'fulfilled' ? <CheckCircle2 className="h-6 w-6" /> : <Ship className="h-6 w-6" />}
                          </div>
                        </div>

                      </div>
                      
                      {/* Decorative hint */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
