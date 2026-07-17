import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Package, MapPin, User, ChevronRight, Edit2, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { fetchCustomerProfile, fetchCustomerOrders, type CustomerProfile, type CustomerOrder } from "@/lib/shopify/customer-queries";
import { CustomerAuthError } from "@/lib/shopify/customer-account";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchTrackingDetails, type TrackingDetails } from "@/services/tracking";

const TrackedOrderCard = ({ trackingNumber, orderName }: { trackingNumber: string; orderName: string }) => {
  const [data, setData] = useState<TrackingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackingDetails(trackingNumber)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [trackingNumber]);

  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] animate-pulse">
        <div className="h-5 bg-white/10 rounded w-1/3 mb-4" />
        <div className="h-20 bg-white/5 rounded w-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] relative overflow-hidden group hover:bg-white/[0.04] transition-colors">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="font-semibold text-lg">{orderName}</h3>
          <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">ID: {trackingNumber}</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          {data.currentStatus !== "Delivered" && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
          {data.currentStatus}
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{data.origin}</span>
          <span>{data.destination}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[60%] rounded-full" />
        </div>
        <p className="text-[10px] mt-3 text-white/50 text-right uppercase tracking-widest">
          Expected: <span className="text-white font-medium">{data.expectedDeliveryDate}</span>
        </p>
      </div>

      <Link to={`/track-order?id=${trackingNumber}`} className="absolute inset-0 z-20">
        <span className="sr-only">Track order details</span>
      </Link>
    </div>
  );
};

const Account = () => {
  const { isAuthenticated, login, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      login("/account");
      return;
    }
    Promise.all([fetchCustomerProfile(), fetchCustomerOrders(10)])
      .then(([prof, ords]) => {
        setProfile(prof);
        setOrders(ords);
      })
      .catch((e) => {
        if (e instanceof CustomerAuthError) {
          toast.error(e.message);
          logout();
          login("/account");
          return;
        }
        setError(e instanceof Error ? e.message : "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, login, logout]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully! (Mocked)");
  };

  const handleAddressSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Address saved successfully! (Mocked)");
  };


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

        {/* Active Shipments Section */}
        {orders.some(o => o.fulfillments?.nodes[0]?.trackingInformation?.[0]?.number) && (
          <div className="mb-12">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Active Shipments
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {orders
                .filter(o => o.fulfillments?.nodes[0]?.trackingInformation?.[0]?.number)
                .slice(0, 2)
                .map(order => (
                  <TrackedOrderCard 
                    key={order.id} 
                    trackingNumber={order.fulfillments!.nodes[0]!.trackingInformation![0]!.number!} 
                    orderName={order.name}
                  />
                ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Link
            to="/orders"
            className="group p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <Package className="w-6 h-6 mb-4 text-primary" />
                <h2 className="text-xl font-medium mb-1">Order History</h2>
                <p className="text-sm text-muted-foreground">
                  Review all your past orders and receipts.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] relative">
            <div className="flex justify-between items-start mb-4">
              <User className="w-6 h-6 text-primary" />
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-1.5">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProfileSave} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Name</label>
                      <Input defaultValue={profile?.displayName || ""} className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Phone</label>
                      <Input defaultValue={profile?.phoneNumber?.phoneNumber || ""} className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                    </div>
                    <Button type="submit" variant="solid" className="w-full mt-4 !bg-white !text-black hover:!bg-white/90">Save Changes</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <h2 className="text-xl font-medium mb-3">Profile</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="text-right font-medium">{profile?.displayName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="text-right font-medium break-all text-white/70">
                  {profile?.emailAddress?.emailAddress || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="text-right font-medium">{profile?.phoneNumber?.phoneNumber || "—"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-medium">Addresses</h2>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-xs font-semibold uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-1.5">
                  <Plus className="w-3 h-3" /> Add New
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Address</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddressSave} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-widest">First Name</label>
                      <Input className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Last Name</label>
                      <Input className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Street Address</label>
                    <Input className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-widest">City</label>
                      <Input className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Postal Code</label>
                      <Input className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                    </div>
                  </div>
                  <Button type="submit" variant="solid" className="w-full mt-4 !bg-white !text-black hover:!bg-white/90">Save Address</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {profile?.addresses?.nodes?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {profile.addresses.nodes.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative group"
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="absolute top-4 right-4 text-white/30 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddressSave} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Street Address</label>
                          <Input defaultValue={addr.address1 || ""} className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-white/60 uppercase tracking-widest">City</label>
                            <Input defaultValue={addr.city || ""} className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-white/60 uppercase tracking-widest">Postal Code</label>
                            <Input defaultValue={addr.zip || ""} className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                          </div>
                        </div>
                        <Button type="submit" variant="solid" className="w-full mt-4 !bg-white !text-black hover:!bg-white/90">Update Address</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="text-sm leading-relaxed text-white/80 pr-8">
                    {(addr.formatted || []).map((line, i) => (
                      <div key={i} className={i === 0 ? "font-medium text-white mb-1" : ""}>{line}</div>
                    ))}
                    {addr.phoneNumber && (
                      <div className="text-muted-foreground mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        {addr.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <p className="text-sm text-muted-foreground mb-4">You haven't saved any addresses yet.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center md:justify-start">
          <button
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-white/15 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30 transition-all text-sm tracking-wide"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;