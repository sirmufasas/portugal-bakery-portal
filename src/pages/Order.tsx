import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, MessageSquare, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { allProducts } from "@/data/products";
import { PaymentSection, PaymentDetails } from "@/components/order/PaymentSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const menuItems = allProducts.slice(0, 20);

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

type OrderStep = "menu" | "checkout" | "payment" | "confirmed";

const Order = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [instructions, setInstructions] = useState("");
  const [orderStep, setOrderStep] = useState<OrderStep>("menu");
  const [orderId, setOrderId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your order.",
        variant: "destructive",
      });
      return;
    }
    setOrderStep("checkout");
  };

  const handleProceedToPayment = () => {
    if (!customerEmail.trim() || !customerName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }
    setOrderStep("payment");
  };

  const handlePaymentComplete = async (paymentDetails: PaymentDetails) => {
    setIsProcessing(true);
    
    // Simulate payment processing (replace with actual API call to your Render backend)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newOrderId = `PB-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderStep("confirmed");
    setIsProcessing(false);
    
    toast({
      title: "Payment successful!",
      description: `Your order ID is ${newOrderId}`,
    });
  };

  // Confirmed order view
  if (orderStep === "confirmed") {
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
            <p className="text-muted-foreground mb-2">
              Thank you for your order. We'll start preparing it right away.
            </p>
            <p className="text-muted-foreground mb-6">
              A confirmation email has been sent to <strong>{customerEmail}</strong>
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
                setOrderStep("menu");
                setCart([]);
                setInstructions("");
                setCustomerEmail("");
                setCustomerName("");
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

  // Checkout step - collect customer details
  if (orderStep === "checkout") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <section className="py-12 md:py-16 bg-gradient-warm">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
                  Checkout
                </span>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                  Your Details
                </h1>
              </div>
            </div>
          </section>

          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-lg mx-auto">
                <Button
                  variant="ghost"
                  onClick={() => setOrderStep("menu")}
                  className="mb-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Menu
                </Button>

                <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Full Name</Label>
                      <Input
                        id="customerName"
                        placeholder="John Doe"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email Address</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        placeholder="john@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll send your order confirmation and updates here
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">€{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={handleProceedToPayment}
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Payment step
  if (orderStep === "payment") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          <section className="py-12 md:py-16 bg-gradient-warm">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
                  Secure Payment
                </span>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                  Complete Payment
                </h1>
              </div>
            </div>
          </section>

          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-lg mx-auto">
                <Button
                  variant="ghost"
                  onClick={() => setOrderStep("checkout")}
                  className="mb-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Details
                </Button>

                <PaymentSection
                  total={total}
                  onPaymentComplete={handlePaymentComplete}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Menu selection step (default)
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
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
                        <p className="text-primary font-bold">R{item.price.toFixed(2)}</p>
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
                                R{(item.price * item.quantity).toFixed(2)}
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
                          <span className="text-primary">R{total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        variant="default"
                        size="lg"
                        className="w-full"
                        onClick={handleProceedToCheckout}
                      >
                        Proceed to Checkout
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
