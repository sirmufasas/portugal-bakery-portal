import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-bakery.jpg";
import logoImage from "@/assets/268fcf8f-7821-40a6-bd4b-029f7983a83d-removebg-preview (1).png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fresh baked goods at Portugal Bakery"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/70 to-transparent" />
      </div>

      {/* Logo in Top Right - Responsive */}
      <div className="absolute top-20 right-4 sm:top-24 sm:right-6 md:top-28 md:right-8 lg:top-32 lg:right-12 z-20 animate-fade-in">
        <img
          src={logoImage}
          alt="Portugal Bakery Logo"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
          style={{ imageRendering: '-webkit-optimize-contrast', backfaceVisibility: 'hidden' }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-2xl text-center sm:text-left">
          <span className="inline-block text-amber font-medium text-sm tracking-wider uppercase mb-4 animate-fade-in">
            Since 1985
          </span>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-cream leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Freshly Baked
            <span className="block text-amber">Every Morning</span>
          </h1>
          <p
            className="text-cream/80 text-lg md:text-xl leading-relaxed mb-8 max-w-lg animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Experience the warmth of traditional Portuguese baking. Artisan breads, pastries, and confections made with love and the finest ingredients.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Make Link take full width */}
            <Link to="/menu" className="w-full sm:w-auto">
              <Button variant="hero" size="xl" className="w-full flex items-center justify-center gap-2">
                Explore Our Menu
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/menu" className="w-full sm:w-auto">
              <Button
                variant="heroOutline"
                size="xl"
                className="w-full border border-amber text-white hover:bg-amber hover:text-cream 
dark:border-amber/70 dark:text-white dark:hover:bg-amber/80 dark:hover:text-cream"
              >
                Order Online
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}