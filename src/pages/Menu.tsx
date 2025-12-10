// src/pages/Menu.tsx - Updated with dropdown filter
import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, AlertTriangle, Scale, Flame, Search, Filter, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { categories } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";


const Menu = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { addToCart, totalItems } = useCart();
  const { products: allProducts } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();


  // Filter by category
  let filteredProducts = activeCategory === "All"
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  // Filter by search query
  if (searchQuery.trim()) {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.trim().toLowerCase().includes(normalizedQuery) ||
      p.description.trim().toLowerCase().includes(normalizedQuery) ||
      p.category.trim().toLowerCase().includes(normalizedQuery)
    );
  }

  // ✅ FIXED: Now converts 'image' to 'imageUrl' before adding to cart
  const handleAddToCart = (product) => {
    // CRITICAL: Check authentication first
    if (!user?._id) {
      toast({
        title: "Please log in",
        description: (
          <div className="flex flex-col gap-2">
            <p>You must be logged in to add items to your cart.</p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-primary text-white rounded px-3 py-1"
            >
              Go to Login
            </Button>
          </div>
        ),
        duration: 5000,
        variant: "destructive",
      });
      return;
    }

    // Convert 'image' to 'imageUrl' to match cart structure
    addToCart({
      ...product,
      imageUrl: product.image
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };


  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      setTimeout(() => {
        const normalizedQuery = value.trim().toLowerCase();
        const results = allProducts.filter(p =>
          p.name.trim().toLowerCase().includes(normalizedQuery) ||
          p.description.trim().toLowerCase().includes(normalizedQuery) ||
          p.category.trim().toLowerCase().includes(normalizedQuery)
        );

        if (results.length === 0) {
          toast({
            title: "Product not available",
            description: `No products found matching "${value.trim()}". Try a different search term.`,
            variant: "destructive",
          });
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background transition-colors duration-300">
      <Navbar />

      {/* Floating Cart Button */}
      <FloatingCartButton />

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div
            className="bg-white dark:bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-card border-b border-border p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-heading font-bold text-foreground">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image and Basic Info */}
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                        {selectedProduct.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-muted-foreground mb-4">{selectedProduct.description}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl font-bold text-primary">R{selectedProduct.price.toFixed(2)}</span>
                    {selectedProduct.weight && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Scale className="h-4 w-4" />
                        <span className="text-sm">{selectedProduct.weight}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Nutritional Info */}
              {selectedProduct.nutritionalInfo && (
                <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold text-foreground">Nutritional Information</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{selectedProduct.nutritionalInfo.calories}</div>
                      <div className="text-xs text-muted-foreground">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{selectedProduct.nutritionalInfo.protein}</div>
                      <div className="text-xs text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{selectedProduct.nutritionalInfo.carbs}</div>
                      <div className="text-xs text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{selectedProduct.nutritionalInfo.fat}</div>
                      <div className="text-xs text-muted-foreground">Fat</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.ingredients?.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-foreground text-sm rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              {selectedProduct.allergens && selectedProduct.allergens.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <h3 className="font-semibold text-red-900 dark:text-red-100">Allergen Information</h3>
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-200 mb-2">Contains:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 text-sm font-medium rounded-full"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Button
                size="sm"
                variant="default"
                className="text-xs px-3 py-1 h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(selectedProduct);
                }}
              >
                Add
              </Button>

            </div>
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

        {/* Search and Filter Bar */}
        <section className="py-6 bg-neutral-50 dark:bg-background border-b border-border sticky top-16 md:top-20 z-40 transition-colors duration-300">
          <div className="container mx-auto px-4">
            {/* Search Bar with Filter Button */}
            <div className="max-w-2xl mx-auto mb-0">
              <div className="flex gap-2">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground dark:text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-white dark:bg-card text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {/* Filter Dropdown Button */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 rounded-full border transition-all duration-300 shadow-sm whitespace-nowrap",
                      isFilterOpen
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white dark:bg-card text-foreground dark:text-foreground border-border hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    )}
                  >
                    <Filter className="h-5 w-5" />
                    <span className="hidden sm:inline font-medium">Filter</span>
                    {activeCategory !== "All" && (
                      <span className="bg-primary-foreground/20 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        1
                      </span>
                    )}
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isFilterOpen && "rotate-180")} />
                  </button>

                  {/* Dropdown Menu */}
                  {isFilterOpen && (
                    <>
                      {/* Backdrop for mobile */}
                      <div
                        className="fixed inset-0 z-40 md:hidden"
                        onClick={() => setIsFilterOpen(false)}
                      />

                      {/* Dropdown Content */}
                      <div className="absolute right-0 mt-2 w-screen max-w-xs sm:max-w-sm bg-white dark:bg-card rounded-2xl shadow-elevated border border-border p-4 z-50 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-foreground">Filter by Category</h3>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setActiveCategory(category);
                                setIsFilterOpen(false);
                              }}
                              className={cn(
                                "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 text-left",
                                activeCategory === category
                                  ? "bg-primary text-primary-foreground shadow-soft"
                                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span>{category}</span>
                                {category !== "All" && (
                                  <span className="text-xs opacity-70">
                                    {allProducts.filter(p => p.category === category).length}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>

                        {activeCategory !== "All" && (
                          <button
                            onClick={() => {
                              setActiveCategory("All");
                              setIsFilterOpen(false);
                            }}
                            className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                          >
                            Clear Filter
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 md:py-16 bg-neutral-50 dark:bg-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="mb-6 text-center">
              <p className="text-muted-foreground dark:text-muted-foreground">
                {searchQuery ? (
                  <>
                    Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </>
                ) : (
                  <>
                    Showing {filteredProducts.length} products • Click on any product for details
                  </>
                )}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground dark:text-foreground mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search or browse our categories.`
                    : "No products available in this category."
                  }
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group bg-white dark:bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${(index % 10) * 0.03}s` }}
                    onClick={() => handleProductClick(product)}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;