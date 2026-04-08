import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/meta-pixel";

export default function ScrollToTopOnNavigation() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    trackPageView();
  }, [pathname]);

  return null;
}
