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

  const login = useCallback(() => {
    const redirectUri = `${window.location.origin}/login`;
    // 🔐 Updated to user-provided Authorization endpoint
    const authUrl = 'https://shopify.com/authentication/77660979223/oauth/authorize';
    window.location.href = authUrl;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CUSTOMER_TOKEN_STORAGE_KEY);
    setCustomer(null);
    setCustomerAccessToken(null);

    // 🔐 Updated to user-provided Logout endpoint
    const logoutUrl = `https://shopify.com/authentication/77660979223/logout`;
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
