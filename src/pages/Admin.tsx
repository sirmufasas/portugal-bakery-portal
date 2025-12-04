import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  MessageSquare, 
  Star, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Send,
  Eye,
  Trash2,
  ChefHat
} from "lucide-react";

// Mock data for orders
const mockOrders = [
  {
    id: "PB-001",
    customer: "Maria Santos",
    email: "maria@email.com",
    items: ["2x Pastel de Nata", "1x Artisan Sourdough"],
    total: "R7.50",
    status: "pending",
    date: "2024-01-15 09:30",
    instructions: "Please make the custard tarts extra crispy",
  },
  {
    id: "PB-002",
    customer: "João Silva",
    email: "joao@email.com",
    items: ["1x Chocolate Ganache Cake", "4x Butter Croissant"],
    total: "R39.20",
    status: "baking",
    date: "2024-01-15 10:15",
    instructions: "Birthday cake - need by 3pm",
  },
  {
    id: "PB-003",
    customer: "Ana Costa",
    email: "ana@email.com",
    items: ["6x Pastel de Nata", "2x Artisan Sourdough"],
    total: "R18.00",
    status: "ready",
    date: "2024-01-15 08:00",
    instructions: "",
  },
];

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    orderId: "PB-001",
    customer: "Maria Santos",
    messages: [
      { from: "customer", text: "Hi, can I pick up at 2pm instead of 1pm?", time: "10:30" },
      { from: "admin", text: "Of course! We'll have your order ready at 2pm.", time: "10:35" },
    ],
  },
  {
    id: 2,
    orderId: "PB-002",
    customer: "João Silva",
    messages: [
      { from: "customer", text: "Can you add 'Happy Birthday Ana' on the cake?", time: "10:20" },
    ],
  },
];

// Mock data for testimonials
const mockTestimonials = [
  {
    id: 1,
    name: "Carlos Mendes",
    rating: 5,
    text: "Best pastel de nata in the city! The crust is perfectly crispy and the custard is divine.",
    date: "2024-01-14",
    status: "approved",
  },
  {
    id: 2,
    name: "Sofia Almeida",
    rating: 4,
    text: "Love their sourdough bread. Fresh and delicious every time I visit.",
    date: "2024-01-13",
    status: "pending",
  },
  {
    id: 3,
    name: "Test User",
    rating: 1,
    text: "spam message here",
    date: "2024-01-12",
    status: "pending",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  baking: "bg-orange-100 text-orange-800 border-orange-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  delivered: "bg-blue-100 text-blue-800 border-blue-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  baking: <ChefHat className="h-3 w-3" />,
  ready: <CheckCircle className="h-3 w-3" />,
  delivered: <Package className="h-3 w-3" />,
};

export default function Admin() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [messages] = useState(mockMessages);
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const handleTestimonialAction = (id: number, action: "approve" | "reject") => {
    if (action === "approve") {
      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, status: "approved" } : t
      ));
      toast({ title: "Testimonial Approved", description: "The review is now visible on the website." });
    } else {
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast({ title: "Testimonial Removed", description: "The review has been deleted." });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the customer.",
    });
    setNewMessage("");
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    readyOrders: orders.filter(o => o.status === "ready").length,
    pendingReviews: testimonials.filter(t => t.status === "pending").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage orders, communicate with customers, and moderate testimonials
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-primary/10">
                    <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-amber-500/10">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-green-500/10">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.readyOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-accent/10">
                    <Star className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.pendingReviews}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4 hidden sm:block" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4 hidden sm:block" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="gap-2">
                <Star className="h-4 w-4 hidden sm:block" />
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id} className="bg-card overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 md:p-6 gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-mono font-bold text-primary">{order.id}</span>
                            <Badge className={`${statusColors[order.status]} flex items-center gap-1`}>
                              {statusIcons[order.status]}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="font-medium text-foreground">{order.customer}</p>
                          <p className="text-sm text-muted-foreground truncate">{order.email}</p>
                          <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground mb-1">Items:</p>
                          <ul className="text-sm text-muted-foreground">
                            {order.items.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                          {order.instructions && (
                            <p className="text-sm text-accent mt-2 italic">
                              Note: {order.instructions}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
                          <p className="text-xl font-bold text-primary">{order.total}</p>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-full sm:w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="baking">Baking</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <div className="grid lg:grid-cols-3 gap-4 min-h-[400px]">
                {/* Conversations List */}
                <Card className="lg:col-span-1 bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Conversations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {messages.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedChat(conv.id)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedChat === conv.id 
                            ? "bg-primary/10 border border-primary/20" 
                            : "hover:bg-muted"
                        }`}
                      >
                        <p className="font-medium text-foreground">{conv.customer}</p>
                        <p className="text-sm text-muted-foreground">Order: {conv.orderId}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {conv.messages[conv.messages.length - 1]?.text}
                        </p>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Chat Area */}
                <Card className="lg:col-span-2 bg-card flex flex-col">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg">
                      {selectedChat 
                        ? messages.find(m => m.id === selectedChat)?.customer 
                        : "Select a conversation"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    {selectedChat ? (
                      <div className="space-y-3">
                        {messages.find(m => m.id === selectedChat)?.messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-xl ${
                                msg.from === "admin"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                              <p className={`text-xs mt-1 ${
                                msg.from === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}>
                                {msg.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <p>Select a conversation to view messages</p>
                      </div>
                    )}
                  </CardContent>
                  {selectedChat && (
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-4">
              <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-card">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-medium text-foreground">{testimonial.name}</span>
                            <Badge variant={testimonial.status === "approved" ? "default" : "secondary"}>
                              {testimonial.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating
                                    ? "text-amber fill-amber"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">{testimonial.text}</p>
                          <p className="text-sm text-muted-foreground mt-2">{testimonial.date}</p>
                        </div>
                        
                        {testimonial.status === "pending" && (
                          <div className="flex sm:flex-col gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleTestimonialAction(testimonial.id, "approve")}
                              className="flex-1 sm:flex-none"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleTestimonialAction(testimonial.id, "reject")}
                              className="flex-1 sm:flex-none"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {testimonial.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTestimonialAction(testimonial.id, "reject")}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}