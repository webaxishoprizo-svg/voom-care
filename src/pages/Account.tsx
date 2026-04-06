import { useEffect } from "react";
import { SHOPIFY_ACCOUNT_URL } from "@/lib/shopify/client";

const Account = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace(SHOPIFY_ACCOUNT_URL);
    }
  }, []);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 text-center">
      <div>
        <p className="mb-2 text-xs tracking-[0.3em] uppercase text-primary">Shopify Account</p>
        <h1 className="font-display text-4xl text-foreground">Opening Your Account</h1>
        <p className="mt-3 text-muted-foreground">
          You&apos;ll continue on Shopify&apos;s official customer account page.
        </p>
      </div>
    </main>
  );
};

export default Account;
