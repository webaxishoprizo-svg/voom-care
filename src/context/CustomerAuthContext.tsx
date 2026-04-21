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
    const authUrl = "https://nor-perfume-2.myshopify.com/auth/oauth/authorize?client_id=d9d84aeb-8c67-483e-9cfe-a9bf59a8731f&scope=openid%20email%20customer-account:full&response_type=token&redirect_uri=https://nor-sage-showcase.vercel.app/login";
    window.location.href = authUrl;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CUSTOMER_TOKEN_STORAGE_KEY);
    setCustomer(null);
    setCustomerAccessToken(null);
    window.location.replace("/");
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
