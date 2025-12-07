import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext"; // <- added
import { CartProvider } from "@/contexts/CartContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
// import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Testimonials from "./pages/Testimonials";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Order from "./pages/Order";
import TrackOrder from "./pages/TrackOrder";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider> {/* <- AuthProvider added here */}
        <ProductsProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/admin" element={<Admin />} />
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
