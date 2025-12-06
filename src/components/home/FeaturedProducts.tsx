import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import breadImg from "@/assets/product-bread.jpg";
import cakeImg from "@/assets/product-cake.jpg";
import croissantImg from "@/assets/product-croissant.jpg";
import pastryImg from "@/assets/product-pastry.jpg";

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
    description: "Rich chocolate layers topped with fresh berries", // ✅ fixed
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
  return (
    <section className="py-20 md:py-28 bg-gradient-warm dark:bg-[#2a1a14] dark:bg-none">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
            Our Specialties
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground dark:text-foreground-dark mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground dark:text-muted-foreground-dark text-lg">
            Discover our most beloved creations, baked fresh daily using time-honored recipes
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-card dark:bg-card-dark rounded-2xl overflow-hidden shadow-soft dark:shadow-soft-dark hover:shadow-elevated dark:hover:shadow-elevated-dark transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
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
                <h3 className="font-heading font-semibold text-lg text-foreground dark:text-foreground-dark mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground-dark text-sm mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary dark:text-primary-dark font-bold text-lg">
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
            <Button variant="default" size="lg" className="gap-2">
              View Full Menu
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
