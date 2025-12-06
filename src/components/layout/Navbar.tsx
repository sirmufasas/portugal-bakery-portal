import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Shield, Package, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "About", path: "/about" },
  { name: "Testimonials", path: "/testimonials" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openContact, setOpenContact] = useState(false); // New: Contact Modal
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen || openContact ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, openContact]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border transition-colors duration-300",
        "bg-background"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-heading font-bold text-primary leading-none">
                Portugal
              </span>
              <span className="text-[10px] md:text-xs font-body text-muted-foreground tracking-wider">
                BAKERY & CONFECTIONARY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className={cn("w-48 border border-border shadow-lg z-50", "bg-background text-foreground")}
              >
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/login" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/track-order" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Track Order
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Contact Developer */}
                <DropdownMenuItem
                  className="cursor-pointer flex items-center gap-2"
                  onClick={() => setOpenContact(true)}
                >
                  <User className="h-4 w-4" />
                  Contact Developer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button className="p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={cn(
            "fixed inset-0 top-16 z-40 md:hidden transition-all duration-300 ease-in-out border-t border-border",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none",
            "bg-background text-foreground"
          )}
        >
          <div
            className={cn(
              "flex flex-col h-full p-6 transition-transform duration-300 ease-in-out",
              isOpen ? "translate-y-0" : "-translate-y-4"
            )}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted/30",
                    location.pathname === link.path ? "text-primary bg-primary/20" : "text-foreground"
                  )}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateX(0)" : "translateX(-10px)",
                  }}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/track-order"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-muted/30 flex items-center gap-2"
              >
                <Package className="h-5 w-5" />
                Track Order
              </Link>

              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-muted/30 flex items-center gap-2"
              >
                <Shield className="h-5 w-5" />
                Admin Dashboard
              </Link>

              {/* Contact Developer for Mobile */}
              <button
                onClick={() => {
                  setOpenContact(true);
                  setIsOpen(false);
                }}
                className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-muted/30 flex items-center gap-2"
              >
                <User className="h-5 w-5" />
                Contact Developer
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-border">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-12 text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Developer Modal */}
        {openContact && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setOpenContact(false)}
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
                onClick={() => setOpenContact(false)}
                className="mt-4 text-sm text-espresso/70 hover:text-espresso transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
