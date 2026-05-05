/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  beginLogin,
  clearTokens,
  getAccessToken,
  isAuthenticated as checkAuth,
  logout as oauthLogout,
} from "@/lib/shopify/customer-account";

interface CustomerAuthContextType {
  customerAccessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (returnTo?: string) => void;
  logout: () => void;
  signalAuthenticated: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [authed, setAuthed] = useState<boolean>(() => checkAuth());

  useEffect(() => {
    setToken(getAccessToken());
    setAuthed(checkAuth());
  }, []);

  const login = useCallback((returnTo?: string) => {
    void beginLogin(returnTo);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setToken(null);
    setAuthed(false);
    oauthLogout();
  }, []);

  const signalAuthenticated = useCallback(() => {
    setToken(getAccessToken());
    setAuthed(checkAuth());
  }, []);

  const value = useMemo(
    () => ({
      customerAccessToken: token,
      isAuthenticated: authed,
      isLoading: false,
      login,
      logout,
      signalAuthenticated,
    }),
    [token, authed, login, logout, signalAuthenticated],
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
};

export const useCustomerAuth = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
};
