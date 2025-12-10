
// src/pages/Admin.tsx - Complete version with backend integration
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/contexts/ProductsContext";
import { categories } from "@/data/products";
import { FloatingCartButton } from "@/components/cart/FloatingCartButton";
import { uploadImage } from "@/utils/uploadImage";

import {
  Package,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Trash2,
  ChefHat,
  AlertCircle,
  Plus,
  Edit,
  Save,
  X,
  ShoppingBag,
  Upload,
  Image as ImageIcon,
  Search,
  Flame,
  Users,
  Loader2  // Add this
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'https://bakerybackend-i7wj.onrender.com';

// const mockMessages = [
//   {
//     id: 1,
//     orderId: "PB-001",
//     customer: "Maria Santos",
//     messages: [
//       { from: "customer", text: "Hi, can I pick up at 2pm instead of 1pm?", time: "10:30" },
//       { from: "admin", text: "Of course! We'll have your order ready at 2pm.", time: "10:35" },
//     ],
//   },
//   {
//     id: 2,
//     orderId: "PB-002",
//     customer: "João Silva",
//     messages: [
//       { from: "customer", text: "Can you add 'Happy Birthday Ana' on the cake?", time: "10:20" },
//     ],
//   },
// ];

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  processing: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  shipped: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  delivered: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  cancelled: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};

const statusIcons = {
  pending: <Clock className="h-3 w-3" />,
  processing: <ChefHat className="h-3 w-3" />,
  shipped: <Package className="h-3 w-3" />,
  delivered: <CheckCircle className="h-3 w-3" />,
  cancelled: <XCircle className="h-3 w-3" />,
};


export default function Admin() {
  const { toast } = useToast();
  const { products = [], addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const [supportConversations, setSupportConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [supportMessage, setSupportMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sendingSupportMessage, setSendingSupportMessage] = useState(false);
  const eventSourceSupportRef = useRef<EventSource | null>(null);
  
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "Pastries",
    price: "",
    image: "",
    description: "",
    ingredients: "",
    weight: "",
    allergens: "",
    calories: "200",
    protein: "5g",
    carbs: "30g",
    fat: "8g",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time SSE connection for admins
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') return;

    console.log('🔌 Connecting to Admin SSE...');

    const eventSource = new EventSource(`${API_URL}/api/sse/admin?token=${token}`);

    eventSource.onopen = () => {
      console.log('✅ Admin SSE connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📡 SSE message received:', data);

        if (data.type === 'new_order') {
          const user = data.order.user?.[0] || {};
          const transformedOrder = {
            id: data.order.orderNumber,
            customer: user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : 'Customer',
            email: user?.email || 'N/A',
            items: data.order.items.map(item => `${item.quantity}x ${item.name}`),
            total: `R${data.order.totalAmount.toFixed(2)}`,
            status: data.order.status,
            date: new Date(data.order.createdAt).toLocaleString(),
            specialInstructions: data.order.specialInstructions || '',
            _id: data.order._id,
            orderNumber: data.order.orderNumber
          };

          setOrders(prevOrders => {
            const exists = prevOrders.some(o => o.orderNumber === transformedOrder.orderNumber);
            if (exists) return prevOrders;
            return [transformedOrder, ...prevOrders];
          });

          toast({
            title: "🔔 New Order Received!",
            description: `Order ${data.order.orderNumber} from ${user.firstName || 'Customer'}`,
          });
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
      console.log('🔌 Closing Admin SSE connection');
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') return;

    console.log('🔌 Connecting to Admin Support Chat SSE...');

    const eventSource = new EventSource(`${API_URL}/api/sse/admin-support?token=${token}`);

    eventSource.onopen = () => {
      console.log('✅ Admin Support Chat SSE connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📡 Support SSE message received:', data);

        if (data.type === 'new_support_message') {
          // Update conversations list
          fetchSupportConversations();

          // If this conversation is currently open, add message
          if (selectedConversation && data.message.userId === selectedConversation.userId) {
            setConversationMessages(prev => {
              if (prev.some(m => m._id === data.message._id)) {
                return prev;
              }
              return [...prev, data.message];
            });
          }

          // Show notification
          toast({
            title: "💬 New Support Message",
            description: `${data.message.fromUserName}: ${data.message.message.substring(0, 50)}...`,
          });
        }
      } catch (error) {
        console.error('Failed to parse support SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('❌ Support SSE error:', error);
      eventSource.close();
    };

    eventSourceSupportRef.current = eventSource;

    return () => {
      console.log('🔌 Closing Admin Support Chat SSE connection');
      eventSource.close();
    };
  }, [selectedConversation]);

  const fetchSupportConversations = async () => {
    setLoadingConversations(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/support/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSupportConversations(data);
      }
    } catch (error) {
      console.error('Error fetching support conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchConversationMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/support/conversation/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setConversationMessages(data);
      }
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchConversationMessages(conversation.userId);
  };

  const handleSendSupportMessage = async () => {
    if (!supportMessage.trim() || !selectedConversation || sendingSupportMessage) return;

    setSendingSupportMessage(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/support/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: supportMessage,
          recipientId: selectedConversation.userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConversationMessages(prev => [...prev, data]);
        setSupportMessage("");

        toast({
          title: "Message sent",
          description: "Your message has been sent to the customer",
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingSupportMessage(false);
    }
  };

  // ADD THIS useEffect TO FETCH CONVERSATIONS ON MOUNT:
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      fetchSupportConversations();
    }
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || user.role !== 'admin') {
        toast({
          title: "Access denied",
          description: "Please log in as admin",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const rawText = await response.text();
      console.log('Raw response:', rawText);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = JSON.parse(rawText);
      const ordersArray = Array.isArray(data) ? data : (data.orders || []);

      const transformedOrders = ordersArray.map(order => {
        const user = order.user?.[0] || order.user || order.userId;
        return {
          id: order.orderNumber,
          customer: user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : 'Customer',
          email: user?.email || 'N/A',
          items: order.items.map(item => `${item.quantity}x ${item.name}`),
          total: `R${order.totalAmount.toFixed(2)}`,
          status: order.status,
          date: new Date(order.createdAt).toLocaleString(),
          specialInstructions: order.specialInstructions || '',
          _id: order._id,
          orderNumber: order.orderNumber
        };
      });

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoadingOrders(false);
    }
  };


  const filteredProducts = Array.isArray(products) && searchQuery.trim()
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : (Array.isArray(products) ? products : []);

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    readyOrders: orders.filter(o => o.status === "delivered").length,
    totalProducts: Array.isArray(products) ? products.length : 0,
  };

  // REPLACE your updateOrderStatus function with this diagnostic version
  // This will help us see exactly what's being sent

  const updateOrderStatus = async (orderNumber, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please log in as admin",
          variant: "destructive",
        });
        return;
      }

      // ✅ DIAGNOSTIC: Log everything we're about to send
      console.log('\n╔════════════════════════════════════════════════╗');
      console.log('║  FRONTEND: UPDATING ORDER STATUS              ║');
      console.log('╚════════════════════════════════════════════════╝');
      console.log('📦 Order Number:', orderNumber);
      console.log('🔄 New Status:', newStatus);
      console.log('🔗 API URL:', API_URL);
      console.log('🌐 Full URL:', `${API_URL}/api/orders/${orderNumber}/status`);
      console.log('🎫 Token:', token.substring(0, 20) + '...');
      console.log('═══════════════════════════════════════════════\n');

      // Show loading state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderNumber === orderNumber
            ? { ...order, status: newStatus, _isUpdating: true }
            : order
        )
      );

      const url = `${API_URL}/api/orders/${orderNumber}/status`;
      const payload = { status: newStatus };

      console.log('📤 Making PUT request...');
      console.log('   URL:', url);
      console.log('   Payload:', JSON.stringify(payload));

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('📥 Response received:');
      console.log('   Status:', response.status, response.statusText);
      console.log('   OK:', response.ok);
      console.log('   Headers:', Object.fromEntries(response.headers.entries()));

      // Get response as text first for debugging
      const responseText = await response.text();
      console.log('📄 Raw Response Text:', responseText);

      // Check if response is ok
      if (!response.ok) {
        let errorMessage = 'Failed to update order status';
        let errorData = null;

        try {
          errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
          console.error('❌ Server error (parsed):', errorData);
        } catch (e) {
          console.error('❌ Non-JSON error response:', responseText);
          errorMessage = `${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      // Parse successful response
      let updatedOrder;
      try {
        updatedOrder = JSON.parse(responseText);
        console.log('✅ Parsed successful response:', updatedOrder);

        // Verify structure
        if (!updatedOrder.orderNumber || !updatedOrder.status) {
          console.error('⚠️ Response missing expected fields');
          console.error('   Expected: orderNumber, status');
          console.error('   Received:', Object.keys(updatedOrder));
          throw new Error('Invalid response structure from server');
        }

        console.log('✅ Response validation passed');

      } catch (e) {
        console.error('❌ Failed to parse success response:', e);
        throw new Error('Invalid response from server');
      }

      // Update local state with confirmed data
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderNumber === orderNumber
            ? { ...order, status: updatedOrder.status, _isUpdating: false }
            : order
        )
      );

      toast({
        title: "Order Updated",
        description: `Order ${orderNumber} status changed to ${newStatus}. Customer has been notified via email.`,
      });

      console.log('✅ Status update completed successfully');
      console.log('═══════════════════════════════════════════════\n');

    } catch (error) {
      console.error('\n╔════════════════════════════════════════════════╗');
      console.error('║  FRONTEND ERROR                                ║');
      console.error('╚════════════════════════════════════════════════╝');
      console.error('❌ Error:', error.message);
      console.error('📦 Order Number:', orderNumber);
      console.error('🔄 Attempted Status:', newStatus);
      console.error('═══════════════════════════════════════════════\n');

      // Remove loading state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderNumber === orderNumber
            ? { ...order, _isUpdating: false }
            : order
        )
      );

      // Refetch to ensure correct state
      console.log('🔄 Refetching orders to sync state...');
      fetchOrders();

      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status. Please try again.",
        variant: "destructive",
      });
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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean,
    productId?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const imageUrl = await uploadImage(file);

      if (isEdit && productId != null) {
        setEditingProduct(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);

        toast({
          title: "Image Uploaded",
          description: "Don't forget to click 'Save Changes' to persist the new image"
        });
      } else {
        setNewProductForm(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);

        toast({
          title: "Image Uploaded",
          description: "Image ready to be used for the new product"
        });
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast({
        title: "Image upload failed",
        description: err?.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProductForm.name || !newProductForm.price) {
      toast({
        title: "Error",
        description: "Please fill in product name and price",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(newProductForm.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Price must be a valid positive number",
        variant: "destructive",
      });
      return;
    }

    const ingredients = newProductForm.ingredients
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);

    const allergens = newProductForm.allergens
      .split(",")
      .map(a => a.trim())
      .filter(Boolean);

    const productData = {
      name: newProductForm.name,
      category: newProductForm.category,
      price: price,
      image: newProductForm.image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
      description: newProductForm.description || `Delicious ${newProductForm.name.toLowerCase()}`,
      ingredients: ingredients.length > 0 ? ingredients : ["Wheat flour", "Water", "Salt"],
      weight: newProductForm.weight || "100g",
      allergens: allergens.length > 0 ? allergens : [],
      nutritionalInfo: {
        calories: parseInt(newProductForm.calories) || 200,
        protein: newProductForm.protein || "5g",
        carbs: newProductForm.carbs || "30g",
        fat: newProductForm.fat || "8g",
      },
    };

    try {
      await addProduct(productData);

      setShowAddProduct(false);
      setNewProductForm({
        name: "",
        category: "Pastries",
        price: "",
        image: "",
        description: "",
        ingredients: "",
        weight: "",
        allergens: "",
        calories: "200",
        protein: "5g",
        carbs: "30g",
        fat: "8g",
      });
      setImagePreview(null);

      toast({
        title: "Product Added",
        description: `${productData.name} has been added to the menu`,
      });
    } catch (err) {
      console.error("❌ Add product error:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      ingredients: product.ingredients.join(", "),
      allergens: product.allergens.join(", "),
    });
    setImagePreview(product.image);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct.name || !editingProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in product name and price",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(editingProduct.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Price must be a valid positive number",
        variant: "destructive",
      });
      return;
    }

    const ingredients = editingProduct.ingredients
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);

    const allergens = editingProduct.allergens
      .split(",")
      .map(a => a.trim())
      .filter(Boolean);

    const productData = {
      ...editingProduct,
      price: price,
      ingredients: ingredients.length > 0 ? ingredients : ["Wheat flour", "Water", "Salt"],
      allergens: allergens.length > 0 ? allergens : [],
    };

    try {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
      setImagePreview(null);

      toast({
        title: "Product Updated",
        description: `${productData.name} has been updated`,
      });
    } catch (err) {
      console.error("❌ Update product error:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.name}"? This will remove it from the menu.`)) {
      try {
        await deleteProduct(id);
        toast({
          title: "Product Deleted",
          description: `${product.name} has been removed from the menu`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingCartButton />
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage orders, products, and communications
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-primary/10">
                    <Package className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
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
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-green-500/10">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.readyOrders}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Delivered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-purple-500/10">
                    <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalProducts}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4 hidden sm:block" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <ShoppingBag className="h-4 w-4 hidden sm:block" />
                Products
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4 hidden sm:block" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="support" className="gap-2">
                <Users className="h-4 w-4 hidden sm:block" />
                Support Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              {loadingOrders ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
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
                          <ul className="text-sm text-muted-foreground mb-3">
                            {order.items.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>

                          {order.specialInstructions && (
                            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                    Special Instructions:
                                  </p>
                                  <p className="text-sm text-amber-800 dark:text-amber-200 break-words">
                                    {order.specialInstructions}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
                          <p className="text-xl font-bold text-primary">{order.total}</p>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.orderNumber, value)}
                          >
                            <SelectTrigger className="w-full sm:w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Product Management</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Add, edit, or remove products from your menu</p>
                </div>
                <Button onClick={() => setShowAddProduct(true)} className="gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

              <div className="w-full mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                    Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
                  </p>
                )}
              </div>

              {showAddProduct && (
                <Card className="mb-6 border-2 border-primary">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg sm:text-xl">Add New Product</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowAddProduct(false);
                          setImagePreview(null);
                          setNewProductForm({
                            name: "",
                            category: "Pastries",
                            price: "",
                            image: "",
                            description: "",
                            ingredients: "",
                            weight: "",
                            allergens: "",
                            calories: "200",
                            protein: "5g",
                            carbs: "30g",
                            fat: "8g",
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Product Name *</label>
                          <Input
                            value={newProductForm.name}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, name: e.target.value })
                            }
                            placeholder="e.g. Chocolate Croissant"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Category *</label>
                          <Select
                            value={newProductForm.category}
                            onValueChange={(v) => setNewProductForm({ ...newProductForm, category: v })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.filter(c => c !== 'All').map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Price (R) *</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newProductForm.price}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, price: e.target.value })
                            }
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Weight</label>
                          <Input
                            value={newProductForm.weight}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, weight: e.target.value })
                            }
                            placeholder="e.g. 85g"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium mb-2 block">Product Image</label>
                          <div className="border-2 border-dashed rounded-lg p-3 sm:p-4 text-center">
                            {imagePreview ? (
                              <div className="space-y-2">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-32 sm:h-40 object-cover rounded"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById('add-image-upload')?.click()}
                                  disabled={isUploading}
                                  className="text-xs sm:text-sm"
                                >
                                  {isUploading ? "Uploading..." : "Change Image"}
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground" />
                                <Button
                                  variant="outline"
                                  onClick={() => document.getElementById('add-image-upload')?.click()}
                                  disabled={isUploading}
                                  size="sm"
                                  className="text-xs sm:text-sm"
                                >
                                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                  {isUploading ? "Uploading..." : "Upload Image"}
                                </Button>
                              </div>
                            )}
                            <input
                              id="add-image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, false)}
                              disabled={isUploading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={newProductForm.description}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, description: e.target.value })
                        }
                        placeholder="Brief description of the product"
                        rows={3}
                        className="text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium mb-2 block">Ingredients (comma-separated)</label>
                      <Input
                        value={newProductForm.ingredients}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, ingredients: e.target.value })
                        }
                        placeholder="e.g. Wheat flour, Butter, Chocolate"
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-medium mb-2 block">Allergens (comma-separated)</label>
                      <Input
                        value={newProductForm.allergens}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, allergens: e.target.value })
                        }
                        placeholder="e.g. Gluten, Dairy, Eggs"
                        className="text-sm"
                      />
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        Nutritional Information
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs font-medium mb-1 block">Calories</label>
                          <Input
                            type="number"
                            value={newProductForm.calories}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, calories: e.target.value })
                            }
                            placeholder="200"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Protein</label>
                          <Input
                            value={newProductForm.protein}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, protein: e.target.value })
                            }
                            placeholder="5g"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Carbs</label>
                          <Input
                            value={newProductForm.carbs}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, carbs: e.target.value })
                            }
                            placeholder="30g"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Fat</label>
                          <Input
                            value={newProductForm.fat}
                            onChange={(e) =>
                              setNewProductForm({ ...newProductForm, fat: e.target.value })
                            }
                            placeholder="8g"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={handleAddProduct} className="flex-1 text-sm" disabled={isUploading}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddProduct(false);
                          setImagePreview(null);
                        }}
                        disabled={isUploading}
                        className="text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-3 sm:p-4">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <label className="text-xs sm:text-sm font-medium mb-2 block">Product Name *</label>
                                <Input
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium mb-2 block">Category</label>
                                <Select value={editingProduct.category} onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v })}>
                                  <SelectTrigger className="text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.filter(c => c !== 'All').map(cat => (
                                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium mb-2 block">Price (R)</label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.price}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs sm:text-sm font-medium mb-2 block">Weight</label>
                                <Input
                                  value={editingProduct.weight}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                                  className="text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs sm:text-sm font-medium mb-2 block">Product Image</label>
                              <div className="border-2 border-dashed rounded-lg p-3 sm:p-4">
                                <img src={imagePreview || editingProduct.image} alt={editingProduct.name} className="w-full h-32 sm:h-40 object-cover rounded mb-2" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs sm:text-sm"
                                  onClick={() => document.getElementById(`edit-image-${product.id}`)?.click()}
                                  disabled={isUploading}
                                >
                                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                  {isUploading ? "Uploading..." : "Change Image"}
                                </Button>
                                <input
                                  id={`edit-image-${editingProduct.id}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, true, editingProduct.id)}
                                  disabled={isUploading}
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium mb-2 block">Description</label>
                            <Textarea
                              value={editingProduct.description}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              rows={2}
                              className="text-sm resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium mb-2 block">Ingredients (comma-separated)</label>
                            <Input
                              value={editingProduct.ingredients}
                              onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs sm:text-sm font-medium mb-2 block">Allergens (comma-separated)</label>
                            <Input
                              value={editingProduct.allergens}
                              onChange={(e) => setEditingProduct({ ...editingProduct, allergens: e.target.value })}
                              className="text-sm"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={handleSaveEdit} className="flex-1 text-sm" disabled={isUploading}>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => {
                              setEditingProduct(null);
                              setImagePreview(null);
                            }} disabled={isUploading} className="text-sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full sm:w-20 md:w-24 h-48 sm:h-20 md:h-24 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4 mb-2">
                              <div className="flex-1 min-w-0 w-full sm:w-auto">
                                <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">{product.name}</h3>
                                <Badge variant="outline" className="mt-1 text-xs">{product.category}</Badge>
                              </div>
                              <p className="text-lg sm:text-xl font-bold text-primary whitespace-nowrap">R{product.price.toFixed(2)}</p>
                            </div>
                            {product.description && (
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                            )}
                            {product.weight && (
                              <p className="text-xs text-muted-foreground">Weight: {product.weight}</p>
                            )}
                            {product.ingredients && product.ingredients.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                Ingredients: {product.ingredients.join(", ")}
                              </p>
                            )}
                            {product.allergens && product.allergens.length > 0 && (
                              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                Allergens: {product.allergens.join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 sm:flex-initial text-xs sm:text-sm"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 sm:flex-initial text-xs sm:text-sm"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Messages Tab
            <TabsContent value="messages" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Conversations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {messages.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => setSelectedChat(chat)}
                          className={`w-full p-4 text-left hover:bg-accent transition-colors ${selectedChat?.id === chat.id ? "bg-accent" : ""}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-foreground">{chat.customer}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">Order {chat.orderId}</p>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {chat.messages[chat.messages.length - 1].text}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  {selectedChat ? (
                    <>
                      <CardHeader className="border-b">
                        <div>
                          <CardTitle>{selectedChat.customer}</CardTitle>
                          <p className="text-sm text-muted-foreground">Order {selectedChat.orderId}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                          {selectedChat.messages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${msg.from === "admin"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                                  }`}
                              >
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          />
                          <Button onClick={sendMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                      <div className="text-center text-muted-foreground">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent> */}

            <TabsContent value="support" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Conversations List */}
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Support Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {loadingConversations ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : supportConversations.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No support conversations yet</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {supportConversations.map((conversation) => (
                          <button
                            key={conversation.userId}
                            onClick={() => handleSelectConversation(conversation)}
                            className={`w-full p-4 text-left hover:bg-accent transition-colors ${selectedConversation?.userId === conversation.userId ? "bg-accent" : ""
                              }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-foreground truncate">{conversation.userName}</p>
                              {conversation.messageCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {conversation.messageCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-1">{conversation.userEmail}</p>
                            <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(conversation.lastMessageTime).toLocaleString()}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="md:col-span-2">
                  {selectedConversation ? (
                    <>
                      <CardHeader className="border-b">
                        <div>
                          <CardTitle>{selectedConversation.userName}</CardTitle>
                          <p className="text-sm text-muted-foreground">{selectedConversation.userEmail}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                          {conversationMessages.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No messages yet</p>
                          ) : (
                            conversationMessages.map((msg) => {
                              const isFromAdmin = msg.isFromAdmin;
                              return (
                                <div
                                  key={msg._id}
                                  className={`flex ${isFromAdmin ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[80%] rounded-lg p-3 ${isFromAdmin
                                        ? "bg-primary text-primary-foreground"
                                        : msg.isAutoReply
                                          ? "bg-amber-100 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 border border-amber-200"
                                          : "bg-muted"
                                      }`}
                                  >
                                    {msg.fromUserName && (
                                      <p className="text-xs font-semibold mb-1 opacity-80">
                                        {msg.fromUserName}
                                      </p>
                                    )}
                                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={supportMessage}
                            onChange={(e) => setSupportMessage(e.target.value)}
                            placeholder="Type your message..."
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendSupportMessage();
                              }
                            }}
                            disabled={sendingSupportMessage}
                          />
                          <Button onClick={handleSendSupportMessage} disabled={sendingSupportMessage}>
                            {sendingSupportMessage ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                      <div className="text-center text-muted-foreground">
                        <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p>Select a conversation to start messaging</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}