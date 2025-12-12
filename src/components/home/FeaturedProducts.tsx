import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
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
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-neutral-950 dark:via-amber-950/20 dark:to-red-950/20 overflow-hidden">
      {/* Animated Christmas Lights - Top */}
      <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-around pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={`light-top-${i}`}
            className="w-3 h-3 rounded-full animate-pulse shadow-lg"
            style={{
              backgroundColor: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#22c55e' : '#fbbf24',
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s',
            }}
          />
        ))}
      </div>

      {/* Christmas Light Wire - Top */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-800/20 dark:bg-neutral-600/30 pointer-events-none z-0" />

      {/* Animated Christmas Lights - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-around pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={`light-bottom-${i}`}
            className="w-3 h-3 rounded-full animate-pulse shadow-lg"
            style={{
              backgroundColor: i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#fbbf24' : '#ef4444',
              animationDelay: `${i * 0.15}s`,
              animationDuration: '1.8s',
            }}
          />
        ))}
      </div>

      {/* Christmas Light Wire - Bottom */}
      <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-neutral-800/20 dark:bg-neutral-600/30 pointer-events-none z-0" />

      {/* Floating Snowflakes */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`snow-${i}`}
          className="absolute text-amber-200 dark:text-amber-400/30 pointer-events-none opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animation: `float ${Math.random() * 10 + 15}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          ❄
        </div>
      ))}

      {/* Decorative Christmas Trees - Left */}
      <div className="absolute left-4 top-1/4 hidden lg:block pointer-events-none opacity-40 dark:opacity-20">
        <div className="text-6xl">🎄</div>
      </div>
      <div className="absolute left-8 bottom-1/4 hidden lg:block pointer-events-none opacity-30 dark:opacity-15">
        <div className="text-5xl">🎄</div>
      </div>

      {/* Decorative Christmas Trees - Right */}
      <div className="absolute right-4 top-1/3 hidden lg:block pointer-events-none opacity-40 dark:opacity-20">
        <div className="text-6xl">🎄</div>
      </div>
      <div className="absolute right-8 bottom-1/3 hidden lg:block pointer-events-none opacity-30 dark:opacity-15">
        <div className="text-5xl">🎄</div>
      </div>

      {/* Ornaments Decorations */}
      <div className="absolute left-1/4 top-12 text-3xl opacity-50 dark:opacity-30 pointer-events-none" style={{ animation: 'swing 3s ease-in-out infinite', transformOrigin: 'top center' }}>🔴</div>
      <div className="absolute right-1/4 top-16 text-2xl opacity-50 dark:opacity-30 pointer-events-none" style={{ animation: 'swing 3s ease-in-out infinite', animationDelay: '0.5s', transformOrigin: 'top center' }}>🟡</div>
      <div className="absolute left-1/3 bottom-12 text-3xl opacity-50 dark:opacity-30 pointer-events-none" style={{ animation: 'swing 3s ease-in-out infinite', animationDelay: '1s', transformOrigin: 'top center' }}>🟢</div>
      <div className="absolute right-1/3 bottom-16 text-2xl opacity-50 dark:opacity-30 pointer-events-none" style={{ animation: 'swing 3s ease-in-out infinite', animationDelay: '1.5s', transformOrigin: 'top center' }}>🔴</div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Christmas Touch */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <span className="text-amber-600 dark:text-amber-500 font-medium text-sm tracking-wider uppercase">
              🎄 Holiday Specialties 🎄
            </span>
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Featured Products
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Discover our most beloved creations, baked fresh daily with holiday cheer ✨
          </p>
        </div>

        {/* Products Grid with Christmas Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up relative border-2 border-amber-200 dark:border-amber-900/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Christmas Ribbon Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none z-20">
                <div className="absolute top-2 right-2 w-20 h-6 bg-gradient-to-r from-red-500 to-red-600 transform rotate-45 origin-top-right shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold transform -rotate-45">SALE</span>
                  </div>
                </div>
              </div>

              {/* Sparkle Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`sparkle-${i}`}
                    className="absolute text-amber-400 animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.2}s`,
                      fontSize: '12px',
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>

              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                    {product.category}
                  </span>
                </div>

                {/* Christmas ornament on image */}
                <div className="absolute bottom-4 right-4 text-2xl opacity-70 group-hover:scale-125 transition-transform duration-300">
                  {index % 4 === 0 ? '🎁' : index % 4 === 1 ? '⭐' : index % 4 === 2 ? '🎅' : '🔔'}
                </div>
              </div>

              <div className="p-5 bg-gradient-to-b from-white to-amber-50/30 dark:from-neutral-900 dark:to-amber-950/10">
                <h3 className="font-heading font-semibold text-lg text-neutral-900 dark:text-neutral-50 mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 dark:text-amber-500 font-bold text-lg">
                    {product.price}
                  </span>
                  <Link to="/menu">
                    <Button
                      size="sm"
                      variant="outline"
                      className="
                                  border-amber-600 text-amber-600 
                                  hover:bg-amber-600 hover:text-white 
                                  dark:border-amber-500 dark:text-amber-500 
                                  dark:hover:bg-amber-500 dark:hover:text-white
                                "
                    >
                      Order
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA with Christmas Flair */}
        <div className="text-center mt-12 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-8 text-4xl pointer-events-none opacity-60 animate-bounce">
            ⭐
          </div>
          <Link to="/menu">
            <Button
              variant="default"
              size="lg"
              className="gap-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              View Full Menu
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}