import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { formatCurrency } from "@/lib/utils";

const TrackOrder = () => {
  const { customer, isAuthenticated, isLoading } = useCustomerAuth();

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
              Shopify order tracking is available from your customer account.
            </p>

            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading orders...</div>
            ) : !isAuthenticated || !customer ? (
              <div className="rounded-3xl border border-border bg-card/80 p-8 text-center">
                <p className="text-foreground font-medium mb-3">
                  Login to your Shopify account to view and track your orders.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Your order history is fetched directly from Shopify customer data.
                </p>
                <Button asChild className="rounded-full px-8">
                  <Link to="/login">Login to Shopify</Link>
                </Button>
              </div>
            ) : customer.orders.length ? (
              <div className="space-y-4">
                {customer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-border bg-card/80 p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-2xl text-foreground">{order.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.processedAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-semibold">
                          {formatCurrency(order.totalPrice, order.currencyCode)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.fulfillmentStatus || "Processing"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary">
                        Payment: {order.financialStatus || "Pending"}
                      </span>
                      <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                        Fulfillment: {order.fulfillmentStatus || "Unfulfilled"}
                      </span>
                    </div>

                    <Button asChild variant="link" className="mt-4 px-0">
                      <a href={order.statusUrl} target="_blank" rel="noreferrer">
                        Open Shopify Tracking
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border p-8 text-center">
                <p className="text-foreground font-medium mb-2">No Shopify orders yet</p>
                <p className="text-sm text-muted-foreground">
                  Once you complete checkout, your orders will appear here automatically.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default TrackOrder;
