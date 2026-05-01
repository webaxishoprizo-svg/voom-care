import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopOnNavigation from "@/components/ScrollToTopOnNavigation";
import SmoothScroll from "@/components/SmoothScroll";

// Lazy-load pages for performance
const Index = lazy(() => import("./pages/Index.tsx"));
const Products = lazy(() => import("./pages/Products.tsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.tsx"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy.tsx"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

import CustomCursor from "@/components/CustomCursor";
import { AnimatePresence } from "framer-motion";

const Loading = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
      <div className="absolute inset-4 border-b-2 border-primary/30 rounded-full animate-spin-slow" />
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CustomerAuthProvider>
      <CartProvider>
        <TooltipProvider>
          <CustomCursor />
          <Toaster />
          <Sonner />
          <CartDrawer />
          <SmoothScroll />
          <BrowserRouter>
            <ScrollToTop />
            <ScrollToTopOnNavigation />
            <Suspense fallback={<Loading />}>
              <AnimatePresence mode="wait">
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </CustomerAuthProvider>
  </QueryClientProvider>
);

export default App;
