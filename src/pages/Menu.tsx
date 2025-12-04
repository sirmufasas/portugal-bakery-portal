import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { allProducts, categories } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const Menu = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart, updateQuantity, removeItem, total, totalItems } = useCart();

  const filteredProducts = activeCategory === "All"
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  const handleAddToCart = (product: typeof allProducts[0]) => {
    addToCart(product);
    toast({ 
      title: "Added to cart", 
      description: `${product.name} has been added to your cart.` 
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background transition-colors duration-300">
      <Navbar />
      
      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(!showCart)}
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="font-bold">{totalItems}</span>
          <span className="hidden sm:inline ml-2">R{total.toFixed(2)}</span>
        </button>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowCart(false)}>
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-card shadow-2xl p-6 overflow-y-auto transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground dark:text-foreground">Your Cart</h2>
              <Button variant="ghost" onClick={() => setShowCart(false)}>Close</Button>
            </div>

            {cart.length === 0 ? (
              <p className="text-muted-foreground dark:text-muted-foreground text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 bg-neutral-50 dark:bg-card rounded-lg p-3 transition-colors duration-300">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground dark:text-foreground text-sm">{item.name}</h3>
                        <p className="text-primary font-bold text-sm">R{item.price.toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="flex items-center justify-center w-8 text-sm font-medium">{item.quantity}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 ml-auto" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground dark:text-foreground">R{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total</span>
                    <span className="text-primary">R{total.toFixed(2)}</span>
                  </div>
                  <Link to="/order">
                    <Button variant="default" size="lg" className="w-full">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <main className="pt-20">
        {/* Header */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 dark:from-background via-neutral-50/90 dark:via-background/90 to-neutral-50 dark:to-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
                Our Menu
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground dark:text-foreground mb-4 animate-fade-in-up">
                Freshly Baked Goods
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Browse our selection of {allProducts.length}+ artisan products including pastries, breads, cakes, and more.
              </p>
              <div className="mt-6">
                <Link to="/order">
                  <Button variant="default" size="lg" className="gap-2 relative">
                    <ShoppingBag className="h-4 w-4" />
                    Order Now
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 bg-neutral-50 dark:bg-background border-b border-border sticky top-16 md:top-20 z-40 transition-colors duration-300">
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
        <section className="py-12 md:py-16 bg-neutral-50 dark:bg-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="mb-6 text-center">
              <p className="text-muted-foreground dark:text-muted-foreground">
                Showing {filteredProducts.length} products
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 animate-fade-in-up"
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
                    <h3 className="font-heading font-semibold text-sm md:text-base text-foreground dark:text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground dark:text-muted-foreground text-xs mb-2 line-clamp-2 hidden sm:block">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-sm md:text-base">
                        R{product.price.toFixed(2)}
                      </span>
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="text-xs px-3 py-1 h-7"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
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
