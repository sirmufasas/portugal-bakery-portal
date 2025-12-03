import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, MessageSquare, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { allProducts } from "@/data/products";

const menuItems = allProducts.slice(0, 20);

const _menuItemsLegacy = [
  { id: 1, name: "Artisan Sourdough", price: 4.50, image: breadImg, category: "Breads" },
  { id: 2, name: "Butter Croissant", price: 2.80, image: croissantImg, category: "Pastries" },
  { id: 3, name: "Pastel de Nata", price: 1.50, image: pastryImg, category: "Confections" },
  { id: 4, name: "Chocolate Cake", price: 28.00, image: cakeImg, category: "Cakes" },
  { id: 5, name: "Portuguese Broa", price: 3.80, image: breadImg, category: "Breads" },
  { id: 6, name: "Pain au Chocolat", price: 3.20, image: croissantImg, category: "Pastries" },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Order = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [instructions, setInstructions] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const addToCart = (item: typeof menuItems[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your order.`,
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your order.",
        variant: "destructive",
      });
      return;
    }
    const newOrderId = `PB-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    toast({
      title: "Order placed!",
      description: `Your order ID is ${newOrderId}`,
    });
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We'll start preparing it right away.
            </p>
            <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
              <p className="text-sm text-muted-foreground mb-2">Order ID</p>
              <p className="text-2xl font-bold text-primary">{orderId}</p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-soft mb-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <p className="font-semibold text-foreground">Message the Bakery</p>
              </div>
              <textarea
                placeholder="Send us a message about your order..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
              <Button variant="outline" className="w-full mt-3">
                Send Message
              </Button>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                setOrderPlaced(false);
                setCart([]);
                setInstructions("");
              }}
            >
              Place Another Order
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 md:py-16 bg-gradient-warm">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
                Order Online
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Place Your Order
              </h1>
              <p className="text-muted-foreground text-lg">
                Select items from our menu and we'll have them ready for pickup.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Menu Items */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Select Items
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-card rounded-xl p-4 shadow-soft hover:shadow-elevated transition-shadow"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-primary font-bold">€{item.price.toFixed(2)}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div>
                <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Your Order
                  </h2>

                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Your cart is empty
                    </p>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-primary">
                                €{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="w-7 h-7 rounded-full text-destructive hover:bg-destructive/10 flex items-center justify-center"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Special Instructions
                        </label>
                        <textarea
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Any special requests?"
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                          rows={2}
                        />
                      </div>

                      <div className="border-t border-border pt-4 mb-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-primary">€{total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        variant="default"
                        size="lg"
                        className="w-full"
                        onClick={handlePlaceOrder}
                      >
                        Place Order
                      </Button>
                    </>
                  )}
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

export default Order;
