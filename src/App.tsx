import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProductsProvider } from "@/contexts/ProductsContext";

import { FloatingMessageButton } from "@/components/chat/FloatingMessageButton";

import Index from "./pages/Index";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Testimonials from "./pages/Testimonials";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Order from "./pages/Order";
import TrackOrder from "./pages/TrackOrder";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

// ✅ ADD THIS COMPONENT
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/** Helper component to avoid context errors */
const FloatingButtonWrapper = () => {
  const { user } = useAuth();
  return user?.role !== "admin" ? <FloatingMessageButton /> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />  {/* ✅ ADD THIS LINE */}

                {/* Floating button is now protected from admin */}
                <FloatingButtonWrapper />

                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Protected Routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/track-order"
                    element={
                      <ProtectedRoute>
                        <TrackOrder />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;