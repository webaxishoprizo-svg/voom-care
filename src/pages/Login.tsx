import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

const Login = () => {
  const { login } = useCustomerAuth();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo") || "/account";
    login(returnTo);
  }, [login, location.search]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="space-y-3 text-center">
        <div className="w-10 h-10 mx-auto border-t-2 border-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground tracking-wide">Redirecting to secure login…</p>
      </div>
    </div>
  );
};

export default Login;