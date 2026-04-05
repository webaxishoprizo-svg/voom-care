import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "@/components/ui/sonner";
import {
  fetchShopifyCustomer,
  loginShopifyCustomer,
  logoutShopifyCustomer,
  registerShopifyCustomer,
  updateShopifyCustomer,
  type ShopifyCustomerProfile,
} from "@/lib/shopify/customer";

export const CUSTOMER_TOKEN_STORAGE_KEY = "nor-shopify-customer-access-token";

interface CustomerAuthContextType {
  customer: ShopifyCustomerProfile | null;
  customerAccessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<ShopifyCustomerProfile | null>(null);
  const [customerAccessToken, setCustomerAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    async (token: string, silent = false) => {
      try {
        const profile = await fetchShopifyCustomer(token);
        setCustomer(profile);
        setCustomerAccessToken(token);
        persistToken(token);
        return profile;
      } catch (error) {
        clearSession();
        if (!silent) {
          const message =
            error instanceof Error ? error.message : "Unable to load your Shopify account.";
          toast.error(message);
        }
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

    const token = window.localStorage.getItem(CUSTOMER_TOKEN_STORAGE_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    void loadCustomer(token, true).finally(() => setIsLoading(false));
  }, [loadCustomer]);

  const refreshCustomer = useCallback(async () => {
    if (!customerAccessToken) return;
    await loadCustomer(customerAccessToken);
  }, [customerAccessToken, loadCustomer]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsSubmitting(true);

      try {
        const token = await loginShopifyCustomer(email, password);
        await loadCustomer(token.accessToken);
        toast.success("Logged in with Shopify.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to log in with Shopify.";
        toast.error(message);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadCustomer],
  );

  const register = useCallback(
    async (input: {
      firstName?: string;
      lastName?: string;
      email: string;
      password: string;
    }) => {
      setIsSubmitting(true);

      try {
        await registerShopifyCustomer(input);
        const token = await loginShopifyCustomer(input.email, input.password);
        await loadCustomer(token.accessToken);
        toast.success("Your Shopify account has been created.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to create your Shopify account.";
        toast.error(message);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadCustomer],
  );

  const logout = useCallback(async () => {
    const token = customerAccessToken;
    clearSession();

    if (!token) return;

    try {
      await logoutShopifyCustomer(token);
    } catch {
      // Logging out locally is enough to end the headless storefront session.
    }

    toast.success("Logged out.");
  }, [clearSession, customerAccessToken]);

  const updateProfile = useCallback(
    async (input: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    }) => {
      if (!customerAccessToken) {
        toast.error("Please log in first.");
        return;
      }

      setIsSubmitting(true);

      try {
        const updatedCustomer = await updateShopifyCustomer(customerAccessToken, input);
        setCustomer(updatedCustomer);
        toast.success("Your Shopify profile has been updated.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to update your Shopify profile.";
        toast.error(message);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [customerAccessToken],
  );

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        customerAccessToken,
        isAuthenticated: Boolean(customerAccessToken && customer),
        isLoading,
        isSubmitting,
        login,
        register,
        logout,
        updateProfile,
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
