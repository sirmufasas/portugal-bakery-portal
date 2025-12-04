import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-espresso text-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-4">Portugal Bakery</h3>
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              Crafting artisan breads and pastries with love since 1985. 
              Every bite tells a story of tradition and passion.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-cream/70 hover:text-amber transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-cream/70 hover:text-amber transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-cream/70 hover:text-amber transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Our Menu", path: "/menu" },
                { name: "About Us", path: "/about" },
                { name: "Testimonials", path: "/testimonials" },
                { name: "Order Online", path: "/order" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-cream/70 hover:text-amber text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber shrink-0 mt-0.5" />
                <span className="text-cream/70 text-sm">
                  123 Bakery Street, Lisbon, Portugal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber shrink-0" />
                <span className="text-cream/70 text-sm">0114362396</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber shrink-0" />
                <span className="text-cream/70 text-sm">hello@portugalbakery.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-cream/90 font-medium">Monday - Friday</p>
                  <p className="text-cream/70">7:00 AM - 8:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-cream/90 font-medium">Saturday - Sunday</p>
                  <p className="text-cream/70">8:00 AM - 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-12 pt-8 text-center">
          <p className="text-cream/50 text-sm">
            © {new Date().getFullYear()} Portugal Bakery & Confectionary. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
