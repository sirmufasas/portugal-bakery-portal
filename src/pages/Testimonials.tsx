import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, Quote, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const allTestimonials = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Regular Customer",
    rating: 5,
    text: "The pastel de nata here is the best I've ever had! It takes me back to my grandmother's kitchen in Lisbon. Absolutely divine.",
    avatar: "MS",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "João Costa",
    role: "Food Blogger",
    rating: 5,
    text: "Portugal Bakery has become my go-to spot for authentic Portuguese pastries. The quality and freshness are unmatched in the city.",
    avatar: "JC",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Ana Ferreira",
    role: "Local Resident",
    rating: 5,
    text: "I've been coming here for years. The sourdough bread is incredible, and the staff always remembers my order. A true neighborhood gem!",
    avatar: "AF",
    date: "2 weeks ago",
  },
  {
    id: 4,
    name: "Pedro Oliveira",
    role: "Chef",
    rating: 5,
    text: "As a professional chef, I appreciate the attention to detail here. The croissants are perfectly laminated, and the flavors are authentic.",
    avatar: "PO",
    date: "3 weeks ago",
  },
  {
    id: 5,
    name: "Sofia Martins",
    role: "Wedding Planner",
    rating: 5,
    text: "We ordered a custom cake for a wedding and it exceeded all expectations. Beautiful presentation and even better taste!",
    avatar: "SM",
    date: "1 month ago",
  },
  {
    id: 6,
    name: "Carlos Mendes",
    role: "Coffee Enthusiast",
    rating: 4,
    text: "Great pastries to pair with my morning coffee. The almond croissant is my favorite. Wish they had more seating though!",
    avatar: "CM",
    date: "1 month ago",
  },
];

const Testimonials = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !review.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and review.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Thank you!",
      description: "Your review has been submitted for approval.",
    });
    setName("");
    setReview("");
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background transition-colors duration-300">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 dark:from-background via-neutral-50/90 dark:via-background/90 to-neutral-50 dark:to-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
                Reviews
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground dark:text-foreground mb-4 animate-fade-in-up">
                What Our Customers Say
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Real stories from our wonderful community of bread and pastry lovers.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-12 md:py-16 bg-neutral-50 dark:bg-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {allTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="relative bg-white dark:bg-card rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? "fill-gold text-gold"
                            : "text-muted dark:text-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-foreground/80 dark:text-foreground/80 leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground dark:text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground dark:text-muted-foreground">{testimonial.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Write Review Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-neutral-50 dark:from-background via-neutral-50/90 dark:via-background/90 to-neutral-50 dark:to-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground dark:text-foreground mb-2">
                  Share Your Experience
                </h2>
                <p className="text-muted-foreground dark:text-muted-foreground">
                  We'd love to hear about your visit to Portugal Bakery!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white dark:bg-card rounded-2xl p-6 md:p-8 shadow-soft transition-colors duration-300">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-neutral-50 dark:bg-background text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${
                              star <= rating
                                ? "fill-gold text-gold"
                                : "text-muted dark:text-muted hover:text-gold"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-neutral-50 dark:bg-background text-foreground dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-colors duration-300"
                      placeholder="Tell us about your experience..."
                    />
                  </div>

                  <Button type="submit" variant="default" size="lg" className="w-full">
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;
