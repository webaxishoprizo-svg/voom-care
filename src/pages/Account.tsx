import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ScrollReveal";
import { User, LogOut, ShoppingBag, ChevronRight } from "lucide-react";

const Account = () => {
  const { customer, logout, isAuthenticated, isLoading } = useCustomerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border/40 pb-12">
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium">My Account</p>
                <h1 className="text-4xl sm:text-5xl font-display text-foreground tracking-tight">
                  Bonjour, {customer.firstName || "Guest"}
                </h1>
              </div>
              <Button 
                variant="outline"
                onClick={logout}
                className="rounded-none border-border/40 text-[9px] uppercase tracking-[0.2em] font-bold h-10 px-6 hover:bg-foreground hover:text-background transition-colors duration-500"
              >
                <LogOut className="mr-2 h-3 w-3" />
                Sign Out
              </Button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal delay={0.1}>
              <div className="bg-muted/30 p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl uppercase tracking-wider">Profile Details</h2>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Full Name</p>
                    <p className="text-sm font-medium">{customer.firstName} {customer.lastName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Email Address</p>
                    <p className="text-sm font-medium">{customer.email}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <Link to="/account/orders" className="block group">
                <div className="bg-muted/30 p-8 space-y-6 h-full transition-all duration-500 group-hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <h2 className="font-display text-xl uppercase tracking-wider">Orders</h2>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-500" />
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    Track current shipments and review your fragrance history.
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold pt-4">View History</p>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
