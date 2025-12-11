// Order.tsx - Fixed with Working Messaging
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, MessageSquare, ArrowLeft, Loader2, Truck, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { allProducts } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DummyPayment } from "@/components/order/DummyPayment";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'https://bakerybackend-i7wj.onrender.com';

const menuItems = allProducts.slice(0, 20);

type OrderStep = "menu" | "checkout" | "payment" | "confirmed";

const Order = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, addToCart, updateQuantity, removeItem, clearCart, total } = useCart();
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [orderStep, setOrderStep] = useState<OrderStep>("menu");
  const [orderId, setOrderId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Messaging states
  const [customerMessage, setCustomerMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");


  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  if (!isAuthenticated) {
    return null;
  }

  const handleAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    image: string;
  }) => {
    if (!user?._id) {
      toast({
        title: "Please log in",
        description: "You must be logged in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      imageUrl: product.image,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleProceedToCheckout = () => {
    if (!cart.length) {
      toast({
        title: "Cart is empty",
        description: "Please add items.",
        variant: "destructive"
      });
      return;
    }
    setOrderStep("checkout");
  };

  const handleProceedToPayment = () => {
    if (!customerEmail.trim() || !customerName.trim() || !customerPhone.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your name, email, and phone number.",
        variant: "destructive"
      });
      return;
    }

    // Only require address if delivery is selected
    if (deliveryMethod === "delivery" && !customerAddress.trim()) {
      toast({
        title: "Missing delivery address",
        description: "Please enter your delivery address.",
        variant: "destructive"
      });
      return;
    }

    setOrderStep("payment");
  };

  const handleBackToCheckout = () => {
    setOrderStep("checkout");
  };

  const handleBackToMenu = () => {
    setOrderStep("menu");
  };

  const handlePaymentComplete = async (paymentID: string) => {
    setIsProcessing(true);

    try {
      const newOrderId = `PB-${Date.now().toString(36).toUpperCase()}`;

      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          orderId: newOrderId,
          customerName,
          customerEmail,
          customerPhone,
          customerAddress: deliveryMethod === "delivery" ? customerAddress : "", // Only send if delivery
          deliveryMethod,  // ✅ ADDED
          items: cart,
          totalAmount: total,
          specialInstructions,
          paymentID,
        }),
      });

      if (!res.ok) throw new Error("Failed to save order");

      const orderData = await res.json();

      setOrderId(orderData.orderNumber);
      setOrderStep("confirmed");
      clearCart();

      toast({
        title: "Payment successful!",
        description: `Your order ID is ${orderData.orderNumber}. Check your email for confirmation.`
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Order failed",
        description: "Could not save your order. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendCustomerMessage = async () => {
    if (!customerMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to send messages",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/support/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: customerMessage,
          orderNumber: orderId
        })
      });

      if (response.ok) {
        setCustomerMessage("");
        toast({
          title: "Message sent!",
          description: "We'll get back to you shortly.",
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
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
              <Textarea
                placeholder="Send us a message about your order..."
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                className="w-full resize-none mb-3"
                rows={3}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSendCustomerMessage}
                disabled={sendingMessage || !customerMessage.trim()}
              >
                {sendingMessage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                setOrderStep("menu");
                clearCart();
                setSpecialInstructions("");
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
                <Button variant="ghost" onClick={handleBackToMenu} className="mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Menu
                </Button>

                <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">Delivery Method</h2>

                  {/* Delivery Method Selection */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`p-4 rounded-xl border-2 transition-all ${deliveryMethod === "delivery"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-3 rounded-full ${deliveryMethod === "delivery" ? "bg-primary/10" : "bg-muted"
                          }`}>
                          <Truck className={`h-6 w-6 ${deliveryMethod === "delivery" ? "text-primary" : "text-muted-foreground"
                            }`} />
                        </div>
                        <span className={`font-medium ${deliveryMethod === "delivery" ? "text-primary" : "text-foreground"
                          }`}>
                          Delivery
                        </span>
                        <span className="text-xs text-muted-foreground text-center">
                          We'll deliver to your door
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryMethod("pickup");
                        setCustomerAddress(""); // Clear address when switching to pickup
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${deliveryMethod === "pickup"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-3 rounded-full ${deliveryMethod === "pickup" ? "bg-primary/10" : "bg-muted"
                          }`}>
                          <ShoppingBag className={`h-6 w-6 ${deliveryMethod === "pickup" ? "text-primary" : "text-muted-foreground"
                            }`} />
                        </div>
                        <span className={`font-medium ${deliveryMethod === "pickup" ? "text-primary" : "text-foreground"
                          }`}>
                          Pickup
                        </span>
                        <span className="text-xs text-muted-foreground text-center">
                          Collect from our store
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Store Location Info for Pickup */}
                  {deliveryMethod === "pickup" && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Pickup Location
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            Portugal Bakery<br />
                            123 Main Street, Johannesburg<br />
                            Mon-Sat: 7:00 AM - 6:00 PM<br />
                            Sun: 8:00 AM - 2:00 PM
                          </p>
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=Portugal+Bakery+Johannesburg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                          >
                            View on Google Maps →
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-foreground mb-3">Contact Information</h3>
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
                    <div>
                      <Label htmlFor="customerPhone">Phone Number</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        placeholder="+27 12 345 6789"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        For {deliveryMethod === "delivery" ? "delivery" : "pickup"} updates and order confirmation
                      </p>
                    </div>

                    {/* Only show address field if delivery is selected */}
                    {deliveryMethod === "delivery" && (
                      <div>
                        <Label htmlFor="customerAddress">Delivery Address</Label>
                        <Textarea
                          id="customerAddress"
                          placeholder="123 Main Street, Suburb, City, Postal Code"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="bg-background text-foreground min-h-[80px] resize-none"
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Full street address including suburb and postal code
                        </p>
                      </div>
                    )}
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
                  {specialInstructions && (
                    <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                        Special Instructions:
                      </p>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{specialInstructions}</p>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R{total.toFixed(2)}</span>
                  </div>
                </div>
                {/* Packaging Information */}
                <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                    📦 Packaging & Presentation
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all">
                      <img
                        src="https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=400&q=80"
                        alt="Eco-friendly bakery packaging"
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <p className="font-semibold text-sm">Eco-Friendly Boxes</p>
                          <p className="text-xs opacity-90">Sustainable & biodegradable</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative group overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all">
                      <img
                        src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"
                        alt="Premium gift packaging"
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <p className="font-semibold text-sm">Gift-Ready</p>
                          <p className="text-xs opacity-90">Beautiful presentation</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                          Care & Quality Guaranteed
                        </p>
                        <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                          <li>• All items carefully wrapped for freshness</li>
                          <li>• Temperature-controlled packaging for delicate items</li>
                          <li>• Complimentary ribbon & greeting card on request</li>
                        </ul>
                      </div>
                    </div>
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
              onClick={handleBackToCheckout}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Button>

            <DummyPayment
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
            <div className="max-w-lg mx-auto space-y-6">
              {/* Cart Section */}
              <div className="bg-card rounded-2xl p-6 shadow-soft">
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
                          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
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
                  </>
                )}
              </div>

              {/* Special Instructions Section */}
              {cart.length > 0 && (
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-2">Special Instructions</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tell us about any ingredient preferences, allergies, or special requests
                  </p>
                  <Textarea
                    placeholder="Example: No nuts please, extra chocolate, remove raisins, add extra butter, etc."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="min-h-[120px] bg-background text-foreground resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 We'll do our best to accommodate your requests
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              {cart.length > 0 && (
                <Button variant="default" size="lg" className="w-full" onClick={handleProceedToCheckout}>
                  Proceed to Checkout
                </Button>
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