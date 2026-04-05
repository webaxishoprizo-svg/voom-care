import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, isSubmitting, login, register } = useCustomerAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form);
      }

      navigate("/account");
    } catch {
      // Toasts are handled in the auth context.
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">
                Shopify Account
              </p>
              <h1 className="font-display text-4xl text-foreground mb-3">
                {mode === "login" ? "Welcome Back" : "Create Your Account"}
              </h1>
              <p className="text-muted-foreground">
                Sign in to view orders, manage your profile, and continue checkout as a Shopify customer.
              </p>
            </div>

            <Card className="rounded-3xl border-border bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <div className="grid grid-cols-2 gap-2 rounded-full bg-background/60 p-1">
                  <Button
                    type="button"
                    variant={mode === "login" ? "default" : "ghost"}
                    className="rounded-full"
                    onClick={() => setMode("login")}
                  >
                    Login
                  </Button>
                  <Button
                    type="button"
                    variant={mode === "register" ? "default" : "ghost"}
                    className="rounded-full"
                    onClick={() => setMode("register")}
                  >
                    Register
                  </Button>
                </div>
                <div>
                  <CardTitle className="font-display text-2xl text-foreground">
                    {mode === "login" ? "Shopify Login" : "Shopify Registration"}
                  </CardTitle>
                  <CardDescription>
                    {mode === "login"
                      ? "Use the same email and password from your NOR Shopify customer account."
                      : "Create a Shopify customer account to manage orders in the headless storefront."}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {mode === "register" && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        value={form.firstName}
                        onChange={(event) => updateField("firstName", event.target.value)}
                        placeholder="First name"
                        className="bg-background/70 border-border"
                      />
                      <Input
                        value={form.lastName}
                        onChange={(event) => updateField("lastName", event.target.value)}
                        placeholder="Last name"
                        className="bg-background/70 border-border"
                      />
                    </div>
                  )}
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="Email address"
                    className="bg-background/70 border-border"
                    required
                  />
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    placeholder="Password"
                    className="bg-background/70 border-border"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full gradient-gold text-primary-foreground"
                  >
                    {isSubmitting
                      ? "Connecting to Shopify..."
                      : mode === "login"
                        ? "Login"
                        : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Login;
