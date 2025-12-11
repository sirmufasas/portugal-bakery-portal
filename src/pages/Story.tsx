import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Users, Sparkles, HandHeart } from "lucide-react";
import man from "@/assets/man.jpg";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";

const reasons = [
  { 
    icon: Heart, 
    title: "Compassion in Action", 
    description: "We believe that no one should go hungry. Every day, we see the faces of those struggling, and we're committed to making a difference one meal at a time." 
  },
  { 
    icon: Users, 
    title: "Community Responsibility", 
    description: "As a business blessed by this community for nearly 40 years, we feel it's our duty to give back and support those who need it most." 
  },
  { 
    icon: Sparkles, 
    title: "Hope & Dignity", 
    description: "Beyond feeding bodies, we aim to restore hope. Every person deserves to be treated with dignity and respect, regardless of their circumstances." 
  },
  { 
    icon: HandHeart, 
    title: "Building Together", 
    description: "We're not just a bakery—we're part of a larger movement to create a more caring, compassionate community where everyone has access to basic needs." 
  },
];

const Story = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background transition-colors duration-300">
      <Navbar />
      <FloatingCartButton />
      <main className="pt-20">

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 dark:from-background via-neutral-50/95 dark:via-background/95 to-neutral-50 dark:to-background transition-colors duration-300" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">Our Story</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground dark:text-foreground mb-6 animate-fade-in-up">
                Feeding <span className="text-primary">Hearts & Souls</span>
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground text-lg md:text-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                At Portugal Bakery, we believe in using our blessings to bless others. Our commitment to serving the homeless and needy is at the heart of who we are.
              </p>
            </div>
          </div>
        </section>

        {/* From Lisbon to Your Table Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 dark:from-background via-neutral-50/90 dark:via-background/90 to-neutral-50 dark:to-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground dark:text-foreground mb-6">From Lisbon to Your Table</h2>
                <div className="space-y-4 text-muted-foreground dark:text-muted-foreground leading-relaxed">
                  <p>Our founder, António Silva, brought his family's baking traditions from the cobblestone streets of Lisbon to establish Portugal Bakery in 1985.</p>
                  <p>Today, António's grandchildren continue the legacy, blending time-honored techniques with modern innovation. Every morning at 4 AM, our bakers begin their craft, ensuring that each product meets the exacting standards set nearly four decades ago.</p>
                  <p>From our signature Pastéis de Nata to our artisanal sourdough loaves, every item tells a story of tradition, quality, and the warmth of Portuguese hospitality.</p>
                </div>
              </div>
              <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-elevated">
                  <img src={man} alt="António Silva, our founder" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-elevated">
                  <p className="text-4xl font-heading font-bold">38+</p>
                  <p className="text-sm opacity-90">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Heart for Service Section */}
        <section className="py-16 md:py-24 bg-neutral-50 dark:bg-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground dark:text-foreground mb-6">A Heart for Service</h2>
              </div>
              <div className="space-y-4 text-muted-foreground dark:text-muted-foreground leading-relaxed text-lg">
                <p>António Silva didn't just bring his baking expertise from Lisbon—he brought a deep commitment to community service that was instilled in him by his own parents who fed the poor in their neighborhood.</p>
                <p>From our very first year in 1985, we've dedicated a portion of our daily production to feeding those in need. What started as a few loaves of bread given to local shelters has grown into a comprehensive outreach program.</p>
                <p>Today, António's vision continues through his grandchildren and our entire team, who wake up each morning knowing that the bread they bake will bring hope to someone's day.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Do It */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 dark:from-background via-neutral-50/90 dark:via-background/90 to-neutral-50 dark:to-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">Our Motivation</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground dark:text-foreground mb-4">Why We Help</h2>
              <p className="text-muted-foreground dark:text-muted-foreground">These are the principles that drive our community outreach every single day.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reasons.map((reason, index) => (
                <div key={reason.title} className="p-8 rounded-2xl bg-white dark:bg-card shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <reason.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-foreground dark:text-foreground mb-3">{reason.title}</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section with Images */}
        <section className="py-16 md:py-24 bg-neutral-50 dark:bg-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">Making a Difference</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground dark:text-foreground mb-4">Our Community Impact</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Image 1 - Distributing Food */}
              <div className="rounded-2xl overflow-hidden shadow-elevated animate-fade-in-up">
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop" 
                  alt="Volunteers distributing fresh bread to those in need" 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6 bg-white dark:bg-card">
                  <h3 className="font-heading font-semibold text-lg text-foreground dark:text-foreground mb-2">Daily Bread Distribution</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground text-sm">Every morning, we distribute fresh bread and pastries to local shelters and soup kitchens.</p>
                </div>
              </div>

              {/* Image 2 - Serving Meals */}
              <div className="rounded-2xl overflow-hidden shadow-elevated animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop" 
                  alt="Team members serving meals with compassion" 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6 bg-white dark:bg-card">
                  <h3 className="font-heading font-semibold text-lg text-foreground dark:text-foreground mb-2">Community Meals</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground text-sm">Weekly community meals where everyone is welcome, served with dignity and respect.</p>
                </div>
              </div>

              {/* Image 3 - Hope & Smiles */}
              <div className="rounded-2xl overflow-hidden shadow-elevated animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <img 
                  src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop" 
                  alt="Bringing smiles and hope through food" 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6 bg-white dark:bg-card">
                  <h3 className="font-heading font-semibold text-lg text-foreground dark:text-foreground mb-2">Spreading Joy</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground text-sm">More than food—we bring warmth, conversation, and a reminder that someone cares.</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white dark:bg-card rounded-2xl shadow-soft">
                <p className="text-5xl font-heading font-bold text-primary mb-2">5,000+</p>
                <p className="text-muted-foreground dark:text-muted-foreground">Meals Served Monthly</p>
              </div>
              <div className="text-center p-8 bg-white dark:bg-card rounded-2xl shadow-soft">
                <p className="text-5xl font-heading font-bold text-primary mb-2">15+</p>
                <p className="text-muted-foreground dark:text-muted-foreground">Partner Organizations</p>
              </div>
              <div className="text-center p-8 bg-white dark:bg-card rounded-2xl shadow-soft">
                <p className="text-5xl font-heading font-bold text-primary mb-2">38</p>
                <p className="text-muted-foreground dark:text-muted-foreground">Years of Service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground dark:text-foreground mb-6">Join Us in Making a Difference</h2>
              <p className="text-muted-foreground dark:text-muted-foreground text-lg mb-8">
                Whether through donations, volunteering, or simply spreading the word, you can help us continue this mission of compassion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:0114362396" className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-elevated">
                  Contact Us to Help
                </a>
                <a href="/menu" className="px-8 py-4 bg-white dark:bg-card text-foreground dark:text-foreground rounded-lg font-semibold hover:bg-neutral-100 dark:hover:bg-card/80 transition-colors shadow-soft border border-border">
                  Support Through Purchase
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Story;