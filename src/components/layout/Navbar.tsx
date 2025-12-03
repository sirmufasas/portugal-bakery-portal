import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Shield, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "About", path: "/about" },
  { name: "Testimonials", path: "/testimonials" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <svg viewBox="0 0 40 40" className="w-10 h-10 text-primary">
                {/* Croissant shape */}
                <path
                  d="M20 5 C10 5 5 15 5 20 C5 25 10 30 15 32 L20 28 L25 32 C30 30 35 25 35 20 C35 15 30 5 20 5"
                  fill="currentColor"
                  opacity="0.9"
                />
                <path
                  d="M12 15 Q20 10 28 15 Q25 20 20 18 Q15 20 12 15"
                  fill="hsl(var(--background))"
                  opacity="0.3"
                />
                <path
                  d="M10 22 Q20 18 30 22 Q27 27 20 25 Q13 27 10 22"
                  fill="hsl(var(--background))"
                  opacity="0.2"
                />
              </svg>
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
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link to="/track-order">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                Track Order
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </Link>
            <Link to="/order">
              <Button variant="outline" size="sm" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Order Now
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={cn(
            "fixed inset-0 top-16 bg-background z-40 md:hidden transition-all duration-300 ease-in-out",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
        >
          <div className={cn(
            "flex flex-col h-full p-6 transition-transform duration-300 ease-in-out",
            isOpen ? "translate-y-0" : "-translate-y-4"
          )}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted",
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground"
                  )}
                  style={{ 
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateX(0)' : 'translateX(-10px)'
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/track-order"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-medium transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted flex items-center gap-2",
                  location.pathname === "/track-order"
                    ? "text-primary bg-primary/10"
                    : "text-foreground"
                )}
              >
                <Package className="h-5 w-5" />
                Track Order
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-medium transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted flex items-center gap-2",
                  location.pathname === "/admin"
                    ? "text-primary bg-primary/10"
                    : "text-foreground"
                )}
              >
                <Shield className="h-5 w-5" />
                Admin Dashboard
              </Link>
            </div>
            
            <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-border">
              <Link to="/order" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full gap-2 h-12 text-base">
                  <ShoppingBag className="h-5 w-5" />
                  Order Now
                </Button>
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="default" className="w-full h-12 text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
