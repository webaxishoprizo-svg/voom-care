import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Package, MapPin, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { fetchCustomerProfile, type CustomerProfile } from "@/lib/shopify/customer-queries";

const Account = () => {
  const { isAuthenticated, login, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      login("/account");
      return;
    }
    fetchCustomerProfile()
      .then(setProfile)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, login]);

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-24">
        <header className="mb-10 md:mb-14">
          <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
            My account
          </p>
          <h1 className="text-3xl md:text-5xl font-serif tracking-tight">
            Welcome{profile?.firstName ? `, ${profile.firstName}` : ""}
          </h1>
        </header>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Link
            to="/orders"
            className="group p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <Package className="w-6 h-6 mb-4 text-primary" />
            <h2 className="text-xl font-medium mb-1">Orders</h2>
            <p className="text-sm text-muted-foreground">
              Track current shipments and review past orders.
            </p>
          </Link>

          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <User className="w-6 h-6 mb-4 text-primary" />
            <h2 className="text-xl font-medium mb-3">Profile</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="text-right">{profile?.displayName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="text-right break-all">
                  {profile?.emailAddress?.emailAddress || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="text-right">{profile?.phoneNumber?.phoneNumber || "—"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] mb-8">
          <div className="flex items-center gap-3 mb-5">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-medium">Addresses</h2>
          </div>
          {profile?.addresses?.nodes?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {profile.addresses.nodes.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-xl border border-white/10 text-sm leading-relaxed"
                >
                  {(addr.formatted || []).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  {addr.phoneNumber && (
                    <div className="text-muted-foreground mt-1">{addr.phoneNumber}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No addresses on file.</p>
          )}
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/15 hover:bg-white/5 text-sm tracking-wide"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default Account;