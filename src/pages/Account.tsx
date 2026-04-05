import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { formatCurrency } from "@/lib/utils";

const Account = () => {
  const navigate = useNavigate();
  const {
    customer,
    isAuthenticated,
    isLoading,
    isSubmitting,
    logout,
    updateProfile,
  } = useCustomerAuth();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    setProfile({
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    });
  }, [customer]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateProfile(profile);
    } catch {
      // Toasts are handled in the auth context.
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-28 pb-16 px-4 text-center">
          <h1 className="font-display text-4xl text-foreground">Loading Account...</h1>
        </section>
        <Footer />
      </main>
    );
  }

  if (!isAuthenticated || !customer) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-28 pb-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <UserRound className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl text-foreground mb-4">Shopify Account</h1>
              <p className="text-muted-foreground mb-8">
                Log in to view your Shopify orders, manage your profile, and continue checkout with your customer account.
              </p>
              <Button asChild className="rounded-full px-8">
                <Link to="/login">Login to Shopify</Link>
              </Button>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Shopify Account</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
              Welcome, {customer.firstName || customer.displayName || "NOR Customer"}
            </h1>
            <p className="text-muted-foreground">
              Manage your details and review your Shopify order history from the headless storefront.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr,1.25fr]">
            <Card className="rounded-3xl border-border bg-card/80">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Profile</CardTitle>
                <CardDescription>These details come from your Shopify customer account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      value={profile.firstName}
                      onChange={(event) =>
                        setProfile((prev) => ({ ...prev, firstName: event.target.value }))
                      }
                      placeholder="First name"
                      className="bg-background/70 border-border"
                    />
                    <Input
                      value={profile.lastName}
                      onChange={(event) =>
                        setProfile((prev) => ({ ...prev, lastName: event.target.value }))
                      }
                      placeholder="Last name"
                      className="bg-background/70 border-border"
                    />
                  </div>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="Email"
                    className="bg-background/70 border-border"
                  />
                  <Input
                    value={profile.phone}
                    onChange={(event) =>
                      setProfile((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    placeholder="Phone"
                    className="bg-background/70 border-border"
                  />

                  {customer.defaultAddress && (
                    <div className="rounded-2xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
                      <p className="text-foreground font-medium mb-2">Default Address</p>
                      <p>{customer.defaultAddress.address1}</p>
                      {customer.defaultAddress.address2 && <p>{customer.defaultAddress.address2}</p>}
                      <p>
                        {customer.defaultAddress.city}
                        {customer.defaultAddress.province
                          ? `, ${customer.defaultAddress.province}`
                          : ""}
                        {customer.defaultAddress.zip ? ` ${customer.defaultAddress.zip}` : ""}
                      </p>
                      <p>{customer.defaultAddress.country}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full gradient-gold text-primary-foreground"
                    >
                      {isSubmitting ? "Saving..." : "Save Profile"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border bg-card/80">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Orders</CardTitle>
                <CardDescription>Your Shopify customer order history.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer.orders.length ? (
                  customer.orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-border bg-background/50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-foreground font-semibold">{order.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.processedAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            {formatCurrency(order.totalPrice, order.currencyCode)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.fulfillmentStatus || "Processing"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary">
                          Payment: {order.financialStatus || "Pending"}
                        </span>
                        <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                          Fulfillment: {order.fulfillmentStatus || "Unfulfilled"}
                        </span>
                      </div>
                      <Button asChild variant="link" className="mt-3 px-0">
                        <a href={order.statusUrl} target="_blank" rel="noreferrer">
                          Track on Shopify
                        </a>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                    <Package className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="text-foreground font-medium mb-1">No orders yet</p>
                    <p className="text-sm text-muted-foreground">
                      Once you place an order through Shopify checkout, it will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Account;
