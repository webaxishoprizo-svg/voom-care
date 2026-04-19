/* eslint-disable react-refresh/only-export-components */
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

// User specified key: "customer_token"
export const CUSTOMER_TOKEN_STORAGE_KEY = "customer_token";

interface CustomerAuthContextType {
  customer: CustomerProfile | null;
  customerAccessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setAccessToken: (token: string) => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

// Helper for PKCE
async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  const base64url = (arrayBuffer: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };
  return base64url(digest);
}

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

  const setAccessToken = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      await loadCustomer(token);
    } finally {
      setIsLoading(false);
    }
  }, [loadCustomer]);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const savedToken = window.localStorage.getItem(CUSTOMER_TOKEN_STORAGE_KEY);
    if (savedToken) {
      void loadCustomer(savedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [loadCustomer]);

  const login = useCallback(async () => {
    const clientId = "d9d84aeb-8c67-483e-9cfe-a9bf59a8731f";
    const shopId = "77660979223";
    
    const redirectUri = `${window.location.origin}/login`;
    const scope = "openid email";
    
    // 1. Generate a much stronger PKCE verifier (at least 43 characters required by RFC 7636)
    const array = new Uint32Array(56);
    window.crypto.getRandomValues(array);
    const codeVerifier = Array.from(array, dec => ("0" + dec.toString(36)).slice(-2)).join("");
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // 2. Persist verifier temporarily for the callback
    window.sessionStorage.setItem("shopify_code_verifier", codeVerifier);
    
    // 3. Modern Auth URL with response_type=code
    const state = Math.random().toString(36).substring(7);
    const nonce = Math.random().toString(36).substring(7);
    
    const authUrl = `https://shopify.com/authentication/${shopId}/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(scope)}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&nonce=${nonce}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    console.log("Redirecting to Shopify (PKCE Flow):", authUrl);
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
        isLoading: isLoading && !customerAccessToken,
        login,
        logout,
        setAccessToken,
        refreshCustomer,
      }}
    >
      {isLoading && !customerAccessToken && !window.localStorage.getItem(CUSTOMER_TOKEN_STORAGE_KEY) ? (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : children}
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
