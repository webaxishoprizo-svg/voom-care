import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ScrollReveal";
import { LogIn, ShieldCheck, Zap, ArrowRight } from "lucide-react";

/**
 * 🔐 STEP 1: LOGIN PAGE (/login)
 * Responsibilities:
 * - Display login button
 * - Handle OAuth redirect response
 * - Extract token from URL hash
 */
const Login = () => {
  const { login, isLoading, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 🪙 TOKEN HANDLING
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");

      if (accessToken) {
        // 1. Store in localStorage
        localStorage.setItem("customer_token", accessToken);
        
        // 2. Clear URL using history.replaceState
        window.history.replaceState(null, "", window.location.pathname);
        
        // 3. Redirect to account
        navigate("/account");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-b-2 border-primary/30 rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-primary selection:text-black">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-24 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-xl w-full relative z-10">
          <Reveal>
            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-12 backdrop-blur-2xl shadow-2xl space-y-12 text-center group">
              
              <div className="space-y-6">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-[10px] tracking-[0.5em] uppercase text-primary font-black mb-4">Authentication</p>
                  <h1 className="text-5xl font-display tracking-tightest uppercase italic leading-none">
                    Digital<br />Concierge
                  </h1>
                  <p className="text-white/40 text-sm font-light leading-relaxed max-w-[320px] mx-auto pt-4 italic">
                    Access your exclusive olfactory profile and manage your acquisitions with secure Shopify authentication.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <Button 
                  onClick={login}
                  className="w-full h-16 bg-primary text-black hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-500 rounded-2xl tracking-[0.2em] uppercase text-[11px] font-black group/btn shadow-xl shadow-primary/10"
                >
                  <LogIn className="mr-3 h-5 w-5 transition-transform duration-500 group-hover/btn:translate-x-1" />
                  Continue to Shopify
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover/btn:opacity-100 transition-all" />
                </Button>

                <div className="flex items-center justify-center gap-8 pt-4">
                   <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Seamless</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3 text-primary" />
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/30">Secure</span>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                 <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-medium">
                    Powered by Shopify Customer Account API
                 </p>
              </div>

            </div>
          </Reveal>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
