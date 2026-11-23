import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Phone } from "lucide-react";
import { useSeason } from "@/contexts/SeasonContext";
import { SeasonSymbolIcon } from "@/components/seasonal/SeasonalArtwork";

export function CTASection() {
  const { season } = useSeason();

  return (
    <section className="py-20 md:py-28 bg-primary relative overflow-hidden transition-colors duration-500">
      {/* Soft Seasonal Glows */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cream rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber rounded-full blur-3xl" />
      </div>

      {/* Subtle Large Watermark Seasonal Emblem */}
      <div className="absolute -right-10 -bottom-10 opacity-10 text-primary-foreground pointer-events-none">
        <SeasonSymbolIcon seasonId={season.id} className="w-64 h-64" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/15 text-primary-foreground text-xs font-medium tracking-wider uppercase mb-5">
            <SeasonSymbolIcon seasonId={season.id} className="h-3.5 w-3.5" />
            {season.name}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-6">
            Ready to Taste the Difference?
          </h2>
          <p className="text-primary-foreground/85 text-lg md:text-xl mb-8 leading-relaxed">
            Order online for pickup or delivery across Gauteng, or give us a call to place a custom order
            for your special occasions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order">
              <Button
                variant="secondary"
                size="xl"
                className="w-full sm:w-auto gap-2 font-semibold"
              >
                <ShoppingBag className="h-5 w-5" />
                Order Online
              </Button>
            </Link>
            <a href="tel:0114362396">
              <Button
                variant="heroOutline"
                size="xl"
                className="w-full sm:w-auto gap-2"
              >
                <Phone className="h-5 w-5" />
                Call Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
