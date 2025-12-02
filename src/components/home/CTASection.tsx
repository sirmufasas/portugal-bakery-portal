import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cream rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground mb-6">
            Ready to Taste the Difference?
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 leading-relaxed">
            Order online for pickup or delivery, or give us a call to place a custom order 
            for your special occasions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/order">
              <Button
                variant="secondary"
                size="xl"
                className="w-full sm:w-auto gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Order Online
              </Button>
            </Link>
            <a href="tel:+351123456789">
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
