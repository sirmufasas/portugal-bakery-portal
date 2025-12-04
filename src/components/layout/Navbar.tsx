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
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <img
                src="/favicon.ico"
                alt="Logo"
                className="w-full h-full object-contain"
              />
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

            {/* <Link to="/order">
              <Button variant="default" size="sm" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Order Now
              </Button>
            </Link> */}

            {/* Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white text-black border border-border shadow-lg z-50"
              >
                <DropdownMenuItem asChild>
                  <Link to="/login" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/track-order" className="flex items-center gap-2 cursor-pointer">
                    <Package className="h-4 w-4" />
                    Track Order
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div
          className={cn(
            "fixed inset-0 top-16 bg-white z-40 md:hidden transition-all duration-300 ease-in-out",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
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
                    "text-lg font-medium transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted/20",
                    location.pathname === link.path
                      ? "text-primary bg-primary/20"
                      : "text-foreground"
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
                className={cn(
                  "text-lg font-medium transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted/20 flex items-center gap-2",
                  location.pathname === "/track-order"
                    ? "text-primary bg-primary/20"
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
                  "text-lg font-medium transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted/20 flex items-center gap-2",
                  location.pathname === "/admin"
                    ? "text-primary bg-primary/20"
                    : "text-foreground"
                )}
              >
                <Shield className="h-5 w-5" />
                Admin Dashboard
              </Link>
            </div>

            <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-border">
              {/* <Link to="/order" onClick={() => setIsOpen(false)}>
                <Button variant="default" className="w-full gap-2 h-12 text-base">
                  <ShoppingBag className="h-5 w-5" />
                  Order Now
                </Button>
              </Link> */}
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-12 text-base">
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
