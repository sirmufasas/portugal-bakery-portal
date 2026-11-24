import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { SeasonProvider } from "@/contexts/SeasonContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProductsProvider } from "@/contexts/ProductsContext";

import { FloatingMessageButton } from "@/components/chat/FloatingMessageButton";
import { GlobalSeasonalFrame } from "@/components/seasonal/SeasonalArtwork";
import InstallPrompt from "@/components/InstallPrompt"; // ✅ IMPORT

import Index from "./pages/Index";
import About from "./pages/About";
import Story from "./pages/Story";
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

// ✅ Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// ✅ Redirect logged-in admins directly to /admin instead of customer pages
const AdminLandingRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;
    const allowedAdminPaths = ["/admin", "/profile", "/reset-password"];
    if (!allowedAdminPaths.includes(location.pathname)) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  return null;
};

// ✅ Floating button only for non-admin users
const FloatingButtonWrapper = () => {
  const { user } = useAuth();
  return user?.role !== "admin" ? <FloatingMessageButton /> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SeasonProvider>
          <ProductsProvider>
            <CartProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />

              <BrowserRouter>
                <ScrollToTop />
                <AdminLandingRedirect />
                <GlobalSeasonalFrame />

                {/* Floating button */}
                <FloatingButtonWrapper />

                {/* ✅ PWA Install Modal */}
                <InstallPrompt />

                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/story" element={<Story />} />
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
        </SeasonProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
