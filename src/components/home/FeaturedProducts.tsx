import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Sun, Flame, Leaf } from "lucide-react";
import breadImg from "@/assets/product-bread.jpg";
import cakeImg from "@/assets/product-cake.jpg";
import croissantImg from "@/assets/product-croissant.jpg";
import pastryImg from "@/assets/product-pastry.jpg";
import { AMBIENT_POSITIONS, getCurrentSASeason, SASeasonId } from "@/utils/seasons";

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

function SeasonIcon({ seasonId, className }: { seasonId: SASeasonId; className?: string }) {
  switch (seasonId) {
    case "spring":
    case "summer":
      return <Sun className={className} />;
    case "autumn":
      return <Leaf className={className} />;
    case "winter":
      return <Flame className={className} />;
    case "festive_summer":
    default:
      return <Sparkles className={className} />;
  }
}

export function FeaturedProducts() {
  const season = getCurrentSASeason();

  return (
    <section className={`relative py-20 md:py-28 overflow-hidden ${season.sectionBgClass}`}>
      {/* Warm Golden Fairy Lights — shown automatically only during Sunny SA Festive Season (Dec 10–31) */}
      {season.showFestiveLights && (
        <>
          <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-around pointer-events-none z-10">
            {[...Array(18)].map((_, i) => (
              <div
                key={`festive-light-${i}`}
                className="w-2.5 h-2.5 rounded-full animate-pulse shadow-md"
                style={{
                  backgroundColor: i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#ef4444" : "#eab308",
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.8s",
                }}
              />
            ))}
          </div>
          <div className="absolute top-4 left-0 right-0 h-px bg-amber-900/15 dark:bg-amber-400/20 pointer-events-none z-0" />
        </>
      )}

      {/* Subtle Deterministic Seasonal Ambient Accents */}
      {AMBIENT_POSITIONS.map((pos, i) => (
        <div
          key={`ambient-${i}`}
          className="absolute text-amber-500/25 dark:text-amber-400/15 pointer-events-none select-none"
          style={{
            left: pos.left,
            top: pos.top,
            fontSize: `${pos.size}px`,
            animation: `float ${pos.duration}s ease-in-out infinite`,
            animationDelay: `${pos.delay}s`,
          }}
        >
          {season.particleSymbols[i % season.particleSymbols.length]}
        </div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Dynamic South African Seasonal Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-neutral-900/70 border border-amber-200/70 dark:border-amber-800/40 shadow-sm mb-4">
            <SeasonIcon seasonId={season.id} className={`h-4 w-4 ${season.accentTextClass}`} />
            <span className={`${season.accentTextClass} font-semibold text-xs tracking-wider uppercase`}>
              {season.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            {season.heading}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            {season.subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in-up relative border ${season.cardBorderClass}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Seasonal Corner Badge */}
              <div className="absolute top-3 right-3 z-20 pointer-events-none">
                <span
                  className={`inline-block bg-gradient-to-r ${season.ribbonGradientClass} text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md`}
                >
                  {season.cardRibbon}
                </span>
              </div>

              <div className={`relative aspect-square overflow-hidden ${season.imageBgClass}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className={`${season.categoryPillClass} text-xs font-medium px-3 py-1 rounded-full shadow-md`}>
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-b from-white to-amber-50/20 dark:from-neutral-900 dark:to-amber-950/10">
                <h3 className="font-heading font-semibold text-lg text-neutral-900 dark:text-neutral-50 mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`${season.accentTextClass} font-bold text-lg`}>
                    {product.price}
                  </span>
                  <Link to="/menu">
                    <Button
                      size="sm"
                      variant="outline"
                      className={season.orderBtnClass}
                    >
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
            <Button
              variant="default"
              size="lg"
              className={`gap-2 shadow-lg hover:shadow-xl transition-all duration-300 group ${season.ctaBtnClass}`}
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
