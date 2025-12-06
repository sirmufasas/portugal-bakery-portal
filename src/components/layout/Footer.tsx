import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import LionImage from "@/assets/lion.png";

export function Footer() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <footer className="bg-espresso text-cream relative">
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
                  Portugal Bakery, Johannesburg
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
          <div className="relative">
            <h4 className="text-lg font-heading font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-cream/90 font-medium">Monday - Friday</p>
                  <p className="text-cream/70">6:45 AM - 4:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-cream/90 font-medium">Saturday</p>
                  <p className="text-cream/70">6:45 AM - 2:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-cream/90 font-medium">Sunday</p>
                  <p className="text-cream/70">Closed</p>
                </div>
              </li>
            </ul>

            {/* Lion mobile version */}
            <img
              src={LionImage}
              alt="Lion"
              className="
                absolute top-1/2 -translate-y-1/2 right-0
                w-16 h-16 object-contain cursor-pointer 
                transition-transform duration-300 hover:scale-110
                shadow-[0_0_10px_3px_rgba(255,255,255,0.6)]
                rounded-full
                md:hidden
              "
              onClick={() => setOpenMenu(true)}
            />
          </div>
        </div>

        {/* Lion desktop version */}
        <div className="hidden md:block absolute top-5 right-1">
          <img
            src={LionImage}
            alt="Lion"
            className="
              w-20 h-20 lg:w-24 lg:h-24 object-contain cursor-pointer
              transition-transform duration-300 hover:scale-110
              shadow-[0_0_10px_3px_rgba(255,255,255,0.6)]
              rounded-full
            "
            onClick={() => setOpenMenu(true)}
          />
        </div>

        {/* Footer bottom */}
        <div className="border-t border-cream/10 mt-12 pt-8 text-center relative">
          <p className="text-cream/50 text-sm">
            © {new Date().getFullYear()} Portugal Bakery & Confectionary. All rights reserved.
          </p>
        </div>

        {/* Popup Modal */}
        {openMenu && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setOpenMenu(false)}
          >
            <div
              className="bg-cream text-espresso rounded-xl shadow-2xl w-full max-w-xs p-6 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Contact Developer</h2>
              <a
                href="https://www.instagram.com/sir.mufasa_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-6 py-2 mb-3 bg-amber rounded-lg hover:bg-amber/80 transition-colors font-semibold"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/27763670861"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                WhatsApp
              </a>
              <button
                onClick={() => setOpenMenu(false)}
                className="mt-4 text-sm text-espresso/70 hover:text-espresso transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
