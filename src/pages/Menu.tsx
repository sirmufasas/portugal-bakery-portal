import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import breadImg from "@/assets/product-bread.jpg";
import cakeImg from "@/assets/product-cake.jpg";
import croissantImg from "@/assets/product-croissant.jpg";
import pastryImg from "@/assets/product-pastry.jpg";

const categories = ["All", "Breads", "Pastries", "Cakes", "Confections"];

const allProducts = [
  // Breads
  { id: 1, name: "Artisan Sourdough", category: "Breads", price: "€4.50", image: breadImg, description: "Traditional sourdough with a perfect golden crust" },
  { id: 2, name: "Portuguese Broa", category: "Breads", price: "€3.80", image: breadImg, description: "Traditional cornbread with rustic texture" },
  { id: 3, name: "Whole Wheat Loaf", category: "Breads", price: "€4.00", image: breadImg, description: "Healthy and hearty whole grain bread" },
  { id: 4, name: "Focaccia", category: "Breads", price: "€5.50", image: breadImg, description: "Italian-style with herbs and olive oil" },
  // Pastries
  { id: 5, name: "Butter Croissant", category: "Pastries", price: "€2.80", image: croissantImg, description: "Flaky, buttery layers of French perfection" },
  { id: 6, name: "Pain au Chocolat", category: "Pastries", price: "€3.20", image: croissantImg, description: "Chocolate-filled croissant pastry" },
  { id: 7, name: "Almond Croissant", category: "Pastries", price: "€3.50", image: croissantImg, description: "Filled with almond cream and topped with slices" },
  { id: 8, name: "Danish Pastry", category: "Pastries", price: "€3.00", image: croissantImg, description: "Sweet pastry with fruit or cream" },
  // Cakes
  { id: 9, name: "Chocolate Ganache Cake", category: "Cakes", price: "€28.00", image: cakeImg, description: "Rich chocolate layers topped with fresh berries" },
  { id: 10, name: "Bolo de Bolacha", category: "Cakes", price: "€24.00", image: cakeImg, description: "Traditional Portuguese biscuit cake" },
  { id: 11, name: "Red Velvet Cake", category: "Cakes", price: "€30.00", image: cakeImg, description: "Classic red velvet with cream cheese frosting" },
  { id: 12, name: "Lemon Drizzle Cake", category: "Cakes", price: "€22.00", image: cakeImg, description: "Light and tangy with lemon glaze" },
  // Confections
  { id: 13, name: "Pastel de Nata", category: "Confections", price: "€1.50", image: pastryImg, description: "Iconic Portuguese custard tarts" },
  { id: 14, name: "Queijada de Sintra", category: "Confections", price: "€1.80", image: pastryImg, description: "Traditional cheese pastry from Sintra" },
  { id: 15, name: "Travesseiro", category: "Confections", price: "€2.20", image: pastryImg, description: "Puff pastry with egg and almond cream" },
  { id: 16, name: "Bola de Berlim", category: "Confections", price: "€1.60", image: pastryImg, description: "Portuguese doughnut with custard" },
];

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
                Browse our selection of artisan breads, pastries, cakes, and traditional Portuguese confections.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-background border-b border-border sticky top-16 md:top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
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
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${(index % 8) * 0.05}s` }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-lg">
                        {product.price}
                      </span>
                      <Link to="/order">
                        <Button size="sm" variant="outline">
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
