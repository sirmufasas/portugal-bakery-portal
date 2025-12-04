// src/pages/Order.tsx
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, MessageSquare, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { allProducts } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { YocoPayment } from "@/components/order/YocoPayment";
import { useCart } from "@/contexts/CartContext";

const menuItems = allProducts.slice(0, 20);

type OrderStep = "menu" | "checkout" | "payment" | "confirmed";

const Order = () => {
  const { toast } = useToast();
  const { cart, addToCart, updateQuantity, removeItem, clearCart, total } = useCart();
  const [instructions, setInstructions] = useState("");
  const [orderStep, setOrderStep] = useState<OrderStep>("menu");
  const [orderId, setOrderId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = (item: typeof menuItems[0]) => {
    addToCart(item);
    toast({ title: "Added to cart", description: `${item.name} has been added to your order.` });
  };

  const handleProceedToCheckout = () => {
    if (!cart.length)
      return toast({ title: "Cart is empty", description: "Please add items.", variant: "destructive" });
    setOrderStep("checkout");
  };

  const handleProceedToPayment = () => {
    if (!customerEmail.trim() || !customerName.trim())
      return toast({ title: "Missing information", description: "Please enter your name and email.", variant: "destructive" });
    setOrderStep("payment");
  };

  const handlePaymentComplete = async (paymentID: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newOrderId = `PB-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderStep("confirmed");
    setIsProcessing(false);
    toast({ title: "Payment successful!", description: `Your order ID is ${newOrderId}` });
  };

  // --- Render Steps ---
  if (orderStep === "confirmed") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-4">Order Confirmed!</h1>
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
              <Button variant="outline" className="w-full mt-3">Send Message</Button>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                setOrderStep("menu");
                clearCart();
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

  if (orderStep === "checkout") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <section className="py-12 md:py-16 bg-background w-full">
            <div className="container mx-auto px-4 text-center">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">Checkout</span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">Your Details</h1>
            </div>
          </section>

          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-lg mx-auto">
                <Button variant="ghost" onClick={() => setOrderStep("menu")} className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Menu
                </Button>

                <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Full Name</Label>
                      <Input
                        id="customerName"
                        placeholder="John Doe"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="bg-background text-foreground"
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
                        className="bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll send your order confirmation and updates here
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                        <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button variant="default" size="lg" className="w-full" onClick={handleProceedToPayment}>
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

  if (orderStep === "payment") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center px-4">
          <section className="text-center mt-12 mb-10">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-2 block">
              Secure Payment
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Complete Payment
            </h1>
          </section>

          <div className="w-full max-w-lg mb-12">
            <Button
              variant="ghost"
              onClick={() => setOrderStep("checkout")}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Button>

            {/* Yoco Payment with balanced spacing */}
            <div className="bg-card rounded-2xl p-8 shadow-soft">
              <YocoPayment
                amountZAR={total}
                onSuccess={handlePaymentComplete}
                onError={() =>
                  toast({
                    title: "Payment failed",
                    description: "Please try again.",
                    variant: "destructive",
                  })
                }
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Default menu selection
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">Order Online</span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">Place Your Order</h1>
            <p className="text-muted-foreground text-lg">Select items from our menu and we'll have them ready for pickup.</p>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto bg-card rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-heading font-bold text-foreground mb-4">Your Cart</h2>
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Your cart is empty. Add items to get started!
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name} x{item.quantity}</p>
                          <div className="flex gap-2 mt-1">
                            <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold mb-4">
                    <span>Total</span>
                    <span className="text-primary">R{total.toFixed(2)}</span>
                  </div>
                  <Button variant="default" size="lg" className="w-full" onClick={handleProceedToCheckout}>
                    Proceed to Checkout
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Order;
