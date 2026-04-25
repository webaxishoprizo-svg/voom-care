/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { SHOPIFY_STORE_URL } from "@/lib/shopify/client";

export const CUSTOMER_TOKEN_STORAGE_KEY = "customer_token";

interface CustomerAuthContextType {
  customer: any | null;
  customerAccessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refreshCustomer: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<any | null>(null);
  const [customerAccessToken, setCustomerAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomer = useCallback(async (token: string) => {
    // In a pure storefront API setup, we would fetch the customer here
    // For now, we'll just set the token to indicate authentication
    setCustomerAccessToken(token);
    setIsLoading(false);
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
    window.location.href = `${SHOPIFY_STORE_URL}/account/login`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CUSTOMER_TOKEN_STORAGE_KEY);
    setCustomer(null);
    setCustomerAccessToken(null);
    window.location.href = `${SHOPIFY_STORE_URL}/account/logout`;
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
