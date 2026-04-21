import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ScrollReveal";
import { User, LogOut, ShoppingBag, MapPin, ShieldCheck, Mail, ArrowRight } from "lucide-react";

const Account = () => {
  const { customer, logout, isLoading } = useCustomerAuth();

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (!isLoading && !token) {
      window.location.replace("/login");
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          
          {/* ✨ MEMBER HERO */}
          <Reveal>
            <div className="relative overflow-hidden bg-foreground text-background rounded-3xl p-8 lg:p-16 mb-12 shadow-2xl">
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 border border-background/20 backdrop-blur-sm">
                  <ShieldCheck className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Verified Member</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl lg:text-7xl font-display tracking-tighter leading-none">
                    Welcome Back,<br />{customer.firstName}
                  </h1>
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={logout}
                    className="bg-transparent border-background/20 hover:bg-background hover:text-foreground transition-all duration-500 rounded-xl px-6 h-12 text-[10px] uppercase tracking-widest font-bold font-sans"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
              
              {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 👤 PROFILE CARD */}
            <Reveal delay={0.1} className="lg:col-span-1">
              <div className="h-full bg-surface-glass border border-white/5 rounded-3xl p-8 flex flex-col hover:border-primary/30 transition-all duration-500 group">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-500">
                    <User className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-2xl tracking-tight uppercase">Profile</h2>
                </div>
                
                <div className="space-y-8 flex-grow">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                      <User className="h-3 w-3" /> Full Identity
                    </p>
                    <p className="text-xl font-medium tracking-tight truncate">{customer.firstName} {customer.lastName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-muted-foreground">
                      <Mail className="h-3 w-3" /> Email Address
                    </p>
                    <p className="text-xl font-medium tracking-tight truncate">{customer.email}</p>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-white/5">
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Your details are securely linked to your Shopify account.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* 📦 ORDERS & SETTINGS QUICK ACTIONS */}
            <Reveal delay={0.2} className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
                
                <Link to="/account/orders" className="group">
                  <div className="h-full bg-surface-glass border border-white/5 rounded-3xl p-8 flex flex-col hover:bg-foreground hover:text-background transition-all duration-700">
                    <div className="flex justify-between items-start mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-background/20 group-hover:text-background transition-all duration-500">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1" />
                    </div>
                    <div className="mt-auto">
                      <h2 className="font-display text-3xl tracking-tighter uppercase mb-2">Order History</h2>
                      <p className="text-sm opacity-60 group-hover:opacity-80 transition-opacity font-light">Explore your olfactory journey and track current scents.</p>
                      <div className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold border-b border-current pb-1">
                        View Voyages
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="bg-surface-glass border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden opacity-80 cursor-not-allowed grayscale">
                  <div className="w-12 h-12 rounded-2xl bg-muted/10 flex items-center justify-center text-muted-foreground mb-10">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="mt-auto">
                    <h2 className="font-display text-3xl tracking-tighter uppercase mb-2">Addresses</h2>
                    <p className="text-sm text-muted-foreground font-light">Coming soon: manage your delivery locations directly.</p>
                  </div>
                  <div className="absolute top-4 right-4 text-[9px] uppercase tracking-widest font-bold px-2 py-1 bg-muted/20 rounded">Locked</div>
                </div>

              </div>
            </Reveal>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
