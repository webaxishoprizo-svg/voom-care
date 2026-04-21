import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { fetchCustomerOrders, type CustomerOrder } from "@/lib/shopify/customer-account";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/ScrollReveal";
import { ArrowLeft, Package, Calendar, Tag } from "lucide-react";

/**
 * 📦 STEP 3: ORDERS PAGE (/account/orders)
 * Responsibilities:
 * - Protected route
 * - Fetch order history
 */
const Orders = () => {
  const { customerAccessToken, isLoading } = useCustomerAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // 🛡️ CONTROLLED AUTH GUARD
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Retrieving Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="mb-12">
              <Link 
                to="/account" 
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-500 mb-6 group"
              >
                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform duration-500" />
                Back to Account
              </Link>
              <div className="space-y-4 text-left">
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium">Order History</p>
                <h1 className="text-4xl sm:text-5xl font-display text-foreground tracking-tight">Your Journeys</h1>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            {isFetching ? (
              <div className="py-20 text-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-4"></div>
                 <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Syncing History...</p>
              </div>
            ) : orders.length === 0 ? (
              <Reveal delay={0.1}>
                <div className="text-center py-20 bg-muted/30 border border-dashed border-border/40">
                  <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground font-light italic">No fragrance journeys found yet.</p>
                  <Link to="/products" className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mt-4 inline-block hover:underline">
                    Explore Collections
                  </Link>
                </div>
              </Reveal>
            ) : (
              orders.map((order, index) => (
                <Reveal key={order.name} delay={index * 0.05}>
                  <div className="bg-muted/30 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-muted/50 transition-colors duration-500 group border border-transparent hover:border-border/30">
                    <div className="flex gap-6 sm:gap-10">
                      <div className="space-y-1 text-left">
                        <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                          <Tag className="h-2.5 w-2.5" />
                          Order ID
                        </p>
                        <p className="text-sm font-medium">{order.name}</p>
                      </div>
                      <div className="space-y-1 text-left">
                        <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                          <Calendar className="h-2.5 w-2.5" />
                          Date
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(order.processedAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-10">
                      <div className="space-y-1 text-left sm:text-right">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-lg font-display tracking-tight">₹{parseFloat(order.totalPrice.amount).toLocaleString("en-IN")}</p>
                      </div>
                      <div className="h-10 w-10 border border-border/40 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                        <Package className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
