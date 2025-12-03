import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, ChefHat, Clock, CheckCircle, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "bakery";
  text: string;
  timestamp: Date;
}

const mockOrders = [
  {
    id: "PB-M2X9K7",
    status: "baking",
    items: ["Butter Croissant x2", "Chocolate Cake", "Sourdough Loaf"],
    total: 38.30,
    placedAt: new Date(Date.now() - 30 * 60 * 1000),
    estimatedReady: new Date(Date.now() + 20 * 60 * 1000),
  },
  {
    id: "PB-L5T3N8",
    status: "ready",
    items: ["Pastel de Nata x6", "Baguette x2"],
    total: 15.00,
    placedAt: new Date(Date.now() - 60 * 60 * 1000),
    estimatedReady: new Date(Date.now() - 10 * 60 * 1000),
  },
];

const statusSteps = [
  { key: "received", label: "Order Received", icon: Package },
  { key: "baking", label: "Baking", icon: ChefHat },
  { key: "ready", label: "Ready for Pickup", icon: CheckCircle },
];

const TrackOrder = () => {
  const { toast } = useToast();
  const [orderId, setOrderId] = useState("");
  const [foundOrder, setFoundOrder] = useState<typeof mockOrders[0] | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bakery", text: "Thank you for your order! We'll update you on the progress.", timestamp: new Date(Date.now() - 25 * 60 * 1000) },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSearch = () => {
    const order = mockOrders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
    if (order) {
      setFoundOrder(order);
    } else {
      toast({
        title: "Order not found",
        description: "Please check your order ID and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: "user",
      text: newMessage,
      timestamp: new Date(),
    }]);
    setNewMessage("");
    toast({
      title: "Message sent",
      description: "The bakery will respond shortly.",
    });
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 md:py-16 bg-gradient-warm">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
                Track Your Order
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                Order Status
              </h1>
              <p className="text-muted-foreground text-lg">
                Enter your order ID to track your order and communicate with us.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Order ID (e.g., PB-M2X9K7)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Order Details */}
        {foundOrder && (
          <section className="py-8 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="text-2xl font-bold text-primary">{foundOrder.id}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-muted-foreground">Estimated Ready</p>
                        <p className="font-semibold text-foreground">
                          {foundOrder.estimatedReady.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      {statusSteps.map((step, index) => {
                        const currentIndex = getStatusIndex(foundOrder.status);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        
                        return (
                          <div key={step.key} className="flex-1 flex flex-col items-center relative">
                            {index > 0 && (
                              <div
                                className={cn(
                                  "absolute top-5 -left-1/2 w-full h-1 -z-10",
                                  index <= currentIndex ? "bg-primary" : "bg-muted"
                                )}
                              />
                            )}
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                isCompleted
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                                isCurrent && "ring-4 ring-primary/30 animate-pulse"
                              )}
                            >
                              <step.icon className="h-5 w-5" />
                            </div>
                            <p
                              className={cn(
                                "text-xs mt-2 text-center",
                                isCompleted ? "text-primary font-medium" : "text-muted-foreground"
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
                  <div className="p-6 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
                    <ul className="space-y-2">
                      {foundOrder.items.map((item, index) => (
                        <li key={index} className="text-muted-foreground flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">€{foundOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Messages</h3>
                    </div>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "p-3 rounded-lg max-w-[80%]",
                            msg.sender === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted text-foreground"
                          )}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={cn(
                            "text-xs mt-1",
                            msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Help Section */}
        {!foundOrder && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Need Help?
                </h2>
                <p className="text-muted-foreground">
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
