// Order.tsx - Full Functional Ordering + Yoco Online Checkout
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, MessageSquare, ArrowLeft, Loader2, Truck, MapPin, Calculator, Info, CheckCircle2, Navigation, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { allProducts, categories } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { YocoCheckoutCard } from "@/components/order/YocoCheckoutCard";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import packageImg from "@/assets/package.jpg";
import { DeliveryProviderLogo } from "@/components/delivery/DeliveryProviderLogo";
import { OrderTrackingMap } from "@/components/OrderTrackingMap";
import { DeliveryAddressPicker } from "@/components/order/DeliveryAddressPicker";
import {
  buildLocalQuotesFallback,
  DeliveryQuoteOption,
  formatEtaLabel,
  getProviderMeta,
} from "@/utils/deliveryProviders";

const API_URL = import.meta.env.VITE_API_URL || 'https://bakerybackend-i7wj.onrender.com';
const CHECKOUT_DRAFT_KEY = "pb_checkout_draft_v1";

type OrderStep = "menu" | "checkout" | "payment" | "confirmed";

const Order = () => {
  // ✅ ALL HOOKS FIRST - Context hooks
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { cart, addToCart, updateQuantity, removeItem, clearCart, total } = useCart();
  const { products: liveProducts } = useProducts();

  // ✅ ALL STATE HOOKS
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [orderStep, setOrderStep] = useState<OrderStep>("menu");
  const [orderId, setOrderId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [verifyingCallback, setVerifyingCallback] = useState(false);
  const [customerMessage, setCustomerMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCoords, setCustomerCoords] = useState<[number, number] | null>(null);
  const [unitDetails, setUnitDetails] = useState("");
  const [fullscreenMapOpen, setFullscreenMapOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryZone, setDeliveryZone] = useState("");
  const [deliveryCalculated, setDeliveryCalculated] = useState(false);
  const [calculatingDelivery, setCalculatingDelivery] = useState(false);
  const [deliveryQuotes, setDeliveryQuotes] = useState<DeliveryQuoteOption[]>([]);
  const [quoteFilter, setQuoteFilter] = useState<"all" | "on_demand" | "courier" | "pickup_point">("all");
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedProviderName, setSelectedProviderName] = useState<string>("");
  const [deliveryQuoteId, setDeliveryQuoteId] = useState<string | null>(null);
  const [preferredPickupPoint, setPreferredPickupPoint] = useState<string>("");
  const [menuCategory, setMenuCategory] = useState<string>("All");
  const [menuSearch, setMenuSearch] = useState<string>("");

  // ✅ COMPUTED VALUES
  const finalTotal = deliveryMethod === "delivery" && deliveryCalculated ? total + deliveryFee : total;
  const catalogProducts = liveProducts && liveProducts.length > 0 ? liveProducts : allProducts;

  // ✅ Prefill logged-in customer details
  useEffect(() => {
    if (!user) return;
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    if (fullName && !customerName) setCustomerName(fullName);
    if (user.email && !customerEmail) setCustomerEmail(user.email);
    if ((user as any).phone && !customerPhone) setCustomerPhone((user as any).phone);
  }, [user, customerName, customerEmail, customerPhone]);

  // ✅ Restore saved checkout draft if returning from Capitec 3DS redirect
  useEffect(() => {
    try {
      const savedRaw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
      if (!savedRaw) return;
      const draft = JSON.parse(savedRaw);
      if (draft.customerName) setCustomerName(draft.customerName);
      if (draft.customerEmail) setCustomerEmail(draft.customerEmail);
      if (draft.customerPhone) setCustomerPhone(draft.customerPhone);
      if (draft.customerAddress) setCustomerAddress(draft.customerAddress);
      if (Array.isArray(draft.customerCoords) && draft.customerCoords.length === 2) {
        setCustomerCoords([Number(draft.customerCoords[0]), Number(draft.customerCoords[1])]);
      }
      if (draft.unitDetails) setUnitDetails(draft.unitDetails);
      if (draft.specialInstructions) setSpecialInstructions(draft.specialInstructions);
      if (draft.deliveryMethod) setDeliveryMethod(draft.deliveryMethod);
      if (typeof draft.deliveryFee === "number") setDeliveryFee(draft.deliveryFee);
      if (draft.deliveryZone) setDeliveryZone(draft.deliveryZone);
      if (draft.deliveryCalculated) setDeliveryCalculated(true);
      if (draft.selectedProviderId) setSelectedProviderId(draft.selectedProviderId);
      if (draft.selectedProviderName) setSelectedProviderName(draft.selectedProviderName);
      if (draft.deliveryQuoteId) setDeliveryQuoteId(draft.deliveryQuoteId);
      if (draft.preferredPickupPoint) setPreferredPickupPoint(draft.preferredPickupPoint);
    } catch {
      // ignore invalid session draft
    }
  }, []);

  // ✅ ALL useEffect HOOKS - BEFORE ANY CONDITIONAL LOGIC
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  // ✅ Handle Yoco Hosted Checkout return verification (?payment_verify=yoco&reference=...)
  useEffect(() => {
    const verifyMode = searchParams.get("payment_verify");
    const reference = searchParams.get("reference");
    const cancelled = searchParams.get("payment_cancelled");
    const failed = searchParams.get("payment_failed");

    if (cancelled || failed) {
      toast({
        title: failed ? "Yoco payment unsuccessful" : "Yoco payment cancelled",
        description: "Your basket and delivery details are still saved whenever you're ready to retry.",
        variant: "destructive",
      });
      setOrderStep("payment");
      setSearchParams({}, { replace: true });
      return;
    }

    if (!verifyMode || !reference) return;
    const authToken = token || localStorage.getItem("token");
    if (!authToken) return;

    let active = true;
    (async () => {
      try {
        setVerifyingCallback(true);
        const res = await fetch(`${API_URL}/api/payments/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ reference }),
        });
        const data = await res.json().catch(() => ({}));
        if (!active) return;

        if (res.ok && data?.verified && data?.order) {
          handleVerifiedYocoOrder(data.order);
          setSearchParams({}, { replace: true });
        } else {
          toast({
            title: "Payment not yet confirmed",
            description: data?.error || "Could not verify Yoco payment.",
            variant: "destructive",
          });
          setOrderStep("payment");
          setSearchParams({}, { replace: true });
        }
      } catch {
        if (!active) return;
        toast({
          title: "Verification error",
          description: "Could not verify Yoco payment status. Please check your orders or retry.",
          variant: "destructive",
        });
        setOrderStep("payment");
        setSearchParams({}, { replace: true });
      } finally {
        if (active) setVerifyingCallback(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [searchParams, token]);

  const fetchQuotesForAddress = async (
    targetAddress: string,
    targetCoords: [number, number] | null,
    options?: { silent?: boolean; preserveProviderId?: string | null }
  ) => {
    if (!targetAddress.trim()) {
      if (!options?.silent) {
        toast({
          title: "Address required",
          description: "Please enter or select your delivery address first",
          variant: "destructive"
        });
      }
      return;
    }

    setCalculatingDelivery(true);

    try {
      const authToken = localStorage.getItem("token");
      let quotes: DeliveryQuoteOption[] = [];

      try {
        const res = await fetch(`${API_URL}/api/delivery/quotes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          },
          body: JSON.stringify({
            address: targetAddress,
            latitude: targetCoords ? targetCoords[0] : undefined,
            longitude: targetCoords ? targetCoords[1] : undefined,
            items: cart.map(item => ({ name: item.name })),
            subtotal: total
          })
        });

        if (res.ok) {
          const data = await res.json();
          const serverQuotes: DeliveryQuoteOption[] = data.quotes || [];
          if (serverQuotes.length <= 1) {
            const fallbackQuotes = buildLocalQuotesFallback(targetAddress, targetCoords);
            const serverMap = new Map(serverQuotes.map((q) => [q.providerId, q]));
            quotes = fallbackQuotes.map((fq) => serverMap.get(fq.providerId) || fq);
          } else {
            quotes = serverQuotes;
          }
        } else {
          quotes = buildLocalQuotesFallback(targetAddress, targetCoords);
        }
      } catch {
        quotes = buildLocalQuotesFallback(targetAddress, targetCoords);
      }

      setDeliveryQuotes(quotes);

      // If customer already chose a courier (e.g. Uber Package) and adjusted the pin/address,
      // smoothly update that courier's quote & zone for the new coordinates!
      if (options?.preserveProviderId) {
        const updatedSameProvider = quotes.find(
          (q) => q.providerId === options.preserveProviderId
        );
        if (updatedSameProvider) {
          selectDeliveryQuote(updatedSameProvider);
          return;
        } else {
          setDeliveryCalculated(false);
          setSelectedProviderId(null);
        }
      }

      setQuoteFilter("all");

      if (quotes.length === 0) {
        if (!options?.silent) {
          toast({
            title: "No delivery options available",
            description: "We couldn't find a delivery option for this address. Please contact us to confirm delivery.",
            variant: "destructive"
          });
        }
        return;
      }

      if (quotes.length === 1) {
        selectDeliveryQuote(quotes[0]);
      } else if (!options?.silent) {
        toast({
          title: `${quotes.length} SA delivery services available!`,
          description: "Choose from Uber, Bolt, inDrive, Yassir, Mr D, Couriers, Lockers & Bakery Delivery.",
        });
      }
    } catch (err) {
      if (!options?.silent) {
        toast({
          title: "Couldn't calculate delivery",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setCalculatingDelivery(false);
    }
  };

  const handleCalculateDelivery = () => {
    fetchQuotesForAddress(customerAddress, customerCoords);
  };

  const selectDeliveryQuote = (quote: DeliveryQuoteOption) => {
    setSelectedProviderId(quote.providerId);
    setSelectedProviderName(quote.providerName);
    setDeliveryFee(quote.fee);
    setDeliveryZone(quote.zone ? `${quote.providerName} · ${quote.zone}` : quote.providerName);
    setDeliveryQuoteId(quote.quoteId || null);
    setDeliveryCalculated(true);
  };

  const resetDeliverySelection = () => {
    setDeliveryCalculated(false);
    setDeliveryFee(0);
    setDeliveryZone("");
    setSelectedProviderId(null);
    setSelectedProviderName("");
    setDeliveryQuoteId(null);
    setDeliveryQuotes([]);
  };

  const handleAddToCart = (product: {
    id: number | string;
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

    if (deliveryMethod === "delivery" && !customerAddress.trim()) {
      toast({
        title: "Missing delivery address",
        description: "Please enter your delivery address.",
        variant: "destructive"
      });
      return;
    }

    // ✅ NEW VALIDATION: Check if delivery fee has been calculated
    if (deliveryMethod === "delivery" && !deliveryCalculated) {
      toast({
        title: "Delivery fee not calculated",
        description: "Please click 'Calculate Delivery Fee' to continue.",
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

  const saveCheckoutDraft = () => {
    try {
      sessionStorage.setItem(
        CHECKOUT_DRAFT_KEY,
        JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          customerCoords,
          unitDetails,
          specialInstructions,
          deliveryMethod,
          deliveryFee,
          deliveryZone,
          deliveryCalculated,
          selectedProviderId,
          selectedProviderName,
          deliveryQuoteId,
          preferredPickupPoint,
        })
      );
    } catch {
      // ignore storage quota errors
    }
  };

  const handleVerifiedYocoOrder = (orderData: any) => {
    if (orderData.deliveryMethod) setDeliveryMethod(orderData.deliveryMethod);
    if (orderData.address) setCustomerAddress(orderData.address);
    if (
      typeof orderData.customerLat === "number" &&
      typeof orderData.customerLng === "number"
    ) {
      setCustomerCoords([orderData.customerLat, orderData.customerLng]);
    }
    if (orderData.deliveryProvider) setSelectedProviderId(orderData.deliveryProvider);
    if (orderData.deliveryService) setSelectedProviderName(orderData.deliveryService);
    if (orderData.customerEmail) setCustomerEmail(orderData.customerEmail);

    setOrderId(orderData.orderNumber);
    setOrderStep("confirmed");
    clearCart();
    sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    sessionStorage.removeItem("pb_pending_payment_ref");

    toast({
      title: "Yoco payment verified!",
      description: `Order ${orderData.orderNumber} is confirmed and being prepared.`,
    });
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
    const chosenProvider = getProviderMeta(selectedProviderId || "own_delivery");
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 px-4">
          <div className="max-w-3xl mx-auto animate-fade-in-up space-y-6">
            {/* Order Confirmed Banner */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-soft border border-border text-center">
              <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-9 w-9 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                Thank you for ordering from Portugal Bakery. We&apos;ve started preparing your fresh bake
                {deliveryMethod === "delivery"
                  ? ` and queued your ${selectedProviderName || chosenProvider.name} delivery.`
                  : " for collection at our La Rochelle bakery."}
              </p>
              {customerEmail && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                  Confirmation sent to <strong>{customerEmail}</strong>
                </p>
              )}

              <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 px-5 py-3 rounded-xl bg-muted/60 border border-border">
                <div className="text-left">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                    Order Number
                  </span>
                  <span className="text-xl font-extrabold text-primary">{orderId}</span>
                </div>
                {deliveryMethod === "delivery" && (
                  <>
                    <div className="h-8 w-px bg-border hidden sm:block" />
                    <div className="flex items-center gap-2.5 text-left">
                      <DeliveryProviderLogo
                        providerId={selectedProviderId || "own_delivery"}
                        alt={selectedProviderName || chosenProvider.name}
                        size="sm"
                      />
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                          Delivery Partner
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {selectedProviderName || chosenProvider.name}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Live Delivery Route & Distance Map tailored to chosen delivery company */}
            <OrderTrackingMap
              orderNumber={orderId}
              status="confirmed"
              customerAddress={customerAddress || "Johannesburg"}
              customerCoords={customerCoords}
              deliveryMethod={deliveryMethod}
              deliveryProvider={selectedProviderId || "own_delivery"}
              deliveryServiceName={selectedProviderName || chosenProvider.name}
              pickupLocation={preferredPickupPoint}
            />

            {/* Quick Actions + Message Bakery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    <p className="font-semibold text-foreground">Real-Time Order Updates</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">
                    Follow every step from the oven to your door, view live courier details, and chat with our team anytime.
                  </p>
                </div>
                <div className="space-y-2.5">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => navigate(`/track-order?order=${encodeURIComponent(orderId)}`)}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Open Full Live Order Tracker
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setOrderStep("menu");
                      clearCart();
                      setSpecialInstructions("");
                      setCustomerEmail("");
                      setCustomerName("");
                      resetDeliverySelection();
                    }}
                  >
                    Place Another Order
                  </Button>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                <div className="flex items-center gap-2.5 mb-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <p className="font-semibold text-foreground">Message the Bakery</p>
                </div>
                <Textarea
                  placeholder="Add gate code, buzzer instructions, or a note for our bakers..."
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
                    "Send Message"
                  )}
                </Button>
              </div>
            </div>
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
                        setCustomerAddress("");
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
                            245 Johannesburg Rd, La Rochelle, Johannesburg South, 2190<br />
                            Mon-Fri: 6:45 AM - 16:00 PM<br />
                            Sat: 6:45 AM - 2:00 PM
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

                    {deliveryMethod === "delivery" && (
                      <div className="space-y-3">
                        <DeliveryAddressPicker
                          address={customerAddress}
                          coords={customerCoords}
                          unitDetails={unitDetails}
                          onUnitDetailsChange={setUnitDetails}
                          onAddressTyped={(rawText) => {
                            setCustomerAddress(rawText);
                            setCustomerCoords(null);
                            if (deliveryCalculated || deliveryQuotes.length > 0) {
                              resetDeliverySelection();
                            }
                          }}
                          onLocationVerified={({ address: verifiedAddr, coords: verifiedCoords }) => {
                            setCustomerAddress(verifiedAddr);
                            setCustomerCoords(verifiedCoords);
                            fetchQuotesForAddress(verifiedAddr, verifiedCoords, {
                              silent: true,
                              preserveProviderId: selectedProviderId,
                            });
                          }}
                          onOpenFullscreenMap={() => setFullscreenMapOpen(true)}
                        />

                        {!deliveryCalculated && deliveryQuotes.length === 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleCalculateDelivery}
                            disabled={!customerAddress.trim() || calculatingDelivery}
                          >
                            {calculatingDelivery ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Comparing SA delivery services...
                              </>
                            ) : (
                              <>
                                <Calculator className="h-4 w-4 mr-2" />
                                Compare Delivery Services (Uber, Bolt, inDrive, Yassir & More)
                              </>
                            )}
                          </Button>
                        )}

                        {!deliveryCalculated && deliveryQuotes.length > 0 && (
                          <div className="mb-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-foreground text-sm">
                                Select a Delivery Service ({deliveryQuotes.length} available)
                              </h4>
                            </div>

                            {/* Category filter pills */}
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { key: "all" as const, label: "All" },
                                { key: "on_demand" as const, label: "Fast On-Demand" },
                                { key: "courier" as const, label: "Bakery & Couriers" },
                                { key: "pickup_point" as const, label: "Pickup Lockers" },
                              ].map((tab) => (
                                <button
                                  key={tab.key}
                                  type="button"
                                  onClick={() => setQuoteFilter(tab.key)}
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                    quoteFilter === tab.key
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>

                            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                              {deliveryQuotes
                                .filter((quote) => {
                                  if (quoteFilter === "all") return true;
                                  const cat = quote.category || getProviderMeta(quote.providerId).category;
                                  if (quoteFilter === "courier") {
                                    return cat === "courier" || cat === "in_house";
                                  }
                                  return cat === quoteFilter;
                                })
                                .map((quote) => {
                                  const meta = getProviderMeta(quote.providerId);
                                  const etaText = formatEtaLabel(quote.etaMinutesMin, quote.etaMinutesMax);
                                  return (
                                    <button
                                      key={quote.providerId}
                                      type="button"
                                      onClick={() => selectDeliveryQuote(quote)}
                                      className="w-full text-left p-3.5 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 min-w-0">
                                          <DeliveryProviderLogo
                                            providerId={quote.providerId}
                                            alt={quote.providerName}
                                            size="md"
                                          />
                                          <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                              <span className="font-semibold text-foreground text-sm">
                                                {quote.providerName}
                                              </span>
                                              {quote.labels &&
                                                quote.labels.map((label) => (
                                                  <span
                                                    key={label}
                                                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                                                  >
                                                    {label}
                                                  </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                              {quote.description || meta.description}
                                            </p>
                                            {etaText && (
                                              <p className="text-[11px] font-medium text-amber-700 mt-0.5">
                                                ⏱ Est. {etaText}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                          {quote.freeDelivery ? (
                                            <>
                                              <span className="block text-xs line-through text-muted-foreground">
                                                R{quote.originalFee}
                                              </span>
                                              <span className="font-bold text-green-600 text-sm">FREE</span>
                                            </>
                                          ) : (
                                            <span className="font-bold text-primary text-base">
                                              R{quote.fee}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        )}

                        {deliveryCalculated && (
                          <div className="p-4 bg-green-50 rounded-xl border border-green-200 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <DeliveryProviderLogo
                                  providerId={selectedProviderId}
                                  alt={selectedProviderName || getProviderMeta(selectedProviderId).name}
                                  size="md"
                                />
                                <div>
                                  <p className="font-semibold text-green-900 text-sm">
                                    {selectedProviderName || getProviderMeta(selectedProviderId).name} —{" "}
                                    {deliveryFee === 0 ? "FREE" : `R${deliveryFee.toFixed(2)}`}
                                  </p>
                                  <p className="text-xs text-green-700 mt-0.5">
                                    {deliveryZone}
                                  </p>
                                </div>
                              </div>
                              {deliveryQuotes.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setDeliveryCalculated(false);
                                    setSelectedProviderId(null);
                                  }}
                                  className="text-xs shrink-0"
                                >
                                  Change Service
                                </Button>
                              )}
                            </div>

                            {(selectedProviderId === "pudo" || selectedProviderId === "pargo") && (
                              <div className="pt-2 border-t border-green-200">
                                <Label htmlFor="preferredPickupPoint" className="text-xs text-green-900">
                                  Preferred {selectedProviderId === "pudo" ? "PUDO Locker" : "Pargo Store"} (optional)
                                </Label>
                                <Input
                                  id="preferredPickupPoint"
                                  placeholder={
                                    selectedProviderId === "pudo"
                                      ? "e.g. PUDO Locker @ The Glen Shopping Centre"
                                      : "e.g. Clicks Comaro Crossing / Spar Rosettenville"
                                  }
                                  value={preferredPickupPoint}
                                  onChange={(e) => setPreferredPickupPoint(e.target.value)}
                                  className="mt-1 bg-background text-foreground text-xs h-8"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive Street Map with Draggable Pin, Live GPS & Full-Screen Road View */}
                        {(Boolean(customerAddress.trim()) ||
                          customerCoords !== null ||
                          fullscreenMapOpen ||
                          deliveryCalculated) && (
                          <OrderTrackingMap
                            compact
                            status="pending"
                            editablePin
                            customerAddress={customerAddress || "La Rochelle, Johannesburg"}
                            customerCoords={customerCoords}
                            fullscreenOpen={fullscreenMapOpen}
                            onFullscreenOpenChange={setFullscreenMapOpen}
                            onLocationChange={({ lat, lng, address: pinnedAddress }) => {
                              const nextCoords: [number, number] = [lat, lng];
                              setCustomerAddress(pinnedAddress);
                              setCustomerCoords(nextCoords);
                              fetchQuotesForAddress(pinnedAddress, nextCoords, {
                                silent: true,
                                preserveProviderId: selectedProviderId,
                              });
                            }}
                            deliveryMethod="delivery"
                            deliveryProvider={selectedProviderId || "own_delivery"}
                            deliveryServiceName={
                              selectedProviderName ||
                              getProviderMeta(selectedProviderId).name
                            }
                            pickupLocation={preferredPickupPoint}
                          />
                        )}
                      </div>
                    )}

                    <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
                      <h2 className="text-xl font-heading font-bold text-foreground mb-4">Order Summary</h2>
                      <div className="space-y-3 mb-4">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                            <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}

                        <div className="flex justify-between text-sm border-t border-border pt-3">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">R{total.toFixed(2)}</span>
                        </div>

                        {deliveryMethod === "delivery" && deliveryCalculated && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Delivery Fee
                              <span className="block text-xs opacity-75">{deliveryZone}</span>
                            </span>
                            <span className="font-medium text-primary">R{deliveryFee.toFixed(2)}</span>
                          </div>
                        )}

                        {deliveryMethod === "pickup" && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pickup Fee</span>
                            <span className="font-medium text-green-600">FREE</span>
                          </div>
                        )}
                      </div>

                      {specialInstructions && (
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                            Special Instructions:
                          </p>
                          <p className="text-sm text-amber-800 dark:text-amber-200">{specialInstructions}</p>
                        </div>
                      )}

                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-6 shadow-soft mb-6">
                    <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                      📦 Packaging & Presentation
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group overflow-hidden rounded-xl border-2 border-border hover:border-primary transition-all">
                        <img
                          src={packageImg}
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
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (verifyingCallback) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 pt-20">
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border max-w-md w-full text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-[#00A9E0] mx-auto" />
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Verifying Yoco Payment...
            </h2>
            <p className="text-sm text-muted-foreground">
              Confirming your transaction directly with Yoco and preparing your live order tracker.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderStep === "payment") {
    const activeToken = token || localStorage.getItem("token");
    const effectiveDeliveryFee =
      deliveryMethod === "delivery" && deliveryCalculated ? deliveryFee : 0;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center px-4 pt-24 pb-16">
          <section className="text-center mb-8">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-2 block">
              Yoco Secure Checkout
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
              Complete Payment
            </h1>
          </section>

          <div className="w-full max-w-xl">
            <Button
              variant="ghost"
              onClick={handleBackToCheckout}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Delivery &amp; Contact Details
            </Button>

            <YocoCheckoutCard
              total={finalTotal}
              subtotal={total}
              deliveryFee={effectiveDeliveryFee}
              deliveryMethod={deliveryMethod}
              token={activeToken}
              onBeforeRedirect={saveCheckoutDraft}
              checkoutPayload={{
                items: cart.map((item) => ({
                  id: Number(item.id),
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                  imageUrl: item.imageUrl,
                })),
                customerName,
                customerEmail,
                customerPhone,
                customerAddress:
                  deliveryMethod === "delivery"
                    ? unitDetails.trim()
                      ? `${unitDetails.trim()}, ${customerAddress}`
                      : customerAddress
                    : "",
                customerLat:
                  deliveryMethod === "delivery" && customerCoords
                    ? customerCoords[0]
                    : null,
                customerLng:
                  deliveryMethod === "delivery" && customerCoords
                    ? customerCoords[1]
                    : null,
                shippingAddress:
                  deliveryMethod === "delivery"
                    ? unitDetails.trim()
                      ? `${unitDetails.trim()}, ${customerAddress}`
                      : customerAddress
                    : "Store Pickup - 245 Johannesburg Road, La Rochelle",
                specialInstructions: preferredPickupPoint.trim()
                  ? `${specialInstructions ? specialInstructions + " | " : ""}Preferred Locker/Pickup Point: ${preferredPickupPoint.trim()}`
                  : specialInstructions,
                deliveryMethod,
                deliveryFee: effectiveDeliveryFee,
                deliveryZone:
                  deliveryMethod === "delivery" && deliveryCalculated
                    ? deliveryZone
                    : "",
                deliveryProvider:
                  deliveryMethod === "delivery"
                    ? selectedProviderId || "own_delivery"
                    : null,
                deliveryService:
                  deliveryMethod === "delivery"
                    ? selectedProviderName || null
                    : null,
                deliveryQuoteId:
                  deliveryMethod === "delivery" ? deliveryQuoteId : null,
                pickupLocation:
                  deliveryMethod === "delivery" && preferredPickupPoint.trim()
                    ? {
                        id: "custom_pickup_point",
                        name: preferredPickupPoint.trim(),
                        address: preferredPickupPoint.trim(),
                      }
                    : null,
              }}
              onPaymentError={(message) =>
                toast({
                  title: "Yoco payment issue",
                  description: message,
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

  // Filter catalog for quick-add menu inside /order
  const filteredCatalog = catalogProducts.filter((p) => {
    const matchesCategory =
      menuCategory === "All" || p.category === menuCategory;
    const q = menuSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Default menu & cart selection
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <section className="pb-8 bg-background">
          <div className="container mx-auto px-4 text-center">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-2 block">
              Order Online
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
              Place Your Order
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Add freshly baked Portuguese pastries, breads, and cakes to your basket, choose your delivery partner or bakery pickup, and pay securely online with Yoco.
            </p>
          </div>
        </section>

        <section className="py-4 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start">
              {/* Left Column: Quick-Add Bakery Catalog */}
              <div className="lg:col-span-7 bg-card rounded-2xl p-6 shadow-soft border border-border space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-foreground">
                      Fresh From Our Ovens
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Tap + to add items directly to your order
                    </p>
                  </div>
                  <Link
                    to="/menu"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View Full Detailed Menu →
                  </Link>
                </div>

                {/* Search + Category Pills */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      placeholder="Search pastéis de nata, sourdough, cakes..."
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setMenuCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                          menuCategory === cat
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[540px] overflow-y-auto pr-1">
                  {filteredCatalog.slice(0, 24).map((product) => {
                    const inCart = cart.find((c) => c.id === Number(product.id));
                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 bg-muted"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.category}
                          </p>
                          <p className="text-sm font-bold text-primary mt-0.5">
                            R{Number(product.price).toFixed(2)}
                          </p>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(inCart.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-5 text-center text-xs font-bold">
                              {inCart.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="default"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(inCart.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 h-8 px-2.5 text-xs font-semibold"
                            onClick={() => handleAddToCart(product)}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Cart + Special Instructions + Checkout */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      Your Basket
                    </h2>
                    {cart.length > 0 && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        {cart.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="text-center py-8 space-y-3">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground/50 mx-auto" />
                      <p className="text-muted-foreground text-sm">
                        Your basket is empty. Tap <strong>+ Add</strong> on any fresh bake to start your order!
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4 max-h-[320px] overflow-y-auto pr-1">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 items-center p-2 rounded-xl bg-background border border-border/60"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-14 h-14 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                R{item.price.toFixed(2)} each
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-xs font-semibold w-5 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <span className="font-semibold text-sm">
                              R{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                        <span>Subtotal</span>
                        <span className="text-primary">R{total.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Special Instructions Section */}
                {cart.length > 0 && (
                  <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                    <h2 className="text-lg font-heading font-bold text-foreground mb-1.5">
                      Special Instructions
                    </h2>
                    <p className="text-xs text-muted-foreground mb-3">
                      Allergies, cake inscriptions, slicing, or ingredient requests
                    </p>
                    <Textarea
                      placeholder="Example: Happy Birthday message on cake, sliced loaf, no nuts please..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="min-h-[96px] bg-background text-foreground resize-none"
                    />
                  </div>
                )}

                {/* Checkout Button */}
                {cart.length > 0 && (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full h-12 text-base font-semibold shadow-md"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Delivery &amp; Yoco Payment →
                  </Button>
                )}
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