/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchCustomerProfile, type CustomerProfile } from "@/lib/shopify/customer-account";
import { SHOPIFY_CONFIG } from "@/lib/shopify/client";
import { generateCodeVerifier, generateCodeChallenge } from "@/lib/shopify/pkce";

export const CUSTOMER_TOKEN_STORAGE_KEY = "customer_token";

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

  const loadCustomer = useCallback(async (token: string) => {
    try {
      const profile = await fetchCustomerProfile(token);
      setCustomer(profile);
      setCustomerAccessToken(token);
    } catch (error) {
      console.error("Auth Session Error:", error);
      localStorage.removeItem(CUSTOMER_TOKEN_STORAGE_KEY);
      setCustomer(null);
      setCustomerAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(CUSTOMER_TOKEN_STORAGE_KEY);
    if (savedToken) {
      void loadCustomer(savedToken);
    } else {
      setIsLoading(false);
    }
  }, [loadCustomer]);

  const login = useCallback(async () => {
    const redirectUri = `${window.location.origin}/login`;
    
    // 🔐 PKCE FLOW: Generate verifier and challenge
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    
    // Store verifier in sessionStorage to use it during token exchange
    sessionStorage.setItem("shopify_code_verifier", verifier);
    
    const authUrl = new URL(`https://shopify.com/authentication/${SHOPIFY_CONFIG.shopId}/oauth/authorize`);
    authUrl.searchParams.set("client_id", SHOPIFY_CONFIG.publicClientId);
    authUrl.searchParams.set("scope", "openid email customer-account-api:full");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("code_challenge", challenge);
    authUrl.searchParams.set("code_challenge_method", "S256");
    
    window.location.href = authUrl.toString();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CUSTOMER_TOKEN_STORAGE_KEY);
    setCustomer(null);
    setCustomerAccessToken(null);

    // 🔐 Restored parameters for proper logout redirection
    const logoutUrl = `https://shopify.com/authentication/${SHOPIFY_CONFIG.shopId}/logout?return_to=${encodeURIComponent(window.location.origin)}`;
    window.location.href = logoutUrl;
  }, []);

  const refreshCustomer = useCallback(async () => {
    const token = localStorage.getItem(CUSTOMER_TOKEN_STORAGE_KEY);
    if (token) await loadCustomer(token);
  }, [loadCustomer]);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        customerAccessToken,
        isAuthenticated: !!customerAccessToken,
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
