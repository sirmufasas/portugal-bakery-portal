import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Regular Customer",
    rating: 5,
    text: "The pastel de nata here is the best I've ever had! It takes me back to my grandmother's kitchen in Lisbon. Absolutely divine.",
    avatar: "MS",
  },
  {
    id: 2,
    name: "João Costa",
    role: "Food Blogger",
    rating: 5,
    text: "Portugal Bakery has become my go-to spot for authentic Portuguese pastries. The quality and freshness are unmatched in the city.",
    avatar: "JC",
  },
  {
    id: 3,
    name: "Ana Ferreira",
    role: "Local Resident",
    rating: 5,
    text: "I've been coming here for years. The sourdough bread is incredible, and the staff always remembers my order. A true neighborhood gem!",
    avatar: "AF",
  },
];

export function TestimonialsPreview() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
            What People Say
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Customer Love
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it — hear from our wonderful customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative bg-card rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/testimonials">
            <Button variant="outline" size="lg" className="gap-2">
              Read More Reviews
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
