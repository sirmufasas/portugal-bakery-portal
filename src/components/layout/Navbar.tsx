import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown, Package, Shield } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "About", path: "/about" },
  { name: "Testimonials", path: "/testimonials" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => setIsOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen || openContact ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, openContact]);

  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-50 border-b border-border bg-background transition-colors duration-300")}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <img src="/favicon.ico" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-heading font-bold text-primary leading-none">Portugal</span>
              <span className="text-[10px] md:text-xs font-body text-muted-foreground tracking-wider">BAKERY & CONFECTIONARY</span>
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

              <DropdownMenuContent align="end" className={cn("w-48 border border-border shadow-lg bg-background text-foreground")}>
                {isLoggedIn && (
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  {isLoggedIn ? (
                    <button onClick={logout} className="flex items-center gap-2 w-full text-left">
                      <User className="h-4 w-4" /> Logout
                    </button>
                  ) : (
                    <button onClick={() => navigate("/login")} className="flex items-center gap-2 w-full text-left">
                      <User className="h-4 w-4" /> Sign In
                    </button>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/track-order" className="flex items-center gap-2">
                    <Package className="h-4 w-4" /> Track Order
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Admin Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Contact Developer Button */}
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={() => setOpenContact(true)}>
                  <User className="h-4 w-4" /> Contact Developer
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-0 top-16 z-40 md:hidden bg-background text-foreground p-6">
            <div className="flex flex-col h-full gap-4">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-muted/30">
                  {link.name}
                </Link>
              ))}

              {!isLoggedIn && (
                <Button variant="outline" className="w-full h-12 text-base" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              )}

              {isLoggedIn && (
                <Button variant="outline" className="w-full h-12 text-base" onClick={logout}>
                  Logout
                </Button>
              )}

              {/* Contact Developer Button on Mobile */}
              <Button variant="outline" className="w-full h-12 text-base mt-2" onClick={() => setOpenContact(true)}>
                Contact Developer
              </Button>
            </div>
          </div>
        )}
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
    </nav>
  );
}
