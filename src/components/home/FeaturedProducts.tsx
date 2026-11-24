import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useSeason } from "@/contexts/SeasonContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  SeasonalSectionBackdrop,
  SeasonSymbolIcon,
} from "@/components/seasonal/SeasonalArtwork";
import { allProducts } from "@/data/products";

export function FeaturedProducts() {
  const { season } = useSeason();
  const { products: liveProducts } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const sourceList =
    liveProducts && liveProducts.length >= 4 ? liveProducts : allProducts;
  const featured = sourceList.slice(0, 4);

  const handleQuickAdd = (product: (typeof featured)[number]) => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    addToCart({
      id: Number(product.id),
      name: product.name,
      price: Number(product.price),
      imageUrl: product.image,
    });
    toast({
      title: "Added to basket",
      description: `${product.name} added to your order.`,
      duration: 2000,
    });
  };

  return (
    <section
      className={`relative py-20 md:py-28 overflow-hidden transition-colors duration-500 ${season.sectionSurfaceClass}`}
    >
      {/* Bespoke Botanical & South African Event Vector Artwork Backdrop */}
      <SeasonalSectionBackdrop seasonId={season.id} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Seasonal / SA Event Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-card/85 backdrop-blur-sm border border-primary/25 shadow-sm mb-4">
            <SeasonSymbolIcon
              seasonId={season.id}
              className="h-4 w-4 text-primary"
            />
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
          {featured.map((product, index) => (
            <div
              key={product.id}
              className="group bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 animate-fade-in-up relative border border-primary/15 hover:border-primary/40 flex flex-col"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Seasonal / Event Pill Badge */}
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

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-lg text-card-foreground mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2">
                  <span className="text-primary font-bold text-lg">
                    R{Number(product.price).toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAdd(product)}
                    className="gap-1.5"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Add to Order
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link to="/menu">
            <Button variant="default" size="lg" className="group">
              Explore Full Bakery Menu
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
