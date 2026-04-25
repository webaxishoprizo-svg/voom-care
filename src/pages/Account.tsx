import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ScrollReveal";
import { 
  User, 
  LogOut, 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  Mail, 
  ArrowRight,
  Settings,
  CreditCard,
  Bell
} from "lucide-react";

const Account = () => {
  const { customer, logout, isLoading } = useCustomerAuth();
  const navigate = useNavigate();

  // TEMPORARY: Mock customer for UI preview
  const mockCustomer = {
    firstName: "Premium",
    lastName: "User",
    email: "concierge@nor-perfume.com"
  };

  const displayCustomer = customer || mockCustomer;

  useEffect(() => {
    // Temporarily disabled for UI preview
    // const token = localStorage.getItem("customer_token");
    // if (!isLoading && !token) {
    //   navigate("/login");
    // }
  }, [isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-b-2 border-primary/30 rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  // if (!customer) return null; // Disabled for preview

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-primary selection:text-black">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none opacity-30" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar / Profile Summary */}
            <aside className="w-full lg:w-1/3 space-y-8">
              <Reveal>
                <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                        <User className="h-10 w-10" />
                      </div>
                      <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-bold flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-primary" />
                        Verified
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-4xl font-display tracking-tight">
                        {displayCustomer.firstName}<br />{displayCustomer.lastName}
                      </h1>
                      <p className="text-white/40 text-sm font-light flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {displayCustomer.email}
                      </p>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button 
                        variant="outline" 
                        onClick={logout}
                        className="w-full bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all duration-500 rounded-2xl h-14 text-[10px] uppercase tracking-widest font-bold"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 px-2">Account Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-white/80">API Connection</span>
                      </div>
                      <span className="text-[10px] text-green-500 font-bold">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-medium text-white/80">Data Sync</span>
                      </div>
                      <span className="text-[10px] text-primary font-bold">READY</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </aside>

            {/* Main Content / Dashboard */}
            <div className="w-full lg:w-2/3 space-y-8">
              
              <Reveal delay={0.2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Orders Card */}
                  <Link to="/account/orders" className="group">
                    <div className="h-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 hover:bg-primary transition-all duration-700 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8">
                        <ArrowRight className="h-6 w-6 opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
                      </div>
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-10 group-hover:bg-black/20 transition-colors">
                          <ShoppingBag className="h-7 w-7" />
                        </div>
                        <div className="mt-auto">
                          <h2 className="text-3xl font-display tracking-tight uppercase mb-3 group-hover:text-black transition-colors">My Voyages</h2>
                          <p className="text-white/40 text-sm font-light group-hover:text-black/60 transition-colors leading-relaxed">
                            View and track your previous fragrance acquisitions and orders.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Addresses Card */}
                  <div className="group relative">
                    <div className="h-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 opacity-40 grayscale transition-all duration-700">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-10">
                        <MapPin className="h-7 w-7" />
                      </div>
                      <div className="mt-auto">
                        <h2 className="text-3xl font-display tracking-tight uppercase mb-3 text-white">Addresses</h2>
                        <p className="text-white/40 text-sm font-light leading-relaxed">
                          Manage your shipping and billing destinations for seamless delivery.
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 rounded-full text-[8px] uppercase tracking-widest font-black border border-white/10">Coming Soon</div>
                  </div>

                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">Quick Settings</h3>
                    <Settings className="h-4 w-4 text-white/20" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Notifications</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Configure Alerts</p>
                      </div>
                    </button>
                    
                    <button className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Payment Methods</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Manage Cards</p>
                      </div>
                    </button>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="relative overflow-hidden bg-primary/20 border border-primary/20 rounded-[2.5rem] p-10">
                   <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                     <div className="space-y-4">
                       <h3 className="text-2xl font-display tracking-tight uppercase">Need Assistance?</h3>
                       <p className="text-white/60 text-sm max-w-sm font-light">
                         Our olfactory consultants are available to help you with any questions regarding your account or orders.
                       </p>
                     </div>
                     <Link to="/contact">
                        <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-14 text-[10px] uppercase tracking-widest font-black transition-transform hover:scale-105 active:scale-95">
                          Contact Concierge
                        </Button>
                     </Link>
                   </div>
                   <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/30 rounded-full blur-[80px] pointer-events-none" />
                </div>
              </Reveal>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
