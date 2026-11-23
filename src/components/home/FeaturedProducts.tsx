import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import breadImg from "@/assets/product-bread.jpg";
import cakeImg from "@/assets/product-cake.jpg";
import croissantImg from "@/assets/product-croissant.jpg";
import pastryImg from "@/assets/product-pastry.jpg";
import { useSeason } from "@/contexts/SeasonContext";
import { SeasonalSectionBackdrop, SeasonSymbolIcon } from "@/components/seasonal/SeasonalArtwork";

const products = [
  {
    id: 1,
    name: "Artisan Sourdough",
    category: "Breads",
    price: "R4.50",
    image: breadImg,
    description: "Traditional sourdough with a perfect golden crust",
  },
  {
    id: 2,
    name: "Chocolate Ganache Cake",
    category: "Cakes",
    price: "R28.00",
    image: cakeImg,
    description: "Rich chocolate layers topped with fresh berries",
  },
  {
    id: 3,
    name: "Butter Croissant",
    category: "Pastries",
    price: "R2.80",
    image: croissantImg,
    description: "Flaky, buttery layers of French perfection",
  },
  {
    id: 4,
    name: "Pastel de Nata",
    category: "Confections",
    price: "R1.50",
    image: pastryImg,
    description: "Iconic Portuguese custard tarts",
  },
];

export function FeaturedProducts() {
  const { season } = useSeason();

  return (
    <section
      className={`relative py-20 md:py-28 overflow-hidden transition-colors duration-500 ${season.sectionSurfaceClass}`}
    >
      {/* Bespoke Botanical & Seasonal Vector Artwork Backdrop */}
      <SeasonalSectionBackdrop seasonId={season.id} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Seasonal Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-card/85 backdrop-blur-sm border border-primary/25 shadow-sm mb-4">
            <SeasonSymbolIcon seasonId={season.id} className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold text-xs tracking-wider uppercase">
              {season.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            {season.heading}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {season.subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 animate-fade-in-up relative border border-primary/15 hover:border-primary/40"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Seasonal Pill Badge */}
              <div className="absolute top-3 right-3 z-20 pointer-events-none">
                <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
                  <SeasonSymbolIcon seasonId={season.id} className="h-3 w-3" />
                  {season.cardRibbon}
                </span>
              </div>

              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-background/90 backdrop-blur-sm text-foreground border border-border text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-heading font-semibold text-lg text-card-foreground mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">
                    {product.price}
                  </span>
                  <Link to="/menu">
                    <Button size="sm" variant="outline">
                      Order
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/menu">
            <Button variant="default" size="lg" className="gap-2 group">
              View Full Menu
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
