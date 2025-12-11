import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, ChefHat, Clock, CheckCircle, MessageSquare, Send, Loader2, XCircle, ShoppingBag } from "lucide-react"; import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const API_URL = import.meta.env.VITE_API_URL || 'https://bakerybackend-i7wj.onrender.com';

interface Message {
  _id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  createdAt: string;
  isFromAdmin?: boolean;
  fromUserName?: string;
  isAutoReply?: boolean;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  userId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  createdAt: string;
  specialInstructions?: string;
  deliveryMethod?: string;  // ✅ ADDED
  address?: string;          // ✅ ADDED
  phone?: string;            // ✅ ADDED
}

const getStatusSteps = (deliveryMethod: string) => [
  { key: "pending", label: "Order Received", icon: Package },
  { key: "processing", label: "Processing", icon: ChefHat },
  {
    key: "shipped",
    label: deliveryMethod === 'pickup' ? "Ready for Pickup" : "Shipped",
    icon: Package
  },
  {
    key: "delivered",
    label: deliveryMethod === 'pickup' ? "Collected" : "Delivered",
    icon: CheckCircle
  },
  { key: "cancelled", label: "Cancelled", icon: XCircle },
];

const TrackOrder = () => {
  const { toast } = useToast();
  const [orderId, setOrderId] = useState("");
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Real-time SSE connection for order status updates
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !foundOrder) return;

    console.log('🔌 Connecting to Customer SSE for order:', foundOrder.orderNumber);

    const eventSource = new EventSource(`${API_URL}/api/sse/customer?token=${token}`);

    eventSource.onopen = () => {
      console.log('✅ Customer SSE connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📡 SSE message received:', data);

        if (data.type === 'order_status_changed') {
          if (foundOrder && data.order.orderNumber === foundOrder.orderNumber) {
            console.log('🔄 Updating order status in real-time:', data.order.status);

            setFoundOrder(prevOrder => ({
              ...prevOrder!,
              status: data.order.status,
            }));

            toast({
              title: "📦 Order Status Updated",
              description: `Your order is now: ${data.order.status.toUpperCase()}`,
            });
          }
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE error:', error);
      eventSource.close();
    };

    return () => {
      console.log('🔌 Closing Customer SSE connection');
      eventSource.close();
    };
  }, [foundOrder?.orderNumber]);

  // Real-time SSE for support chat messages
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !foundOrder) return;

    const eventSource = new EventSource(`${API_URL}/api/sse/support-chat?token=${token}`);

    eventSource.onopen = () => {
      console.log('✅ Support Chat SSE connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📡 Support message received:', data);

        if (data.type === 'new_support_message') {
          // ✅ FIX: Validate message before adding to state
          if (!data.message || typeof data.message !== 'object') {
            console.error('Invalid message format:', data.message);
            return;
          }

          setMessages(prev => {
            // Check if message already exists
            if (prev.some(m => m._id === data.message._id)) {
              return prev;
            }
            // Add message only if it's valid
            return [...prev, data.message];
          });

          toast({
            title: "💬 New Message from Admin",
            description: data.message.message.substring(0, 50) + '...',
          });
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Support SSE error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [foundOrder]);

  const handleSearch = async () => {
    if (!orderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in to track your order",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/orders/${orderId.trim()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setFoundOrder(data);
        await fetchMessages();
      } else if (response.status === 404) {
        toast({
          title: "Order not found",
          description: "Please check your order ID and try again.",
          variant: "destructive",
        });
        setFoundOrder(null);
      } else if (response.status === 403) {
        toast({
          title: "Access denied",
          description: "You don't have permission to view this order.",
          variant: "destructive",
        });
      } else {
        throw new Error('Failed to fetch order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/support/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // ✅ FIX: Filter out any invalid messages
        const validMessages = data.filter((msg: any) =>
          msg && typeof msg === 'object' && msg._id && msg.message
        );
        setMessages(validMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return;

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
        body: JSON.stringify({ message: newMessage })
      });

      if (response.ok) {
        const data = await response.json();

        // ✅ FIX: Validate messages before adding to state
        const messagesToAdd: Message[] = [];

        if (data.userMessage && typeof data.userMessage === 'object' && data.userMessage._id) {
          messagesToAdd.push(data.userMessage);
        }

        if (data.autoReply && typeof data.autoReply === 'object' && data.autoReply._id) {
          // Add auto-reply after a short delay
          setTimeout(() => {
            setMessages(prev => [...prev, data.autoReply]);
          }, 500);
        }

        // Add user message immediately
        if (messagesToAdd.length > 0) {
          setMessages(prev => [...prev, ...messagesToAdd]);
        }

        setNewMessage("");

        toast({
          title: "Message sent",
          description: "We'll get back to you soon!",
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

  const getStatusIndex = (status: string) => {
    const steps = getStatusSteps(foundOrder?.deliveryMethod || 'delivery');
    const index = steps.findIndex(s => s.key === status);
    return index >= 0 ? index : 0;
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
      <Navbar />
      <FloatingCartButton />
      <main className="pt-20">

        {/* Header */}
        <section className="py-12 md:py-16 bg-[#FFF8E7] dark:bg-[#5C4632] transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-primary dark:text-primary-dark font-medium text-sm tracking-wider uppercase mb-4 block">
                Track Your Order
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground dark:text-foreground-dark mb-4">
                Order Status
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground-dark text-lg">
                Enter your order ID to track your order and communicate with us.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-background dark:bg-background-dark transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Order ID (e.g., PB-M2X9K7)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 bg-white dark:bg-[#2D2416] text-foreground dark:text-white dark:border-[#5C4632] placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus:ring-primary dark:focus:ring-primary-dark"
                  disabled={loading}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Track
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Order Details */}
        {foundOrder && (
          <section className="py-8 bg-background dark:bg-background-dark">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="bg-card dark:bg-card-dark rounded-2xl shadow-soft overflow-hidden">

                  {/* Order Header */}
                  <div className="p-6 border-b border-border dark:border-border-dark">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Order ID</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <p className="text-2xl font-bold text-primary dark:text-primary-dark">{foundOrder.orderNumber}</p>

                          {/* ✅ DELIVERY METHOD BADGE */}
                          {foundOrder.deliveryMethod === 'pickup' ? (
                            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              Store Pickup
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                              <Package className="h-3 w-3 mr-1" />
                              Delivery
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">Order Date</p>
                        <p className="font-semibold text-foreground dark:text-foreground-dark">
                          {new Date(foundOrder.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* ✅ DELIVERY/PICKUP INFO */}
                    <div className="mt-4">
                      {foundOrder.deliveryMethod === 'delivery' && foundOrder.address ? (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-1">
                            📍 Delivery Address:
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {foundOrder.address}
                          </p>
                        </div>
                      ) : foundOrder.deliveryMethod === 'pickup' ? (
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                          <p className="text-xs font-semibold text-purple-900 dark:text-purple-100 mb-1 flex items-center gap-1">
                            🏪 Store Pickup Location:
                          </p>
                          <p className="text-sm text-purple-800 dark:text-purple-200">
                            Portugal Bakery<br />
                            123 Main Street, Johannesburg<br />
                            Mon-Sat: 7:00 AM - 6:00 PM | Sun: 8:00 AM - 2:00 PM
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {/* ✅ PHONE NUMBER */}
                    {foundOrder.phone && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                          📞 Contact: <a href={`tel:${foundOrder.phone}`} className="text-primary dark:text-primary-dark hover:underline">{foundOrder.phone}</a>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress Steps */}
                  <div className="p-6 border-b border-border dark:border-border-dark">
                    <div className="flex items-center justify-between">
                      {getStatusSteps(foundOrder.deliveryMethod || 'delivery').map((step, index) => {
                        const currentIndex = getStatusIndex(foundOrder.status);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                          <div key={step.key} className="flex-1 flex flex-col items-center relative">
                            {index > 0 && (
                              <div
                                className={cn(
                                  "absolute top-5 -left-1/2 w-full h-1 -z-10",
                                  index <= currentIndex ? "bg-primary dark:bg-primary-dark" : "bg-muted dark:bg-muted-dark"
                                )}
                              />
                            )}
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                isCompleted
                                  ? "bg-primary text-primary-foreground dark:text-primary-foreground-dark"
                                  : "bg-muted text-muted-foreground dark:bg-muted-dark dark:text-muted-foreground-dark",
                                isCurrent && "ring-4 ring-primary/30 animate-pulse"
                              )}
                            >
                              <step.icon className="h-5 w-5" />
                            </div>
                            <p
                              className={cn(
                                "text-xs mt-2 text-center",
                                isCompleted ? "text-primary dark:text-primary-dark font-medium" : "text-muted-foreground dark:text-muted-foreground-dark"
                              )}
                            >
                              {step.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 border-b border-border dark:border-border-dark">
                    <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-3">Order Items</h3>
                    <ul className="space-y-2">
                      {foundOrder.items.map((item, index) => (
                        <li key={index} className="text-muted-foreground dark:text-muted-foreground-dark flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary dark:bg-primary-dark rounded-full" />
                          {item.quantity}x {item.name} - R{(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-border dark:border-border-dark flex justify-between">
                      <span className="font-semibold text-foreground dark:text-foreground-dark">Total</span>
                      <span className="font-bold text-primary dark:text-primary-dark">R{foundOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {foundOrder.specialInstructions && (
                    <div className="p-6 border-b border-border dark:border-border-dark">
                      <h3 className="font-semibold text-foreground dark:text-foreground-dark mb-2">Special Instructions</h3>
                      <p className="text-muted-foreground dark:text-muted-foreground-dark">
                        {foundOrder.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-primary dark:text-primary-dark" />
                      <h3 className="font-semibold text-foreground dark:text-foreground-dark">Messages</h3>
                      {messagesLoading && (
                        <div className="ml-auto">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                      {messages.length === 0 ? (
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark text-center py-4">
                          No messages yet. Send us a message below!
                        </p>
                      ) : (
                        messages
                          .filter(msg => msg && msg._id) // ✅ FIX: Filter out invalid messages
                          .map((msg) => {
                            const isFromUser = !msg.isFromAdmin;
                            return (
                              <div
                                key={msg._id}
                                className={cn(
                                  "flex",
                                  isFromUser ? "justify-end" : "justify-start"
                                )}
                              >
                                <div
                                  className={cn(
                                    "max-w-[80%] rounded-lg p-3",
                                    isFromUser
                                      ? "bg-primary text-primary-foreground"
                                      : msg.isAutoReply
                                        ? "bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border border-amber-200 dark:border-amber-900"
                                        : "bg-muted text-foreground dark:bg-muted-dark dark:text-foreground-dark"
                                  )}
                                >
                                  {!isFromUser && msg.fromUserName && (
                                    <p className="text-xs font-semibold mb-1 opacity-80">
                                      {msg.fromUserName}
                                    </p>
                                  )}
                                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                  <p
                                    className={cn(
                                      "text-xs mt-1",
                                      isFromUser
                                        ? "text-primary-foreground/70"
                                        : "text-muted-foreground dark:text-muted-foreground-dark"
                                    )}
                                  >
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="bg-white dark:bg-[#2D2416] text-foreground dark:text-white dark:border-[#5C4632] placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus:ring-primary dark:focus:ring-primary-dark resize-none"
                        rows={3}
                        disabled={sendingMessage}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="w-full"
                        disabled={sendingMessage || !newMessage.trim()}
                      >
                        {sendingMessage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Help Section */}
        {!foundOrder && !loading && (
          <section className="py-16 bg-background dark:bg-background-dark">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <Clock className="h-16 w-16 text-muted-foreground dark:text-muted-foreground-dark mx-auto mb-4" />
                <h2 className="text-2xl font-heading font-bold text-foreground dark:text-foreground-dark mb-2">
                  Need Help?
                </h2>
                <p className="text-muted-foreground dark:text-muted-foreground-dark">
                  You can find your order ID in the confirmation email we sent you, or in the confirmation screen after placing your order.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrder;