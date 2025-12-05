import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Award, Users, Clock, MapPin, Phone, Mail } from "lucide-react";
import man from "@/assets/man.jpg";

const values = [
  { icon: Heart, title: "Made with Love", description: "Every product is crafted with passion and care, using recipes passed down through generations." },
  { icon: Award, title: "Quality First", description: "We source only the finest ingredients, from local flour mills to imported European butter." },
  { icon: Users, title: "Community Focused", description: "We're proud to be part of our local community, serving families for nearly four decades." },
  { icon: Clock, title: "Fresh Daily", description: "Everything is baked fresh each morning. We never sell day-old products." },
];

const businessHours = {
  monday: { open: "06:45", close: "16:00" }, tuesday: { open: "06:45", close: "16:00" },
  wednesday: { open: "06:45", close: "16:00" }, thursday: { open: "06:45", close: "16:00" },
  friday: { open: "06:45", close: "16:00" }, saturday: { open: "07:00", close: "14:00" },
  sunday: { closed: true },
};
const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const About = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      setCurrentTime(now);
      const dayName = dayNames[now.getDay()] as keyof typeof businessHours;
      const hours = businessHours[dayName];
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      if ('closed' in hours && hours.closed) {
        setIsOpen(false);
      } else if ('open' in hours) {
        const [openHour, openMin] = hours.open.split(":").map(Number);
        const [closeHour, closeMin] = hours.close.split(":").map(Number);
        setIsOpen(currentMinutes >= openHour * 60 + openMin && currentMinutes < closeHour * 60 + closeMin);
      }
    };
    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTodayHours = () => businessHours[dayNames[currentTime.getDay()] as keyof typeof businessHours];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background transition-colors duration-300">
      <Navbar />
      <main className="pt-20">

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={man} alt="Our bakery" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 dark:from-background via-neutral-50/95 dark:via-background/95 to-neutral-50 dark:to-background transition-colors duration-300" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">Our Story</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground dark:text-foreground mb-6 animate-fade-in-up">
                A Tradition of <span className="text-primary">Excellence</span>
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground text-lg md:text-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Since 1985, Portugal Bakery has been bringing the authentic flavors of Portuguese baking to our community.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 dark:from-background via-neutral-50/90 dark:via-background/90 to-neutral-50 dark:to-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground dark:text-foreground mb-6">From Lisbon to Your Table</h2>
                <div className="space-y-4 text-muted-foreground dark:text-muted-foreground leading-relaxed">
                  <p>Our founder, António Silva, brought his family's baking traditions from the cobblestone streets of Lisbon to establish Portugal Bakery in 1985.</p>
                  <p>Today, António's grandchildren continue the legacy, blending time-honored techniques with modern innovation. Every morning at 4 AM, our bakers begin their craft.</p>
                </div>
              </div>
              <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-elevated">
                  <img src={man} alt="Inside our bakery" className="w-full h-full object-cover" />
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
        <section className="py-16 md:py-24 bg-neutral-50 dark:bg-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">What We Stand For</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground dark:text-foreground mb-4">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={value.title} className="text-center p-6 rounded-2xl bg-white dark:bg-card shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground dark:text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visit Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 dark:from-background via-neutral-50/90 dark:via-background/90 to-neutral-50 dark:to-background transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">Visit Us</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground dark:text-foreground mb-4">Find Our Bakery</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="rounded-2xl overflow-hidden shadow-elevated h-[400px] lg:h-[775px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57257.96631214229!2d27.98293222167968!3d-26.24143999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950f02e6b43967%3A0xf5bc4c7e2ff0bd5a!2sPortugal%20Bakery%20%26%20Confectionary!5e0!3m2!1sen!2sza!4v1764687358269!5m2!1sen!2sza"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Portugal Bakery Location"
                />
              </div>

              <div className="space-y-6">
                {/* Open Status */}
                <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-soft transition-colors duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-4 h-4 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className={`text-2xl font-heading font-bold ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-muted-foreground dark:text-muted-foreground">
                    Today's hours: {'closed' in getTodayHours() ? 'Closed' : `${(getTodayHours() as { open: string; close: string }).open} - ${(getTodayHours() as { open: string; close: string }).close}`}
                  </p>
                </div>

                {/* Business Hours */}
                <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-soft transition-colors duration-300">
                  <h3 className="font-heading font-semibold text-lg text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />Business Hours
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(businessHours).map(([day, hours]) => (
                      <div key={day} className={`flex justify-between py-2 px-3 rounded-lg ${dayNames[currentTime.getDay()] === day ? 'bg-primary/10 font-medium' : ''}`}>
                        <span className="capitalize text-foreground dark:text-foreground">{day}</span>
                        <span className="text-muted-foreground dark:text-muted-foreground">{'closed' in hours ? 'Closed' : `${hours.open} - ${hours.close}`}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-soft transition-colors duration-300">
                  <h3 className="font-heading font-semibold text-lg text-foreground dark:text-foreground mb-4">Contact Us</h3>
                  <div className="space-y-3">
                    <a href="https://maps.app.goo.gl/BYKLVXfZ3LfyHZAt5" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground dark:text-muted-foreground hover:text-primary transition-colors">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" /><span>Portugal Bakery, Johannesburg</span>
                    </a>
                    <a href="tel:0114362396" className="flex items-center gap-3 text-muted-foreground dark:text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" /><span>0114362396</span>
                    </a>
                    <a href="mailto:info@portugalbakery.co.za" className="flex items-center gap-3 text-muted-foreground dark:text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" /><span>info@portugalbakery.co.za</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default About;
