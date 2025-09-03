import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { initializeViewportOptimizations } from "@/utils/viewport";
import { injectCriticalCSS } from "@/utils/criticalCSS";
import Index from "./pages/Index";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ScrollToTop component to handle automatic scroll to top on route changes
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
}

// Initialize performance and viewport optimizations
if (typeof window !== "undefined") {
  // Inject critical CSS for above-the-fold content
  injectCriticalCSS();

  // Initialize viewport optimizations when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeViewportOptimizations,
    );
  } else {
    initializeViewportOptimizations();
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <PerformanceMonitor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/:category" element={<ProductCategory />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
// Cache React root on window to avoid calling createRoot twice during HMR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w: any = window as any;
if (!w.__appRoot) {
  w.__appRoot = createRoot(container);
}
w.__appRoot.render(<App />);
