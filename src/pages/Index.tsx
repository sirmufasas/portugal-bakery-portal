import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TestimonialsPreview } from "@/components/home/TestimonialsPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Only show cart button if logged in */}
      {isAuthenticated && <FloatingCartButton />}
      
      <main>
        <HeroSection />
        <FeaturedProducts />
        <TestimonialsPreview />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
