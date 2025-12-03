import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { allProducts, categories } from "@/data/products";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All"
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-16 md:py-24 bg-gradient-warm">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
                Our Menu
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 animate-fade-in-up">
                Freshly Baked Goods
              </h1>
              <p className="text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Browse our selection of {allProducts.length}+ artisan products including pastries, breads, cakes, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 bg-background border-b border-border sticky top-16 md:top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {category}
                  {category !== "All" && (
                    <span className="ml-1 text-xs opacity-70">
                      ({allProducts.filter(p => p.category === category).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-6 text-center">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} products
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${(index % 10) * 0.03}s` }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary/90 text-primary-foreground text-[10px] font-medium px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-heading font-semibold text-sm md:text-base text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-xs mb-2 line-clamp-2 hidden sm:block">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-sm md:text-base">
                        €{product.price.toFixed(2)}
                      </span>
                      <Link to="/order">
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-7">
                          Order
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
