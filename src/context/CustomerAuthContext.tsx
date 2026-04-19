import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "@/components/ui/sonner";
import { fetchCustomerProfile, type CustomerProfile } from "@/lib/shopify/customer-account";

export const CUSTOMER_TOKEN_STORAGE_KEY = "nor-shopify-customer-access-token";

interface CustomerAuthContextType {
  customer: CustomerProfile | null;
  customerAccessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshCustomer: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [customerAccessToken, setCustomerAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistToken = useCallback((token: string | null) => {
    if (typeof window === "undefined") return;
    if (token) {
      window.localStorage.setItem(CUSTOMER_TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(CUSTOMER_TOKEN_STORAGE_KEY);
    }
  }, []);

  const clearSession = useCallback(() => {
    setCustomer(null);
    setCustomerAccessToken(null);
    persistToken(null);
  }, [persistToken]);

  const loadCustomer = useCallback(
    async (token: string) => {
      try {
        const profile = await fetchCustomerProfile(token);
        setCustomer(profile);
        setCustomerAccessToken(token);
        persistToken(token);
        return profile;
      } catch (error) {
        clearSession();
        console.error("Failed to load customer:", error);
        throw error;
      }
    },
    [clearSession, persistToken],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    // Check URL for access token (handle OAuth callback)
    const hash = window.location.hash;
    const urlParams = new URL(window.location.href).searchParams;
    const tokenFromUrl = urlParams.get("access_token") || new URLSearchParams(hash.replace("#", "?")).get("access_token");

    if (tokenFromUrl) {
      void loadCustomer(tokenFromUrl).finally(() => {
        setIsLoading(false);
        // Clean up URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      });
      return;
    }

    const savedToken = window.localStorage.getItem(CUSTOMER_TOKEN_STORAGE_KEY);
    if (savedToken) {
      void loadCustomer(savedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [loadCustomer]);

  const login = useCallback(() => {
    const shopId = "77660979223";
    const clientId = "d9d84aeb-8c67-483e-9cfe-a9bf59a8731f";
    const redirectUri = encodeURIComponent(`${window.location.origin}/login`);
    const scope = encodeURIComponent("openid email customer-account:full");
    
    // Using the Shopify Customer Account OAuth authorize endpoint
    const authUrl = `https://shopify.com/${shopId}/auth/oauth/authorize?client_id=${clientId}&scope=${scope}&response_type=token&redirect_uri=${redirectUri}&state=${Math.random().toString(36).substring(7)}`;

    window.location.href = authUrl;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    window.location.href = "/";
  }, [clearSession]);

  const refreshCustomer = useCallback(async () => {
    if (!customerAccessToken) return;
    await loadCustomer(customerAccessToken);
  }, [customerAccessToken, loadCustomer]);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        customerAccessToken,
        isAuthenticated: Boolean(customerAccessToken && customer),
        isLoading,
        login,
        logout,
        refreshCustomer,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return context;
};
