import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "About", path: "/about" },
  { name: "Testimonials", path: "/testimonials" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent scroll when menu is open
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
            <span className="text-2xl md:text-3xl font-heading font-bold text-primary">
              Portugal
            </span>
            <span className="text-sm font-body text-muted-foreground hidden sm:block">
              Bakery & Confectionary
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
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

        {/* Mobile Navigation Overlay */}
        <div
          className={cn(
            "fixed inset-0 top-16 bg-background/98 backdrop-blur-lg z-40 md:hidden transition-all duration-300 ease-in-out",
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
