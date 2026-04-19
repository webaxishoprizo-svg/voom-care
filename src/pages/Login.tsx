import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ScrollReveal";
import { LogIn } from "lucide-react";

const Login = () => {
  const { login, isAuthenticated, isLoading } = useCustomerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <Reveal className="w-full max-w-md">
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium">Authentication</p>
              <h1 className="text-4xl sm:text-5xl font-display text-foreground tracking-tight">Welcome Back</h1>
              <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-[280px] mx-auto">
                Sign in to your NOR account to view orders and manage your profile.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={login}
                className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 transition-all duration-500 rounded-none tracking-[0.2em] uppercase text-[10px] font-bold group"
              >
                <LogIn className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                Continue to Login
              </Button>
              <p className="mt-6 text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                Secure authentication handled by Shopify
              </p>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
