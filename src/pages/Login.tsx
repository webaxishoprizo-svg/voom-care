import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ScrollReveal";
import { LogIn } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const { login, isAuthenticated, isLoading, setAccessToken } = useCustomerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔄 HANDLE PKCE CODE REDIRECT
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      const detailedError = errorDescription || error;
      console.error("Shopify Auth Error:", detailedError);
      toast.error(`Authentication failed: ${detailedError}`);
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    if (code) {
      const exchangeToken = async () => {
        const codeVerifier = window.sessionStorage.getItem("shopify_code_verifier");
        const clientId = "d9d84aeb-8c67-483e-9cfe-a9bf59a8731f";
        const shopId = "77660979223";
        const redirectUri = `${window.location.origin}/login`;

        if (!codeVerifier) {
          toast.error("Security session expired. Please try logging in again.");
          return;
        }

        try {
          const response = await fetch(`https://shopify.com/authentication/${shopId}/oauth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: clientId,
              redirect_uri: redirectUri,
              code,
              code_verifier: codeVerifier,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to exchange code for token");
          }

          const data = await response.json();
          const accessToken = data.access_token;

          if (accessToken) {
            await setAccessToken(accessToken);
            toast.success("Successfully logged in");
            window.sessionStorage.removeItem("shopify_code_verifier");
            window.history.replaceState(null, "", window.location.pathname);
            navigate("/account");
          }
        } catch (err) {
          console.error("Token exchange failed:", err);
          toast.error("Login verification failed");
          window.history.replaceState(null, "", window.location.pathname);
        }
      };

      void exchangeToken();
    }
  }, [setAccessToken, navigate]);

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
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium mb-2">Authentication</p>
              <h1 className="text-4xl sm:text-5xl font-display text-foreground tracking-tight">Welcome Back</h1>
              <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-[280px] mx-auto pt-2">
                Sign in to your NOR account to view orders and manage your profile.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={login}
                className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 transition-all duration-500 rounded-[8px] tracking-[0.2em] uppercase text-[10px] font-bold group"
              >
                <LogIn className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                Continue to Login
              </Button>
              <p className="mt-6 text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                Secure and encrypted connection
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
