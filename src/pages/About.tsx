import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Award, Users, Clock } from "lucide-react";
import heroImage from "@/assets/hero-bakery.jpg";

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every product is crafted with passion and care, using recipes passed down through generations.",
  },
  {
    icon: Award,
    title: "Quality First",
    description: "We source only the finest ingredients, from local flour mills to imported European butter.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description: "We're proud to be part of our local community, serving families for nearly four decades.",
  },
  {
    icon: Clock,
    title: "Fresh Daily",
    description: "Everything is baked fresh each morning. We never sell day-old products.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Our bakery"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
                Our Story
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 animate-fade-in-up">
                A Tradition of
                <span className="text-primary"> Excellence</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Since 1985, Portugal Bakery has been bringing the authentic flavors 
                of Portuguese baking to our community.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 bg-gradient-warm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                  From Lisbon to Your Table
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Our founder, António Silva, brought his family's baking traditions from 
                    the cobblestone streets of Lisbon to establish Portugal Bakery in 1985. 
                    What started as a small corner shop has grown into a beloved institution.
                  </p>
                  <p>
                    Today, António's grandchildren continue the legacy, blending time-honored 
                    techniques with modern innovation. Every morning at 4 AM, our bakers begin 
                    their craft, ensuring that by the time you arrive, the bread is still warm 
                    from the oven.
                  </p>
                  <p>
                    We take pride in our pastel de nata, made using a secret family recipe that 
                    has never been written down — only passed from generation to generation 
                    through practice and patience.
                  </p>
                </div>
              </div>
              <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-elevated">
                  <img
                    src={heroImage}
                    alt="Inside our bakery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-elevated">
                  <p className="text-4xl font-heading font-bold">38+</p>
                  <p className="text-sm opacity-90">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
                What We Stand For
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground text-lg">
                These principles guide everything we do, from ingredient selection to customer service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="text-center p-6 rounded-2xl bg-card shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
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

export default About;
